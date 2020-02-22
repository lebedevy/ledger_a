import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { getCurrencyFormat, getFormatedDate } from '../../utility/utility';
import { useSelector } from 'react-redux';

const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const dayGrade = ['empty', 'first', 'second', 'third'];
const cellSize = 12;

const useStyles = makeStyles({
    spendingMap: {
        maxWidth: '100%',
        background: '#E8EBE4',
        border: '1px solid #00000020',
        borderRadius: '2px',
        padding: '10px 10px',
        margin: '10px 0',
    },
    periodContainer: {
        display: 'flex',
    },
    period: {
        minWidth: `${cellSize}px`,
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
    dayLabel: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'white',
        fontSize: `${cellSize - cellSize * 0.3}px`,
        fontWeight: 'bold',
    },
    paddingDay: {
        background: '#CED0CE',
    },
    legend: {
        paddingTop: '15px',
        display: 'grid',
        gridTemplateColumns: `repeat( auto-fit, minmax(${cellSize}px, ${cellSize}px) )`,
        gridGap: '2px',
    },
    empty: {
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
    selected: {
        border: '1px solid #00000060',
    },
    muted: {
        opacity: 0.55,
    },
    today: {
        border: '2px solid orange',
    },
});

export default function SpendingMap({ data, step, setDay, day }) {
    const classes = useStyles();
    const today = useSelector(state => getFormatedDate(state.date.today));
    return (
        <div className={classes.spendingMap} onClick={() => setDay(null)}>
            <div className={classes.periodContainer}>
                <div className={classes.period}>
                    {weekdays.map((wd, ind) => (
                        <div key={wd + ind} className={clsx(classes.day, classes.dayLabel)}>
                            {wd}
                        </div>
                    ))}
                </div>
                <div className={classes.period}>
                    {data.map((el, ind) =>
                        el.type === 'padding' ? (
                            <div key={ind} className={clsx(classes.day, classes.paddingDay)} />
                        ) : (
                            <div
                                onClick={e => {
                                    e.stopPropagation();
                                    setDay(el);
                                }}
                                key={el.date}
                                className={clsx(
                                    classes.day,
                                    day && el.date === day.date && classes.selected,
                                    day && el.date !== day.date && classes.muted,
                                    el.date === today && classes.today,
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
            </div>
            <div className={classes.legend}>
                <LegendItem cssClass="empty" label="$0" />
                <LegendItem cssClass="first" label={`upto $${getCurrencyFormat(step)}`} />
                <LegendItem cssClass="second" label={`upto $${getCurrencyFormat(step * 2)}`} />
                <LegendItem cssClass="third" label={`over $${getCurrencyFormat(step * 2)}`} />
            </div>
        </div>
    );
}

function LegendItem({ cssClass, label }) {
    const classes = useStyles();
    return <div className={clsx(classes.day, classes[cssClass])} title={label} />;
}
