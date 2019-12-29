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
        let endDate = e.target.value;
        if (new Date(endDate) >= new Date(start)) {
            clearErrors();
            setPeriod({ end: endDate, start });
        } else setEndError('Must be before or after start date');
    };

    const setStart = e => {
        let startDate = e.target.value;
        if (new Date(startDate) <= new Date(end)) {
            clearErrors();
            setPeriod({ start: startDate, end });
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
