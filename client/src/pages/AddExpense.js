import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { getFormatedDate } from '../utility/utility';
import ExpenseManager from '../components/ExpenseManager';

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

    async addExpense() {
        const { amount, store, category, date } = this.state;
        console.log(amount, store, category, date);
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
            const res = await fetch('/api/users/expenses/add', {
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

    updateField(field, value) {
        console.log(field, value);
        this.setState({ [field]: value });
    }

    render() {
        const { classes } = this.props;
        const { amount, store, category, date } = this.state;
        return (
            <div className={classes.container}>
                <h2>Add Expense</h2>
                <ExpenseManager
                    amount={amount}
                    setAmount={value => this.updateField('amount', value)}
                    category={category}
                    setCategory={value => this.updateField('category', value)}
                    store={store}
                    setStore={value => this.updateField('store', value)}
                    date={date}
                    setDate={value => this.updateField('date', value)}
                    submit={() => this.addExpense()}
                    buttonLabel="Add Expense"
                />
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
