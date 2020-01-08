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
        // background: '#ffffff80',
        background: '#96C3CE',
    },
});

// const stores = [
//     'Dollar Store',
//     'NoFrills',
//     'WalMart',
//     'Amazon',
//     'Chapters',
//     'Burger King',
//     'McDonalds',
//     'Metro',
//     'Ikea',
//     'Tim Hortons',
//     'Sport Check',
//     'Staples',
//     'Steam',
// ];
// const categories = [
//     'Household',
//     'Groceries',
//     'Snacks',
//     'Takeout',
//     'Transportation',
//     'Travel',
//     'Entertainment',
//     'Education',
// ];

class AddExpense extends Component {
    state = { amount: '', store: '', category: '', date: getFormatedDate(this.props.date.today) };

    // Add store look up
    // add category lookup
    // store/category popup if did not exist in db before

    async addExpense() {
        const { amount, store, category, date } = this.state;
        const res = await fetch('/api/users/expenses/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                expenses: { amount, store, category, date },
            }),
        });
        const data = await res.json();
        // console.log(res, data);
        if (res.status === 200) this.props.history.push('/users/expenses/summary');
    }

    // Adds expenses in bulk (save method for later)
    // async populateTemp() {
    //     for (let i = 0; i < 35; i++) {
    //         const expenses = {
    //             amount: Math.floor(Math.random() * 125) + 1,
    //             store: stores[this.randomNum(stores.length - 1)],
    //             category: categories[this.randomNum(categories.length - 1)],
    //             date: new Date(
    //                 2020,
    //                 // Math.floor(Math.random() * 11) + 1,
    //                 0,
    //                 Math.floor(Math.random() * 30 + 1)
    //             ),
    //         };

    //         console.log(expenses.date);
    //         const res = await fetch('/api/users/expenses/add', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({
    //                 expenses,
    //             }),
    //         });
    //         const data = await res.json();
    //         console.log(res, data);
    //     }
    // }

    // randomNum(max) {
    //     return Math.floor(Math.random() * Math.floor(max) + 1);
    // }

    updateField(field, value) {
        this.setState({ [field]: value });
    }

    render() {
        const { classes, height, mobile } = this.props;
        const { amount, store, category, date } = this.state;
        return (
            <div
                className={classes.container}
                style={mobile ? { height: `calc(${height}px - 16vh)` } : {}}
            >
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
                {/* <button disabled onClick={() => this.populateTemp()}>Add temp</button> */}
            </div>
        );
    }
}

// Get date from redux
const mapStateToProps = state => {
    const { date } = state;
    const { height, mobile } = state.screen;
    return { date, height, mobile };
};

export default connect(mapStateToProps)(withStyles(styles)(AddExpense));
