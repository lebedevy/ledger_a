import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
    },
    mobile: {
        width: '100%',
        maxWidth: '100%',
    },
    desktop: {
        width: '80vw',
        maxWidth: '99%',
    },
    svg: {
        alignSelf: 'center',
        height: '200px',
        maxHeight: '300px',
        border: '1px solid #00000030',
        borderRadius: '3px',
        fontSize: '10px',
    },
    chartGrid: {
        stroke: '#000000',
    },
});

function BarChartAggregate({ max, data, mobile }) {
    const classes = useStyles();
    // Bar chart positioning variables
    const topOffset = 15;
    const [barHeight, setBarHeight] = useState(mobile ? 60 : 70);
    const [rightOffset, setRightOffset] = useState(mobile ? 4 : 3);
    const barWidth = 6;

    useEffect(() => {
        setBarHeight(mobile ? 60 : 70);
        setRightOffset(mobile ? 5 : 3);
    }, [mobile]);

    console.log(rightOffset);

    return (
        <svg className={clsx(classes.svg, classes[mobile ? 'mobile' : 'desktop'])}>
            {(() => {
                let gridlines = [];
                for (let i = 0; i < 6; i++) {
                    let y = topOffset + i * (barHeight / 6);
                    let label = max - i * (max / 6);
                    gridlines.push(
                        <text key={'amountLabel' + i} x="0.5%" y={`${y + 2}%`}>
                            {label >= 1000 ? (Math.ceil(label / 100) / 10).toFixed(1) + 'k' : label}
                        </text>,
                        <line
                            key={'gridLine' + i}
                            className={classes.gridLines}
                            y1={`${y}%`}
                            y2={`${y}%`}
                            x1="98.5%"
                            x2={`${rightOffset - 0.5}%`}
                            stroke="#2274A535"
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
                stroke="#2274A5"
            />
            <line
                y1={`${topOffset - 5}%`}
                y2={`${topOffset + barHeight}%`}
                x1={`${rightOffset - 0.5}%`}
                x2={`${rightOffset - 0.5}%`}
                stroke="#2274A5"
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
                              y={`${Math.min(
                                  topOffset +
                                      barHeight -
                                      barHeight * (el.amount / max) -
                                      (mobile ? -2 : 3),
                                  topOffset + barHeight - 8
                              )}%`}
                              textAnchor={mobile ? '' : 'middle'}
                              writingMode={mobile ? 'tb' : ''}
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
                              y={`${topOffset + barHeight + (mobile ? 15 : 10)}%`}
                              textAnchor="middle"
                              writingMode={mobile ? 'tb' : ''}
                          >
                              {`${el.month} ${el.year}`}
                          </text>
                      </React.Fragment>
                  ))
                : null}
        </svg>
    );
}

const mapStateToProps = state => {
    const { start, end } = state.date.period;
    const { mobile } = state.screen;
    return { start, end, mobile };
};

export default connect(mapStateToProps)(BarChartAggregate);
