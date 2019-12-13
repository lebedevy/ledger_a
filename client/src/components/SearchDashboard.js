import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        // justifyContent: 'center',
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
});

export default function Dashboard({ start, end, updateStart, updateEnd }) {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <label>From</label>
            <TextField
                type="date"
                value={start}
                variant="outlined"
                margin="dense"
                onChange={e => updateStart(e.target.value)}
            />
            <label>To</label>
            <TextField
                type="date"
                margin="dense"
                variant="outlined"
                value={end}
                onChange={e => updateEnd(e.target.value)}
            />
        </div>
    );
}
