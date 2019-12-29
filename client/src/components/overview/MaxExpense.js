import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { getCurrencyFormat } from '../../utility/utility';
import ExpenseSummary from '../ExpenseSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { IconButton, CircularProgress } from '@material-ui/core';

const useStyles = makeStyles({
    showMore: {
        display: 'flex',
        justifyContent: 'center',
    },
    summaryItem: {
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #00000020',
        padding: '10px',
        margin: '10px 0',
        '& label': {
            padding: '5px',
        },
        '& h2': {
            padding: '5px',
            margin: 0,
        },
    },
});

export default function MaxExpense({ max }) {
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);
    const [expenses, setExpenses] = useState(null);

    useEffect(() => {
        if (max) fetchExpenseSummary();
    }, [max]);

    async function fetchExpenseSummary() {
        console.log('Fetching max expense data');
        const res = await fetch(
            `/api/users/expenses/summary?start=${max.date}&end=${max.date}&sort=amount&order=desc`
        );
        if (res.status === 200) {
            const data = await res.json();
            if (data.expenses) {
                setExpenses(data.expenses);
                return;
            }
        }
        console.error('Error fetching results');
    }

    return (
        <div className={classes.summaryItem}>
            <h2>Max Daily Expense</h2>
            <label>{max ? max.date : 'loading...'}</label>
            <label>{max ? `$${getCurrencyFormat(max.amount)}` : ''}</label>
            <div className={classes.showMore}>
                <IconButton onClick={() => setExpanded(!expanded)}>
                    {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
            </div>
            {(() => {
                if (expanded) {
                    if (expenses == null) fetchExpenseSummary();
                    return <Details expenses={expenses} />;
                } else {
                    return null;
                }
            })()}
        </div>
    );
}

const useStylesDetails = makeStyles({
    container: {
        display: 'flex',
        justifyContent: 'center',
    },
});

function Details({ expenses }) {
    const classes = useStylesDetails();
    return expenses ? (
        expenses.map(el => <ExpenseSummary key={el.id} el={el} />)
    ) : (
        <div className={classes.container}>
            <CircularProgress />
        </div>
    );
}
