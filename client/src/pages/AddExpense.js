import React, { Component } from 'react';
import { TextField, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

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
    state = { amount: '', store: '', category: '' };
    // Add store look up
    // add category lookup
    // store/category popup if did not exist in db before

    async addExpense(e) {
        e.preventDefault();
        const { amount, store, category } = this.state;
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
        const { amount, store, category } = this.state;
        return (
            <div className={classes.container}>
                <h2>Add Expense</h2>
                <form className={classes.form} onSubmit={e => this.addExpense(e)}>
                    <TextField
                        placeholder="Amount"
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
                    <Button type="submit">Add Expense</Button>
                </form>
                <Button onClick={() => this.populateTemp()}>Add temp</Button>
            </div>
        );
    }
}

export default withStyles(styles)(AddExpense);
