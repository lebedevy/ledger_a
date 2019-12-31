import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';

import PieLegend from '../components/pie_overview/PieLegend';
import PieChart from '../components/pie_overview/PieChart';
import ExpenseSummary from '../components/ExpenseSummary';
import { getCurrencyFormat } from '../utility/utility';

// ADD SUPPORT FOR RANDOM COLOR GENERATION
const colors = [
    '7DBBC3',
    'DE6B48',
    'F4B9B2',
    '247BA0',
    'E5B181',
    '2E9B56',
    '8EB19D',
    'E4572E',
    'C2095A',
    'F25F5C',
    'B57BA6',
    'CECCCE',
    'FEB95F',
    '42CAFD',
    'F71735',
    'F0D2D1',
    '29335C',
    'F3A712',
    'A8C686',
    'FFE066',
];

const useStyles = makeStyles({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    page: {
        flex: 1,
        padding: '10px',
        maxWidth: '1200px',
    },
    graph: {
        padding: '20px 0',
        position: 'relative',
        background: '#FEFCFB',
        border: 'solid #00000020 1px',
        display: 'flex',
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

function AggregateOverview({ start, end, match }) {
    const classes = useStyles();
    const [type, setType] = useState(match.params.type);
    const [total, setTotal] = useState(0);
    const [data, setData] = useState([]);
    const [width, setWidth] = useState(window.innerWidth);
    const [selected, setSelected] = useState(null);
    const [legendOpen, setLegendOpen] = useState(false);

    // Set window resizing listener
    useEffect(() => {
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    // update type param
    useEffect(() => {
        setType(match.params.type);
        setSelected(null);
    }, [match]);

    // Fetch expenses on type change
    useEffect(() => {
        fetchExpenses();
    }, [type]);

    function updateWidth() {
        console.log(window.innerWidth);
        setWidth(window.innerWidth);
    }

    async function fetchExpenses() {
        console.log(`Getting ${type == 'cat' ? 'category' : 'store'} expenses overview`);
        const res = await fetch(`/api/users/expenses/summary/${type}?start=${start}&end=${end}`);
        if (res.ok) {
            const data = await res.json();
            formatData(data);
            return;
        }
        console.log('Error fetching data');
        console.log(await res.json());
    }

    function formatData(data) {
        let total = 0;
        data.forEach((el, ind) => {
            total += el.amount;
            el.color = colors[ind];
        });
        console.log(data);
        setTotal(total);
        setData(data);
    }

    const getDetails = async el => {
        if (el) {
            console.log(`Getting ${type == 'cat' ? 'category' : 'store'} details`);
            console.log(el);
            const res = await fetch(
                `/api/users/expenses/overview/${type}/details?start=${start}&end=${end}&id=${el.id}`
            );
            if (res.ok) {
                const data = await res.json();
                console.log(data.expenses);
                const selected = { data: data.expenses, el };
                setSelected(selected);
                return;
            }
            console.error('Error fetching data');
            console.log(await res.json());
        } else setSelected(null);
    };

    return (
        <div className={classes.container}>
            <div className={classes.page}>
                <h1>{`${type === 'cat' ? 'Category' : 'Store'} Overview`}</h1>
                <div className={classes.graph}>
                    <PieChart data={data} total={total} setSelected={getDetails} />
                    <PieLegend
                        open={legendOpen}
                        setLegendOpen={setLegendOpen}
                        width={width}
                        data={data}
                        setSelected={getDetails}
                    />
                </div>
                <div className={classes.summaryItem}>
                    {!selected ? (
                        <React.Fragment>
                            <h2 style={{ paddingLeft: '32px' }}>Details</h2>
                            <label style={{ paddingLeft: '32px' }}>{`Select a ${
                                type === 'cat' ? 'category' : 'store'
                            } from the graph or legend to see its details`}</label>
                        </React.Fragment>
                    ) : (
                        <AggregateDetails selected={selected} type={type} />
                    )}
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    const { date } = state;
    const { start, end } = date.period;
    return { start, end };
};

export default connect(mapStateToProps)(AggregateOverview);

const detailsUseStyles = makeStyles({
    selectedTitle: {
        display: 'flex',
        alignItems: 'center',
        // justifyContent: 'space-between',
        paddingBottom: '10px',
        '& h2': {
            wordBreak: 'break-all',
            '& label': {
                fontSize: '0.9em',
                fontStyle: 'italic',
                verticalAlign: 'center',
            },
        },
        '& div': {
            minHeight: '32px',
            minWidth: '32px',
            borderRadius: '50%',
        },
    },
});

function AggregateDetails({ selected, type }) {
    const classes = detailsUseStyles();
    const [total, setTotal] = useState(0);

    console.log(selected);

    useEffect(() => {
        let total = 0;
        selected.data.forEach(el => (total += el.amount));
        setTotal(total);
    }, [selected]);

    return (
        <React.Fragment>
            <div className={classes.selectedTitle}>
                <div style={{ background: `#${selected.el.color}` }} />
                <h2>
                    Details:
                    <label>{`${
                        selected.el[type === 'cat' ? 'category_name' : 'store_name']
                    }`}</label>
                </h2>
            </div>
            <label>{`Total ${type == 'cat' ? 'category' : 'store'} expense: $${getCurrencyFormat(
                total
            )}`}</label>
            {selected.data.map(el => (
                <ExpenseSummary el={el} exclude={{ [type == 'cat' ? 'category' : 'store']: 1 }} />
            ))}
        </React.Fragment>
    );
}
