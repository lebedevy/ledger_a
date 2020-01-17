import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { CircularProgress } from '@material-ui/core';
import { getFormatedDate } from '../../utility/utility';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
    },
    svg: {
        alignSelf: 'center',
        width: '80vw',
        maxWidth: '99%',
        height: '200px',
        maxHeight: '300px',
        // transform: 'rotate(-0.25turn)',
        // background: 'yellow',
        border: '1px solid #00000030',
        borderRadius: '3px',
        fontSize: '10px',
    },
    chartGrid: {
        stroke: '#000000',
    },
});

let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

function OverviewDetailsTrends({ selected, type, start, end }) {
    const classes = useStyles();
    const [data, setData] = useState(null);
    const [max, setMax] = useState(null);

    useEffect(() => {
        if (selected) getData();
    }, [selected]);

    async function getData() {
        // console.log(selected);
        console.log(start);
        const currentDate = new Date(end);
        const [year, month] = [currentDate.getFullYear(), currentDate.getMonth()];
        // Get one year period
        const endDate = getFormatedDate(new Date(year, month + 1, 0));
        const startDate = getFormatedDate(new Date(year - 1, month + 1, 1));
        console.log(startDate, start);
        console.log(endDate, end);
        const res = await fetch(
            `/api/users/expenses/overview/${type}/trends?start=${startDate}&end=${endDate}&id=${selected.el.id}`
        );
        console.log(res);
        if (res.ok) {
            const data = await res.json();
            console.log(data);
            console.log(endDate.slice(5, 7));
            const formatted = formatData(data.expenses, startDate);
            setData(formatted);
            return data;
        }
        return null;
    }

    function formatData(data, start) {
        let formatted = [];
        let max = 0;
        let startMonth = parseInt(start.slice(5, 7)) - 1;
        let year = parseInt(start.slice(0, 4));
        console.log('Start year', year);
        if (startMonth < 0) startMonth = 11;
        for (let i = 0, ind = 0; i < 12; i++) {
            let month = i + startMonth >= 12 ? i + startMonth - 12 : i + startMonth;
            let monthItem = {};
            monthItem.month = months[month];
            monthItem.year = (year % 100) + '';
            if (monthItem.month === 'Dec') year++;
            if (data[ind] && parseInt(data[ind]['txn_date'].slice(5, 7)) - 1 === month) {
                monthItem['amount'] = data[ind]['amount'];
                max = data[ind]['amount'] > max ? data[ind]['amount'] : max;
                ind++;
            } else {
                monthItem['amount'] = 0;
            }

            formatted.push(monthItem);
        }
        // Make sure 6 divides evenly into max to allow for round grid line labels on the barchart
        if (max % 6 !== 0) max += 6 - (max % 6);
        setMax(max);
        return formatted;
    }

    // Bar chart positioning variables
    const topOffset = 15;
    const barHeight = 70;
    const rightOffset = 3;
    const barWidth = 6;

    return (
        <div className={classes.container}>
            <h3>
                Trends Overview:
                <label>{`${selected.el[type === 'cat' ? 'category_name' : 'store_name']}`}</label>
            </h3>
            {data ? null : <CircularProgress style={{ alignSelf: 'center', margin: '10px' }} />}
            <svg className={classes.svg}>
                {(() => {
                    let gridlines = [];
                    for (let i = 0; i < 6; i++) {
                        let y = topOffset + i * (barHeight / 6);
                        let label = max - i * (max / 6);
                        gridlines.push(
                            <text key={'amountLabel' + i} x="0.5%" y={`${y + 2}%`}>
                                {label >= 1000
                                    ? (Math.ceil(label / 100) / 10).toFixed(1) + 'k'
                                    : label}
                            </text>,
                            <line
                                key={'gridLine' + i}
                                className={classes.gridLines}
                                y1={`${y}%`}
                                y2={`${y}%`}
                                x1="98.5%"
                                x2={`${rightOffset - 0.5}%`}
                                stroke="#00000035"
                            />
                        );
                    }
                    return gridlines;
                })()}
                <line
                    y1={`${topOffset + 6 * (barHeight / 6)}%`}
                    y2={`${topOffset + 6 * (barHeight / 6)}%`}
                    x1="98.5%"
                    x2={`${rightOffset - 0.5}%`}
                    stroke="#00000090"
                />
                <line
                    y1={`${5 + 6 * (80 / 6)}%`}
                    y2="5%"
                    x1={`${rightOffset - 0.5}%`}
                    x2={`${rightOffset - 0.5}%`}
                    stroke="#00000090"
                />
                {data
                    ? data.map((el, ind) => (
                          <React.Fragment key={el.month + 'container'}>
                              {/* The first rec is to catch hover events for small rects*/}
                              <rect
                                  key={el.month + 'barBackup'}
                                  x={`${rightOffset + 8 * ind}%`}
                                  y={`${topOffset}%`}
                                  width={`${barWidth}%`}
                                  height={`${barHeight}%`}
                                  style={{ fill: '#00000000' }}
                              />
                              <rect
                                  key={el.month + 'bar'}
                                  x={`${rightOffset + 8 * ind}%`}
                                  y={`${topOffset + barHeight - barHeight * (el.amount / max)}%`}
                                  width={`${barWidth}%`}
                                  height={`${barHeight * (el.amount / max)}%`}
                                  style={{ fill: '#F75C03' }}
                              />
                              <text
                                  key={el.month + 'amountLabel'}
                                  x={`${rightOffset + barWidth / 2 + 8 * ind}%`}
                                  y={`${topOffset +
                                      barHeight -
                                      barHeight * (el.amount / max) -
                                      3}%`}
                                  textAnchor="middle"
                              >
                                  {`$${
                                      el.amount >= 1000
                                          ? (el.amount / 1000).toFixed(2) + 'k'
                                          : Math.round(el.amount)
                                  }`}
                              </text>
                              <text
                                  key={el.month + 'label'}
                                  x={`${rightOffset + barWidth / 2 + 8 * ind}%`}
                                  y={`${95}%`}
                                  textAnchor="middle"
                              >
                                  {`${el.month} ${el.year}`}
                              </text>
                          </React.Fragment>
                      ))
                    : null}
            </svg>
        </div>
    );
}

const mapStateToProps = state => {
    const { start, end } = state.date.period;
    const { mobile } = state.screen;
    return { start, end, mobile };
};

export default connect(mapStateToProps)(OverviewDetailsTrends);
