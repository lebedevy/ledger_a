import React from 'react';
import { Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { getCurrencyFormat } from '../utility/utility';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    summary: {
        padding: '10px',
        height: '70px',
        background: '#96C3CE',
    },
    total: {
        fontWeight: 'bold',
    },
    addExpense: {
        position: 'absolute',
        right: '10px',
        bottom: '10px',
    },
});

export default function Summary({ total }) {
    const classes = useStyles();
    return (
        <div className={classes.summary}>
            <label>Total: </label>
            <label className={classes.total}>${getCurrencyFormat(total)}</label>
            <Fab
                className={classes.addExpense}
                size="medium"
                color="secondary"
                href="/users/expenses/add"
            >
                <AddIcon />
            </Fab>
        </div>
    );
}
