import React, { Component } from 'react';
import { Button, IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { getFormatedDate, getCurrencyFormat } from '../utility/utility';
import Summary from '../components/Summary';
import SortIcon from '@material-ui/icons/Sort';

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
        'overflow-y': 'scroll',
        'overflow-x': 'hidden',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: '#ffffff',
        borderRadius: '5px',
    },
    expenseEntry: {
        padding: '0 1px',
        display: 'flex',
        bottomBorder: '1px solid #00000060',
    },
    expenseItem: {
        padding: '2px 0',
        flex: '1 1 0',
        border: '1px solid #00000020',
        minWidth: '0',
        'overflow-x': 'auto',
    },
    summary: {
        padding: '10px',
        height: '50px',
        background: '#96C3CE',
    },
    addExpense: {
        position: 'absolute',
        right: '10px',
        bottom: '10px',
    },
    header: { display: 'flex', justifyContent: 'space-between', margin: '0 10px' },
});

class Expenses extends Component {
    state = { expenses: [], openSort: false };

    async componentDidMount() {
        const res = await fetch('/users/expenses/summary');
        if (res.status === 200) {
            const data = await res.json();
            console.log(data.expenses);
            // data.expenses.forEach(el => console.log(el));
            this.setState({ expenses: data.expenses });
        } else {
            console.error('Error fetching results');
        }
    }

    render() {
        const { classes } = this.props;
        const { expenses, openSort } = this.state;
        let total = 0;
        return (
            <div className={classes.container}>
                <div className={classes.header}>
                    <h2>Expenses</h2>
                    <IconButton>
                        <SortIcon className={classes.icon} />
                    </IconButton>
                </div>
                <div className={classes.expenseList}>
                    {expenses.length === 0 ? <label>No recorded expenses</label> : null}
                    {expenses.map(el => {
                        total += el.amount;
                        return (
                            <div className={classes.expenseEntry}>
                                <label className={classes.expenseItem}>{`$${getCurrencyFormat(
                                    el.amount
                                )}`}</label>
                                <label className={classes.expenseItem}>{el.store.store_name}</label>
                                <label className={classes.expenseItem}>
                                    {el.category.category_name}
                                </label>
                                <label className={classes.expenseItem}>
                                    {getFormatedDate(new Date(el.date))}
                                </label>
                            </div>
                        );
                    })}
                </div>
                <Summary total={total} classes={classes} />
            </div>
        );
    }
}

export default withStyles(styles)(Expenses);
