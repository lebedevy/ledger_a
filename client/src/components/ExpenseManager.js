import React from 'react';
import { TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    form: {
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#00000025',
    },
});

export default function ExpenseManager({
    amount,
    store,
    category,
    date,
    setAmount,
    setStore,
    setCategory,
    setDate,
    submit,
    buttonLabel,
}) {
    const classes = useStyles();

    function submitExpense(e) {
        e.preventDefault();
        submit();
    }

    return (
        <form className={classes.form} onSubmit={e => submitExpense(e)}>
            <TextField
                placeholder="Amount"
                type="number"
                required
                // error={Boolean(amountError)}
                // helperText={amountError}
                value={amount}
                onChange={e => setAmount(e.target.value)}
            />
            <TextField placeholder="Store" value={store} onChange={e => setStore(e.target.value)} />
            <TextField
                placeholder="Expense category"
                value={category}
                onChange={e => setCategory(e.target.value)}
            />
            <TextField
                placeholder="Date"
                required
                // error={Boolean(dateError)}
                // helperText={dateError}
                value={date}
                type="date"
                onChange={e => setDate(e.target.value)}
            />
            <Button type="submit">{buttonLabel}</Button>
        </form>
    );
}
