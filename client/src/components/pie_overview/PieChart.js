import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    svgContainer: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        // '& path': {
        //     '&:hover': {
        //         stroke: 'black',
        //         strokeWidth: '0.005',
        //     },
        // },
    },
    svg: {
        width: '80vw',
        maxWidth: '500px',
        transform: 'rotate(-0.25turn)',
    },
});

function CategoryOverview({ data, total }) {
    const classes = useStyles();

    return (
        <div className={classes.svgContainer}>
            <svg viewBox="-1.1 -1.1 2.2 2.2" className={classes.svg}>
                {drawCircle(data, total)}
                <circle r=".75" fill="#FEFCFB" />
            </svg>
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
    data.forEach(slice => {
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
        slices.push(<path key={slice.id} d={path} fill={`#${slice.color}`} />);
    });
    return [...slices, ...lines];
}
