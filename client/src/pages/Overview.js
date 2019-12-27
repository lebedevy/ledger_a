import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { getCurrencyFormat } from '../utility/utility';
import AddExpenseButton from '../components/AddExpenseButton';

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

const dayGrade = ['empty', 'first', 'second', 'third'];
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const cellSize = 12;

const useStyles = makeStyles({
    container: {
        display: 'flex',
        // flexDirection: 'column',
        // alignItems: 'center',
        justifyContent: 'center',
    },
    page: {
        boxSizing: 'border-box',
        flex: 1,
        // background: 'yellow',
        padding: '2vh 10px 0 10px',
        height: '100vh - 50px',
        maxWidth: '1200px',
        '& h1': {
            margin: '10px 0',
            padding: '10px 0',
        },
    },
    spendingMap: {
        background: '#E8EBE4',
        border: '1px solid #00000020',
        borderRadius: '2px',
        padding: '10px',
        margin: '10px 0',
    },
    period: {
        display: 'grid',
        gridAutoFlow: 'column',
        gridTemplateRows: `repeat(7, ${cellSize}px)`,
        gridTemplateColumns: `repeat( auto-fit, minmax(${cellSize}px, ${cellSize}px) )`,
        gridGap: '2px',
        overflowX: 'auto',
    },
    error: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: '1.5em',
        display: 'block',
        padding: '10px 0',
    },
    day: {
        height: `${cellSize}px`,
        width: `${cellSize}px`,
        background: 'gray',
    },
    paddingDay: {
        background: '#ADBABD',
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
    legend: {
        paddingTop: '15px',
        display: 'grid',
        // gridAutoFlow: 'column',
        // gridTemplateRows: 'repeat(7, 10px)',
        gridTemplateColumns: `repeat( auto-fit, minmax(${cellSize}px, ${cellSize}px) )`,
        gridGap: '2px',
    },
    empty: {
        background: 'gray',
    },
    first: {
        background: '#7bc96f',
    },
    second: {
        background: '#239a3b',
    },
    third: {
        background: '#196127',
    },
});

function DailySummary({ start, end, history }) {
    const classes = useStyles();
    const [data, setData] = useState([]);
    const [step, setStep] = useState(0);
    const [max, setMax] = useState({ amount: 0, date: start });
    const [average, setAverage] = useState({ length: 0, average: 0, total: 0 });
    const [error, setError] = useState(null);

    useEffect(() => {
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
                <SpendingMap data={data} step={step} />
                <div>
                    <div className={classes.summaryItem}>
                        <h2>Max Daily Expense</h2>
                        <label>{max.date}</label>
                        <label>{`$${getCurrencyFormat(max.amount)}`}</label>
                    </div>
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

function SpendingMap({ data, step }) {
    const classes = useStyles();
    return (
        <div className={classes.spendingMap}>
            <div className={classes.period}>
                {data.map((el, ind) =>
                    el.type === 'padding' ? (
                        <div key={ind} className={clsx(classes.day, classes.paddingDay)} />
                    ) : (
                        <div
                            key={el.date}
                            className={clsx(
                                classes.day,
                                classes[
                                    dayGrade[
                                        Math.ceil(el.amount / step) > 3
                                            ? 3
                                            : Math.ceil(el.amount / step)
                                    ]
                                ]
                            )}
                            title={`${el.date}\n$${el.amount}`}
                        />
                    )
                )}
            </div>
            <div className={classes.legend}>
                {/* <label>less</label> */}
                <div className={clsx(classes.day, classes.empty)} title={0} />
                <div
                    className={clsx(classes.day, classes.first)}
                    title={`upto $${getCurrencyFormat(step)}`}
                />
                <div
                    className={clsx(classes.day, classes.second)}
                    title={`upto $${getCurrencyFormat(step * 2)}`}
                />
                <div
                    className={clsx(classes.day, classes.third)}
                    title={`over $${getCurrencyFormat(step * 3)}`}
                />
                {/* <label>more</label> */}
            </div>
        </div>
    );
}
