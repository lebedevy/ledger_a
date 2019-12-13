import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';

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

export default function Dashboard({ start, end, updateStart, updateEnd }) {
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
                    onChange={e => updateStart(e.target.value)}
                />
            </div>
            <div className={clsx(window.innerWidth > 600 && classes.item)}>
                <label>To</label>
                <TextField
                    type="date"
                    margin="dense"
                    variant="outlined"
                    value={end}
                    onChange={e => updateEnd(e.target.value)}
                />
            </div>
        </div>
    );
}
