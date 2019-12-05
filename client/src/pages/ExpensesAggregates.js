import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { getFormatedDate, getCurrencyFormat } from '../utility/utility';
import Summary from '../components/Summary';

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
        overflow: 'scroll',
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
    sort: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sortBackground: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        background: '#00000060',
    },
    sortContainer: {
        height: '500px',
        width: '700px',
        background: '#ffffff',
        zIndex: 1,
    },
});

class ExpensesAggregates extends Component {
    state = { expenses: [], openSort: false, type: this.props.match.params.type };

    async componentDidMount() {
        const { type } = this.state;
        const res = await fetch('/users/expenses/summary/' + type);
        const data = await res.json();
        console.log(data);
        // data.expenses.forEach(el => console.log(el));
        this.setState({ expenses: data });
    }

    render() {
        const { classes } = this.props;
        const { expenses, openSort, type } = this.state;
        let total = 0;
        console.log(expenses);
        return (
            <div className={classes.container}>
                {openSort ? (
                    <Sort classes={classes} close={() => this.setState({ openSort: false })} />
                ) : null}
                <h2>{`Expenses by ${type === 'cat' ? 'Category' : 'Store'}`}</h2>
                <Button onClick={() => this.setState({ openSort: !openSort })}>Sort</Button>
                <div className={classes.expenseList}>
                    {expenses.map(el => {
                        total += el.amount;
                        return (
                            <div className={classes.expenseEntry}>
                                <label className={classes.expenseItem}>
                                    {type === 'cat' ? el.category_name : el.store_name}
                                </label>
                                <label className={classes.expenseItem}>{`$${getCurrencyFormat(
                                    el.amount
                                )}`}</label>
                            </div>
                        );
                    })}
                </div>
                <Summary total={total} classes={classes} />
            </div>
        );
    }
}

function Sort({ classes, close }) {
    return (
        <div className={classes.sort}>
            <div className={classes.sortContainer}></div>
            <div className={classes.sortBackground} onClick={close}></div>
        </div>
    );
}

export default withStyles(styles)(ExpensesAggregates);
