import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';

import PieLegend from '../components/pie_overview/PieLegend';
import PieChart from '../components/pie_overview/PieChart';

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
});

function AggregateOverview({ start, end, match }) {
    const classes = useStyles();
    const [type, setType] = useState(match.params.type);
    const [total, setTotal] = useState(0);
    const [data, setData] = useState([]);
    const [width, setWidth] = useState(window.innerWidth);
    const [legendOpen, setLegendOpen] = useState(false);

    // Set window resizing listener
    useEffect(() => {
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    // update type param
    useEffect(() => {
        setType(match.params.type);
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
        console.log(match.params.type, type);
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

    return (
        <div className={classes.container}>
            <div className={classes.page}>
                <h1>{`${type === 'cat' ? 'Category' : 'Store'} Overview`}</h1>
                <div className={classes.graph}>
                    <PieChart data={data} total={total} />
                    <PieLegend
                        open={legendOpen}
                        setLegendOpen={setLegendOpen}
                        width={width}
                        data={data}
                    />
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
