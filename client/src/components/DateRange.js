import React, { useState } from 'react';
import { connect } from 'react-redux';
import { TextField } from '@material-ui/core';
import { closeDrawer, logout } from '../redux/actions';
import { makeStyles } from '@material-ui/styles';
import { setPeriod } from '../redux/actions';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        margin: '10px',
    },
    option: {
        display: 'flex',
        alignItems: 'center',
    },
    item: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        '& label': {
            margin: '0 10px 0 5px',
            fontWeight: 'bold',
        },
    },
    error: {
        textAlign: 'center',
        fontWeight: 'normal',
        color: '#f44336',
        fontSize: '0.75em',
    },
});

function DateRange({ start, end, setPeriod }) {
    const classes = useStyles();
    const [endError, setEndError] = useState(null);
    const [startError, setStartError] = useState(null);

    const setEnd = e => {
        const endDate = e.target.value;
        const first = new Date(start);
        const second = new Date(endDate);
        if (second >= first) {
            if (second.getFullYear() - first.getFullYear() <= 1) {
                clearErrors();
                setPeriod({ end: endDate, start });
            } else setEndError('Period cannot be longer than a year');
        } else setEndError('End date must be equal or greater than start date');
    };

    const setStart = e => {
        const startDate = e.target.value;
        const first = new Date(startDate);
        const second = new Date(end);
        if (first <= second) {
            if (second.getFullYear() - first.getFullYear() <= 1) {
                clearErrors();
                setPeriod({ start: startDate, end });
            } else setStartError('Period cannot be longer than a year');
        } else setStartError('Must be less than or equal to end date');
    };

    function clearErrors() {
        setStartError(null);
        setEndError(null);
    }

    return (
        <div className={classes.container}>
            <div className={classes.item}>
                <label>From</label>
                <TextField
                    type="date"
                    margin="dense"
                    variant="outlined"
                    value={start}
                    onChange={setStart}
                />
            </div>
            {startError ? <label className={classes.error}>{startError}</label> : null}
            <div className={classes.item}>
                <label>To</label>
                <TextField
                    type="date"
                    margin="dense"
                    variant="outlined"
                    value={end}
                    onChange={setEnd}
                />
            </div>
            {endError ? <label className={classes.error}>{endError}</label> : null}
        </div>
    );
}

const mapStateToProps = state => {
    const { date } = state;
    const { start, end } = date.period;
    return { start, end };
};

const mapDispatchToProps = { closeDrawer, logout, setPeriod };

export default connect(mapStateToProps, mapDispatchToProps)(DateRange);
