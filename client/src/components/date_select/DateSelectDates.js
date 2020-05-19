import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { setPeriod } from '../../redux/actions';

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

export default function DateRange() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { start, end } = useSelector((state) => state.date.period);
    const [startStr, setStartStr] = useState(start);
    const [endStr, setEndStr] = useState(end);
    const [error, setError] = useState(null);
    const [startError, setStartError] = useState(null);

    function getDates(start, end) {
        return [new Date(start), new Date(end)];
    }

    function setDates(start, end) {
        const [first, second] = getDates(start, end);
        setStartStr(start);
        setEndStr(end);
        // Exit function if first date not a valid date
        if (isNaN(first.getTime())) {
            setStartError('Invalid date');
            return;
        }
        // Exit if second date not valid
        if (isNaN(second.getTime())) {
            setError('Invalid date');
            return;
        }
        // Exit if first date greater than second date
        if (first > second) {
            setError('End date must be greater than start date');
            return false;
        }
        // Exit if difference between dates is greater than one year
        if (Math.abs((first - second) / 86400000) > 365) {
            setError('Difference between dates can be at most a year');
            return;
        }
        // Else clear errors and set the periods in redux
        clearErrors();
        dispatch(setPeriod({ start, end }));
    }

    function clearErrors() {
        setStartError(null);
        setError(null);
    }

    return (
        <div className={classes.container}>
            <div className={classes.item}>
                <label>From</label>
                <TextField
                    type="date"
                    margin="dense"
                    variant="outlined"
                    value={startStr}
                    onChange={(e) => setDates(e.target.value, endStr)}
                />
            </div>
            {startError ? <label className={classes.error}>{startError}</label> : null}
            <div className={classes.item}>
                <label>To</label>
                <TextField
                    type="date"
                    margin="dense"
                    variant="outlined"
                    value={endStr}
                    onChange={(e) => setDates(startStr, e.target.value)}
                />
            </div>
            {error ? <label className={classes.error}>{error}</label> : null}
        </div>
    );
}
