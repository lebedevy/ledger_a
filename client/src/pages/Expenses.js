import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles, makeStyles } from '@material-ui/styles';
import Summary from '../components/Summary';
import ExpenseSummary from '../components/ExpenseSummary';
import ExpenseFull from '../components/ExpenseFull';
import SortIcon from '@material-ui/icons/Sort';
import { Button, TextField } from '@material-ui/core';
import { getFormatedDate } from '../utility/utility';

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
        'overflow-y': 'auto',
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
    header: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        margin: '0 10px',
    },
});

class Expenses extends Component {
    state = { expenses: [], expand: null, start: '', end: '' };

    async componentDidMount() {
        // Set period dates
        const month = this.props.date.today.getMonth();
        const year = this.props.date.today.getFullYear();
        const start = getFormatedDate(new Date(year, month, 1));
        const end = getFormatedDate(new Date(year, month + 1, 0));
        console.log(start, end, month, year);

        this.setState({ start, end });
        this.getExpenses(start, end);
    }

    async getExpenses(start, end) {
        const res = await fetch(`/api/users/expenses/summary?start=${start}&end=${end}`);
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

    updateDate(field, value) {
        // Will need to debounce
        this.setState({ [field]: value }, () => this.getExpenses(this.state.start, this.state.end));
    }

    render() {
        const { classes } = this.props;
        const { expenses, expand, start, end } = this.state;
        let total = 0;
        return (
            <div className={classes.container}>
                <div className={classes.header}>
                    <h2>Expenses</h2>
                    {/* <IconButton>
                        <SortIcon className={classes.icon} />
                    </IconButton> */}
                    <Dashboard
                        start={start}
                        end={end}
                        updateStart={val => this.updateDate('start', val)}
                        updateEnd={val => this.updateDate('end', val)}
                    />
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

function Dashboard({ start, end, updateStart, updateEnd }) {
    return (
        <div>
            <label>From</label>
            <TextField type="date" value={start} onChange={e => updateStart(e.target.value)} />
            <label>To</label>
            <TextField type="date" value={end} onChange={e => updateEnd(e.target.value)} />
        </div>
    );
}

const mapStateToProps = state => {
    const { date } = state;
    return { date };
};

export default connect(mapStateToProps)(withStyles(styles)(Expenses));
