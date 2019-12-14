import React from 'react';
import { TextField, Button } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    form: {
        position: ' relative',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#FBF5F399',
        borderRadius: '5px',
        '& button': { marginTop: '10px' },
    },
    backlay: {
        borderRadius: '5px',
        background: '#FBF5F380',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
    },
});

const FormatedTextField = withStyles({
    root: {
        width: '100%',
        padding: '5px',
        '& label.Mui-focused': {
            color: '#E28413',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: '#E28413',
        },
    },
})(TextField);

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
            <div className={classes.backlay} />
            <FormatedTextField
                className={classes.root}
                placeholder="Amount"
                type="number"
                required
                // error={Boolean(amountError)}
                // helperText={amountError}
                value={amount}
                onChange={e => setAmount(e.target.value)}
            />
            <FormatedTextField
                placeholder="Store"
                value={store}
                onChange={e => setStore(e.target.value)}
            />
            <FormatedTextField
                placeholder="Expense category"
                value={category}
                onChange={e => setCategory(e.target.value)}
            />
            <FormatedTextField
                placeholder="Date"
                required
                value={date}
                type="date"
                onChange={e => setDate(e.target.value)}
            />
            <Button type="submit" color="primary" variant="contained">
                {buttonLabel}
            </Button>
        </form>
    );
}
