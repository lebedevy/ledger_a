import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';

import PieLegend from '../components/pie_overview/PieLegend';

// ADD SUPPORT FOR RANDOM COLORS
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
    svgContainer: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
    },
    svg: {
        width: '80vw',
        maxWidth: '500px',
        transform: 'rotate(-0.25turn)',
    },
});

function CategoryOverview({ start, end }) {
    const classes = useStyles();
    const [total, setTotal] = useState(0);
    const [data, setData] = useState([]);
    const [width, setWidth] = useState(window.innerWidth);
    const [legendOpen, setLegendOpen] = useState(false);

    function updateWidth() {
        console.log(window.innerWidth);
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', updateWidth);
        fetchExpenses();
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    async function fetchExpenses() {
        console.log('Getting category expenses overview');
        const res = await fetch(`/api/users/expenses/summary/cat?start=${start}&end=${end}`);
        if (res.ok) {
            const data = await res.json();
            setTotal(getTotal(data));
            setData(data);
            console.log(data);
            return;
        }
        console.log('Error fetching data');
        console.log(await res.json());
    }

    function getTotal(data) {
        let total = 0;
        data.forEach(el => (total += el.amount));
        return total;
    }

    return (
        <div className={classes.container}>
            <div className={classes.page}>
                <h1>Category Overview</h1>
                <div className={classes.graph}>
                    <div className={classes.svgContainer}>
                        <svg viewBox="-1 -1 2 2" className={classes.svg}>
                            {drawCircle(data, total)}
                            <circle r=".5" fill="#FEFCFB" />
                        </svg>
                    </div>
                    <PieLegend
                        open={legendOpen}
                        setLegendOpen={setLegendOpen}
                        width={width}
                        colors={colors}
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

export default connect(mapStateToProps)(CategoryOverview);

function getCooridnatesForPercent(percent) {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);

    return [x, y];
}

function drawCircle(data, total) {
    let cumulativePercent = 0;
    let lines = [];
    let slices = [];
    data.forEach((slice, ind) => {
        const [startX, startY] = getCooridnatesForPercent(cumulativePercent);
        slice.percent = slice.amount / total;
        cumulativePercent += slice.percent;
        const [endX, endY] = getCooridnatesForPercent(cumulativePercent);
        const largeArc = slice.percent > 0.5 ? 1 : 0;
        const path = `M ${startX} ${startY} A 1 1 0 ${largeArc} 1 ${endX} ${endY} L 0 0`;
        lines.push(
            <line
                x1={endX}
                y1={endY}
                x2={0}
                y2={0}
                stroke="#FEFCFB"
                strokeWidth="0.005"
                style={{ zIndex: 1 }}
            />
        );
        slices.push(<path key={slice.id} d={path} fill={`#${colors[ind]}`} />);
    });
    return [...slices, ...lines];
}
