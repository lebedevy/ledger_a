import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';

import { getDateObj } from '../../utility/utility';
import { connect } from 'react-redux';

const useStyles = makeStyles({
    svg: {
        border: '1px solid #00000020',
        minHeight: '200px',
    },
    weekLabel: {
        fontSize: '0.8em',
    },
});

function WeeklySummary({ expenses, start, end, mobile }) {
    const classes = useStyles();
    const [weekly, setWeekly] = useState(null);
    const [maxWeekly, setMaxWeekly] = useState(0);
    const [showGrid, setShowGrid] = useState(false);

    useEffect(() => {
        groupByWeek();
    }, [expenses]);

    function groupByWeek() {
        // Aggeragets expenses by week
        const weekDataPlot = [];
        let endDate = getDateObj(end);
        endDate.setDate(endDate.getDate() + 7 - endDate.getDay());
        let date = getDateObj(start);
        date.setDate(date.getDate() + 7 - date.getDay());
        let i = 0,
            week = 0,
            max = 0;
        while (date <= endDate) {
            // Add expense to week while expense date less than week end date
            while (i < expenses.length) {
                if (date <= getDateObj(expenses[i].date)) break;
                week += expenses[i].amount;
                i++;
            }
            max = max < week ? week : max;
            weekDataPlot.push(week);
            week = 0;
            date.setDate(date.getDate() + 7);
        }
        console.log(weekDataPlot);
        setMaxWeekly(max);
        setWeekly(weekDataPlot);
    }

    return (
        <>
            <input onChange={() => setShowGrid(!showGrid)} type="checkbox" />
            <svg className={classes.svg}>
                {(() => {
                    const gridLines = [];
                    for (let i = 0; i < 10; i++) {
                        gridLines.push(
                            <line
                                x1="0%"
                                x2="100%"
                                y1={`${10 * i}%`}
                                y2={`${10 * i}%`}
                                stroke="#B57BA6"
                            />,
                            <line
                                y1="0%"
                                y2="100%"
                                x1={`${10 * i}%`}
                                x2={`${10 * i}%`}
                                stroke="#B57BA6"
                            />
                        );
                    }
                    return showGrid ? gridLines : [];
                })()}
                {(() => {
                    const gridLines = [];
                    for (let i = 0; i < 6; i++) {
                        gridLines.push(
                            <line
                                x1="10%"
                                x2="90%"
                                y1={`${10 + i * (80 / 6)}%`}
                                y2={`${10 + i * (80 / 6)}%`}
                                stroke="#00000020"
                            />
                        );
                    }
                    return gridLines;
                })()}
                {weekly &&
                    weekly.map((el, ind) => {
                        console.log(el, maxWeekly);
                        return (
                            <React.Fragment>
                                <circle
                                    cx={`${10 + (80 / weekly.length) * ind}%`}
                                    cy={`${10 + (maxWeekly - el) * (80 / maxWeekly)}%`}
                                    r={3}
                                />
                                <text
                                    className={classes.weekLabel}
                                    x={`${10 + (80 / weekly.length) * ind}%`}
                                    y="97%"
                                    textAnchor={mobile ? '' : 'middle'}
                                    writingMode={mobile ? 'tb' : ''}
                                >{`Week ${ind + 1}`}</text>
                            </React.Fragment>
                        );
                    })}
                <line x1="10%" x2="10%" y1="90%" y2="10%" stroke="#00000090" />
                <line x1="10%" x2="90%" y1="90%" y2="90%" stroke="#00000090" />
            </svg>
        </>
    );
}

const mapStateToProps = (state) => {
    const { start, end } = state.date.period;
    const { mobile } = state.screen;
    return { start, end, mobile };
};

export default connect(mapStateToProps)(WeeklySummary);
