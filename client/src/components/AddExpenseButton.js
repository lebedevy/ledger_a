import React from 'react';
import { Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    addExpense: {
        position: 'fixed',
        right: '10px',
        bottom: '10px',
    },
});

export default function AddExpenseButton({ history }) {
    const classes = useStyles();
    return (
        <Fab
            className={classes.addExpense}
            size="medium"
            color="secondary"
            onClick={() => history.push('/users/expenses/add')}
        >
            <AddIcon />
        </Fab>
    );
}
