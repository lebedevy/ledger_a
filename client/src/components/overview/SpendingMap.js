import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { getCurrencyFormat } from '../../utility/utility';

const dayGrade = ['empty', 'first', 'second', 'third'];
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const cellSize = 12;

const useStyles = makeStyles({
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
    day: {
        height: `${cellSize}px`,
        width: `${cellSize}px`,
        background: 'gray',
    },
    paddingDay: {
        // background: '#ADBABD',
        // background: '#BFC0C0',
        background: '#CED0CE',
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
        // background: '#CED0CE',
        background: '#A1A3A1',
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

export default function SpendingMap({ data, step }) {
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
