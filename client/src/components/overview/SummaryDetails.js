import React from 'react';
import { makeStyles } from '@material-ui/styles';
import ExpenseSummary from '../ExpenseSummary';
import { CircularProgress } from '@material-ui/core';

const useStylesDetails = makeStyles({
    container: {
        display: 'flex',
        justifyContent: 'center',
    },
});

export default function Details({ expenses }) {
    const classes = useStylesDetails();
    return expenses ? (
        <table>
            {expenses.map(el => (
                <ExpenseSummary key={el.id} el={el} exclude={{ date: 1 }} />
            ))}
        </table>
    ) : (
        <div className={classes.container}>
            <CircularProgress />
        </div>
    );
}
