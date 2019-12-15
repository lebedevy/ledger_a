import React, { useState } from 'react';
import { connect } from 'react-redux';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { setPeriod } from '../redux/actions';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        alignItems: 'center',
        margin: '10px',
        '& label': {
            margin: '0 10px 0 5px',
            fontWeight: 'bold',
        },
        '& input': {
            // width: '130px',
        },
    },
    item: {
        display: 'flex',
        alignItems: 'center',
    },
});

function Dashboard({ start, end, updateStart, updateEnd, setPeriod }) {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <div className={clsx(window.innerWidth > 600 && classes.item)}>
                <label>From</label>
                <TextField
                    type="date"
                    value={start}
                    variant="outlined"
                    margin="dense"
                    onChange={e => setPeriod({ start: e.target.value, end })}
                />
            </div>
            <div className={clsx(window.innerWidth > 600 && classes.item)}>
                <label>To</label>
                <TextField
                    type="date"
                    margin="dense"
                    variant="outlined"
                    value={end}
                    onChange={e => setPeriod({ end: e.target.value, start })}
                />
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    const { date } = state;
    const { start, end } = date.period;
    console.log(start, end);
    return { start, end };
};

export default connect(mapStateToProps, { setPeriod })(Dashboard);
