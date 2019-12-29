import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { getCurrencyFormat } from '../utility/utility';
import SpendingMap from '../components/overview/SpendingMap';
import MaxExpense from '../components/overview/MaxExpense';
import AddExpenseButton from '../components/AddExpenseButton';
import DaySummary from '../components/overview/DaySummary';

class EmptyCell {
    constructor(date) {
        this.date = date;
        this.amount = 0;
    }
}

class PaddingCell {
    constructor(date) {
        this.date = date;
        this.type = 'padding';
    }
}

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const useStyles = makeStyles({
    container: {
        display: 'flex',
        justifyContent: 'center',
    },
    page: {
        boxSizing: 'border-box',
        flex: 1,
        padding: '2vh 10px 0 10px',
        height: '100vh - 50px',
        maxWidth: '1200px',
        '& h1': {
            margin: '10px 0',
            padding: '10px 0',
        },
    },
    error: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: '1.5em',
        display: 'block',
        padding: '10px 0',
    },
    summaryItem: {
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #00000020',
        padding: '10px',
        margin: '10px 0',
        '& label': {
            padding: '5px',
        },
        '& h2': {
            padding: '5px',
            margin: 0,
        },
    },
});

function DailySummary({ start, end, history }) {
    const classes = useStyles();
    const [data, setData] = useState([]);
    const [step, setStep] = useState(0);
    const [max, setMax] = useState(null);
    const [average, setAverage] = useState({ length: 0, average: 0, total: 0 });
    const [error, setError] = useState(null);
    const [day, setDay] = useState(null);

    useEffect(() => {
        // if selected day out of range, reset the daily summary
        if (day) {
            const date = new Date(day.date);
            if (date < new Date(start) || date > new Date(end)) setDay(null);
        }
        fetchDailySummary();
    }, [start, end]);

    async function fetchDailySummary() {
        const res = await fetch(`/api/users/expenses/overview?start=${start}&end=${end}`);
        if (res.ok) {
            const data = await res.json();
            if (data.expenses) {
                formatData(data.expenses);
                return;
            }
        }
        console.error('Error fetching data');
        setError('There was an error fetching your expense data');
    }

    function formatData(data) {
        // Insert zero days in between
        const [yearS, monthS, dayS] = start.split('-');
        const startDate = new Date(Date.UTC(yearS, monthS - 1, dayS));
        const offsetCount = startDate.getUTCDay();
        let range = (new Date(end) - (startDate - 86400000)) / 86400000;

        let result = [];
        let total = 0;
        let max = { amount: 0, date: start };
        for (let i = 0, j = 0; i < range; i++) {
            const date = new Date(
                startDate.getUTCFullYear(),
                startDate.getUTCMonth(),
                startDate.getUTCDate() + i
            );
            let dateStr = `${date.getUTCFullYear()}-${(date.getUTCMonth() < 9 ? '0' : '') +
                (date.getUTCMonth() + 1)}-${(date.getUTCDate() < 10 ? '0' : '') +
                date.getUTCDate()}`;
            if (data[j] && data[j]['date'] === dateStr) {
                result.push(data[j]);
                max = data[j]['amount'] > max.amount ? data[j] : max;
                total += data[j]['amount'];
                j++;
            } else {
                result.push(new EmptyCell(dateStr));
            }
        }

        // Add padding to the front
        let offset = [];
        for (let i = 0; i < offsetCount; i++) {
            offset.push(new PaddingCell());
        }
        result.unshift(...offset);

        // Add padding to the back
        const padding = 7 - (result.length % 7);
        if (padding < 7) {
            let backPadding = [];
            for (let i = 0; i < padding; i++) backPadding.push(new PaddingCell());
            result.push(...backPadding);
        }

        setAverage({ average: total / range, length: range, total });
        setStep(Math.ceil(max.amount / 4));
        setMax(max);
        setData(result);
    }

    return (
        <div className={classes.container}>
            <div className={classes.page}>
                <h1>Period Summary</h1>
                <label>{`From ${start} to  ${end}`}</label>
                {error ? <label className={classes.error}>{error}</label> : null}
                <SpendingMap data={data} step={step} setDay={setDay} day={day} />
                <div>
                    <DaySummary day={day} />
                    <MaxExpense max={max} />
                    <div className={classes.summaryItem}>
                        <h2>Daily Average</h2>
                        <label>{`${average.length} days`}</label>
                        <label>{`$${getCurrencyFormat(average.average)}/day`}</label>
                        <label>{`$${getCurrencyFormat(average.total)} total`}</label>
                    </div>
                </div>
            </div>
            <AddExpenseButton history={history} />
        </div>
    );
}

const mapStateToProps = state => {
    const { date } = state;
    const { start, end } = date.period;
    return { date, start, end };
};

export default connect(mapStateToProps)(DailySummary);
