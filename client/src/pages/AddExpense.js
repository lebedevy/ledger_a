import React, { Component } from 'react';
import { TextField, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { getFormatedDate } from '../utility/utility';

const styles = theme => ({
    container: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#00000025',
    },
    form: {
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#00000025',
    },
});

const expenses = [
    { amount: 100.25, store: 'WalMart', category: 'Home' },
    { amount: 15, store: 'NoFrills', category: 'Food' },
    { amount: 9, store: 'Dollar Store', category: 'Office' },
    { amount: 0.25, store: 'NoFrills', category: 'Food' },
    { amount: 100.25, store: 'WalMart', category: 'Home' },
    {
        amount: 15,
        store: 'NoNoNoNoNoNoNoNoNoNoNoNoNoNoNoNoNoNoNoNoNoNoFrills',
        category: 'Food',
    },
    { amount: 9, store: 'Dollar Store', category: 'Office' },
    { amount: 0.25, store: 'NoFrills', category: 'Food' },
    { amount: 100.25, store: 'WalMart', category: 'Home' },
    { amount: 15, store: 'NoFrills', category: 'Food' },
    { amount: 9, store: 'Dollar Store', category: 'Office' },
    { amount: 0.25, store: 'NoFrills', category: 'Food' },
    { amount: 100.25, store: 'WalMart', category: 'Home' },
    { amount: 15, store: 'NoFrills', category: 'Food' },
    { amount: 9, store: 'Dollar Store', category: 'Office' },
    { amount: 0.25, store: 'NoFrills', category: 'Food' },
    { amount: 100.25, store: 'WalMart', category: 'Home' },
    { amount: 15, store: 'NoFrills', category: 'Food' },
    { amount: 9, store: 'Dollar Store', category: 'Office' },
    { amount: 0.25, store: 'NoFrills', category: 'Food' },
    { amount: 100.25, store: 'WalMart', category: 'Home' },
    { amount: 15, store: 'NoFrills', category: 'Food' },
    { amount: 9, store: 'Dollar Store', category: 'Office' },
    { amount: 0.25, store: 'NoFrills', category: 'Food' },
    { amount: 100.25, store: 'WalMart', category: 'Home' },
    { amount: 15, store: 'NoFrills', category: 'Food' },
    { amount: 9, store: 'Dollar Store', category: 'Office' },
    { amount: 0.25, store: 'NoFrills', category: 'Food' },
    { amount: 100.25, store: 'WalMart', category: 'Home' },
    { amount: 15, store: 'NoFrills', category: 'Food' },
    { amount: 9, store: 'Dollar Store', category: 'Office' },
    { amount: 0.25, store: 'NoFrills', category: 'Food' },
];

class AddExpense extends Component {
    state = { amount: '', store: '', category: '', date: getFormatedDate(this.props.date.today) };

    // Add store look up
    // add category lookup
    // store/category popup if did not exist in db before

    async addExpense(e) {
        e.preventDefault();
        const { amount, store, category, date } = this.state;
        console.log(amount, store, category, date);
        if (amount == null || amount === '')
            return this.setState({ amountError: 'Must add expense amount' });
        if (date == null || date === '') return this.setState({ dateError: 'Must add date' });
        this.setState({ dateError: null, amountError: null });
        const res = await fetch('/api/users/expenses/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                expenses: { amount, store, category, date },
            }),
        });
        const data = await res.json();
        console.log(res, data);
        if (res.status === 200) this.props.history.push('/users/expenses/summary');
    }

    // Adds expenses in bulk (save method for later)
    populateTemp() {
        expenses.forEach(async el => {
            const { amount, store, category } = el;
            console.log(amount, store, category);
            const res = await fetch('/users/expenses/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    expenses: { amount, store, category, date: new Date() },
                }),
            });
            const data = await res.json();
            console.log(res, data);
        });
    }

    updateField(field, e) {
        this.setState({ [field]: e.target.value });
    }

    render() {
        const { classes } = this.props;
        const { amount, store, category, date, amountError, dateError } = this.state;
        console.log(date);
        return (
            <div className={classes.container}>
                <h2>Add Expense</h2>
                <form className={classes.form} onSubmit={e => this.addExpense(e)}>
                    <TextField
                        placeholder="Amount"
                        type="number"
                        error={Boolean(amountError)}
                        helperText={amountError}
                        value={amount}
                        onChange={e => this.updateField('amount', e)}
                    />
                    <TextField
                        placeholder="Store"
                        value={store}
                        onChange={e => this.updateField('store', e)}
                    />
                    <TextField
                        placeholder="Expense category"
                        value={category}
                        onChange={e => this.updateField('category', e)}
                    />
                    <TextField
                        placeholder="Date"
                        error={Boolean(dateError)}
                        helperText={dateError}
                        value={date}
                        type="date"
                        onChange={e => this.updateField('date', e)}
                    />
                    <Button type="submit">Add Expense</Button>
                </form>
                {/* <Button disabled onClick={() => this.populateTemp()}>
                    Add temp
                </Button> */}
            </div>
        );
    }
}

// Get date from redux
const mapStateToProps = state => {
    const { date } = state;
    return { date };
};

export default connect(mapStateToProps)(withStyles(styles)(AddExpense));
