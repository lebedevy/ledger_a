import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { IconButton } from '@material-ui/core';

import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';

const colors = [
    '7DBBC3',
    'DE6B48',
    'F4B9B2',
    '247BA0',
    'E5B181',
    '2E9B56',
    'FFE066',
    'F25F5C',
    'B57BA6',
];

const useStyles = makeStyles({
    legend: {
        background: '#E7E5E8',
        display: 'flex',
        margin: '0 10px',
        flexDirection: 'column',
        maxWidth: '200px',
        overflow: 'auto',
        padding: '0 5px',
        border: 'solid 1px #00000020',
        borderRadius: '5px',
        overflow: 'auto',
        height: '80vw',
        maxHeight: '500px',
    },
    legendMobile: {
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        maxWidth: '200px',
        top: 0,
        right: 0,
    },
    open: {
        bottom: 0,
        overflow: 'auto',
        background: '#00000070',
    },
    legendItem: {
        padding: '5px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        // border: '#ffffff99 1px solid',
    },
    legendOpenButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '10px',
        fontWeight: 'bold',
    },
    legendOpenTitle: {
        color: 'white',
    },
    legendTitle: {
        textAlign: 'center',
    },
    legendTitleMobile: {
        flex: 1,
        textAlign: 'center',
    },
});

function CategoryOverview({ open, setLegendOpen, width, data }) {
    const classes = useStyles();

    return (
        <React.Fragment>
            {width <= 700 ? (
                <div className={clsx(classes.legendMobile, open && classes.open)}>
                    <div>
                        <div
                            className={clsx(
                                classes.legendOpenButton,
                                open && classes.legendOpenTitle
                            )}
                            onClick={() => setLegendOpen(!open)}
                            title={open ? 'Hide legend' : 'Show legend'}
                        >
                            {open ? <KeyboardArrowRightIcon /> : <KeyboardArrowLeftIcon />}
                            <label className={classes.legendTitleMobile}>Legend</label>
                        </div>
                    </div>
                    {open ? (
                        <div>
                            {data.map((el, ind) => (
                                <div
                                    key={el.id}
                                    className={classes.legendItem}
                                    style={{ background: `#${colors[ind]}` }}
                                >
                                    <label>{el['category_name']}</label>
                                    <label>{` ${Math.round(el.percent * 100)}%`}</label>
                                </div>
                            ))}
                        </div>
                    ) : null}
                </div>
            ) : null}
            {width > 700 ? (
                <div className={classes.legend}>
                    <h2 className={classes.legendTitle}>Legend</h2>
                    {data.map((el, ind) => (
                        <div
                            key={el.id}
                            className={classes.legendItem}
                            style={{ background: `#${colors[ind]}` }}
                        >
                            <label style={{ paddingRight: '5px' }}>{el['category_name']}</label>
                            <label>{` ${Math.round(el.percent * 100)}%`}</label>
                        </div>
                    ))}
                </div>
            ) : null}
        </React.Fragment>
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
