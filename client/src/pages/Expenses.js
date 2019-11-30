import React, { Component } from 'react';
import { TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
    container: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#00000020',
        overflow: 'hidden',
    },
    expenseList: {
        overflow: 'scroll',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    expenseEntry: {
        padding: '2.5px',
        paddingLeft: '10px',
        margin: '2.5px',
        display: 'flex',
        flexWrap: 'wrap',
        bottomBorder: '1px solid #00000060',
    },
    expenseItem: {
        flex: 1,
    },
    summary: {
        padding: '10px',
        height: '50px',
        background: '#96C3CE',
    },
});

class Expenses extends Component {
    state = {
        expenses: [
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
        ],
    };
    render() {
        const { classes } = this.props;
        const { expenses } = this.state;
        let total = 0;
        return (
            <div className={classes.container}>
                <h2>Expenses</h2>
                <div className={classes.expenseList}>
                    {expenses.map(el => {
                        total += el.amount;
                        return (
                            <div className={classes.expenseEntry}>
                                <label className={classes.expenseItem}>{`$${el.amount}`}</label>
                                <label className={classes.expenseItem}>{el.store}</label>
                                <label className={classes.expenseItem}>{el.category}</label>
                            </div>
                        );
                    })}
                </div>
                <div className={classes.summary}>
                    <label>{`Total: ${total}`}</label>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(Expenses);
