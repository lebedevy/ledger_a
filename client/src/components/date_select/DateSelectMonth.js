import React, { useState } from 'react';
import { months } from '../../data/data';
import { makeStyles } from '@material-ui/styles';

import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { IconButton } from '@material-ui/core';
import { connect } from 'react-redux';
import { setPeriod } from '../../redux/actions';
import { getFormatedDate } from '../../utility/utility';

const useStyles = makeStyles({
    monthSelectCont: {
        padding: '1px',
        // border: '1px solid black',
    },
    year: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
    },
    monthsCont: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridRowGap: '1px',
        gridColumnGap: '1px',
    },
    month: {
        minHeight: '2em',
        background: 'none',
        border: '1px solid #00000040',
        outlineColor: '#DC136C',
        '&:hover': {
            border: '1px solid #F75C03',
        },
    },
});

function DateSelectMonth({ setPeriod, end }) {
    const classes = useStyles();
    const [year, setYear] = useState(end.slice(0, 4));

    function setDates(month) {
        const start = getFormatedDate(new Date(year, month, 1));
        const end = getFormatedDate(new Date(year, month + 1, 0));
        setPeriod({ start, end });
    }

    return (
        <div className={classes.monthSelectCont}>
            <div className={classes.year}>
                <IconButton onClick={() => setYear(year - 1)}>
                    <ArrowLeftIcon />
                </IconButton>
                <label>{year}</label>
                <IconButton onClick={() => setYear(year + 1)}>
                    <ArrowRightIcon />
                </IconButton>
            </div>
            <div className={classes.monthsCont}>
                {months.map((month, ind) => (
                    <button className={classes.month} onClick={() => setDates(ind)}>
                        {month}
                    </button>
                ))}
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    const { date } = state;
    const { start, end } = date.period;
    return { start, end };
};

export default connect(mapStateToProps, { setPeriod })(DateSelectMonth);
