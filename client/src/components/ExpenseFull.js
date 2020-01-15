import React from 'react';
import { makeStyles } from '@material-ui/styles';
import ExpenseSummary from '../components/ExpenseSummary';
import { Button } from '@material-ui/core';

const useStyles = makeStyles({
    expense: {
        border: '1px solid #00000080',
        borderRadius: '5px',
        background: '#00000010',
    },
    details: {
        display: 'flex',
        '& button': {
            flex: 1,
        },
        '& a': {
            flex: 1,
        },
    },
});

export default function ExpenseFull(props) {
    const classes = useStyles();

    return (
        <div className={classes.expense}>
            <ExpenseSummary {...props} />
            <div className={classes.details}>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => props.history.push(`/users/expenses/edit/${props.el.id}`)}
                >
                    Edit
                </Button>
                <Button variant="outlined" color="primary" onClick={props.deleteExpense}>
                    Delete
                </Button>
            </div>
        </div>
    );
}
