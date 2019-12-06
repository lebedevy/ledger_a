import React from 'react';
import { Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { getCurrencyFormat } from '../utility/utility';

export default function Summary({ classes, total }) {
    return (
        <div className={classes.summary}>
            <label>{`Total: $${getCurrencyFormat(total)}`}</label>
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
