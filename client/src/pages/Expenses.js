import React, { Component } from 'react';
import { withStyles, makeStyles } from '@material-ui/styles';
import Summary from '../components/Summary';
import ExpenseSummary from '../components/ExpenseSummary';
import SortIcon from '@material-ui/icons/Sort';
import { Button } from '@material-ui/core';

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
    expenseItem: {
        padding: '2px 0',
        flex: '1 1 0',
        border: '1px solid #00000020',
        minWidth: '0',
        'overflow-x': 'auto',
    },
    header: { display: 'flex', justifyContent: 'space-between', margin: '0 10px' },
});

class Expenses extends Component {
    state = { expenses: [], openSort: false, expand: null };

    async componentDidMount() {
        const res = await fetch('/api/users/expenses/summary');
        if (res.status === 200) {
            const data = await res.json();
            console.log(data.expenses);
            // data.expenses.forEach(el => console.log(el));
            this.setState({ expenses: data.expenses });
        } else {
            console.error('Error fetching results');
        }
    }

    async deleteExpense(id, ind) {
        console.log(id, ind);
        const { expenses } = this.state;
        // Make sure the correct expense is being deleted
        if (expenses[ind].id === id) {
            // call api to remove
            const res = await fetch(`/api/users/expenses/delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });

            if (res.ok) {
                // Remove from array
                let update = expenses.slice();
                update.splice(ind, 1);
                this.setState({ expenses: update });
            } else {
                //    Show error message
                const data = await res.json();
                console.error(data);
            }
        }
    }

    render() {
        const { classes } = this.props;
        const { expenses, openSort, expand } = this.state;
        let total = 0;
        return (
            <div className={classes.container}>
                <div className={classes.header}>
                    <h2>Expenses</h2>
                    {/* <IconButton>
                        <SortIcon className={classes.icon} />
                    </IconButton> */}
                </div>
                <div className={classes.expenseList}>
                    {expenses.length === 0 ? <label>No recorded expenses</label> : null}
                    {expenses.map((el, ind) => {
                        total += el.amount;
                        return el.id === expand ? (
                            <ExpenseFull
                                el={el}
                                ind={ind}
                                expand={() => this.setState({ expand: null })}
                                deleteExpense={() => this.deleteExpense(el.id, ind)}
                            />
                        ) : (
                            <ExpenseSummary
                                el={el}
                                ind={ind}
                                expand={() => this.setState({ expand: el.id })}
                            />
                        );
                    })}
                </div>
                <Summary total={total} />
            </div>
        );
    }
}

const useStyles = makeStyles({
    expense: {
        border: '1px solid #00000080',
        borderRadius: '5px',
        background: '#00000010',
    },
    details: {
        display: 'flex',
        '& button': {
            flex: 1,
        },
        '& a': {
            flex: 1,
        },
    },
});

function ExpenseFull(props) {
    const classes = useStyles();

    return (
        <div className={classes.expense}>
            <ExpenseSummary {...props} />
            <div className={classes.details}>
                <Button
                    variant="outlined"
                    color="primary"
                    href={`/users/expenses/edit/${props.el.id}`}
                >
                    Edit
                </Button>
                <Button variant="outlined" color="primary" onClick={props.deleteExpense}>
                    Delete
                </Button>
            </div>
        </div>
    );
}

export default withStyles(styles)(Expenses);
