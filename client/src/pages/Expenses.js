import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import Summary from '../components/Summary';
import ExpenseSummary from '../components/ExpenseSummary';
import ExpenseFull from '../components/ExpenseFull';
import Header from '../components/Header';
import { getSort, getSortIndexes } from '../utility/utility';

const styles = theme => ({
    container: {
        height: '84vh',
        width: '100vw',
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
});

const options = ['Date', 'Amount', 'Store', 'Category'];
const optionsLower = options.map(el => el.toLowerCase());
const orderDir = ['asc', 'desc'];

class Expenses extends Component {
    state = { expenses: [], openSort: false, expand: null, sort: 0, order: 0 };

    componentDidMount() {
        const [sort, order] = getSortIndexes(optionsLower, ...getSort(this.props.location.search));
        if (sort || order) {
            this.setState({ sort: sort == null ? 0 : sort, order: order == null ? 0 : order }, () =>
                this.fetchExpenses()
            );
        } else {
            this.fetchExpenses();
        }
    }

    updateFilters() {
        this.fetchExpenses();
        this.updateURL();
    }

    updateURL() {
        const { sort, order } = this.state;
        const search = new URLSearchParams();
        search.set('sort', optionsLower[sort].toLowerCase());
        search.set('order', order === 1 ? 'desc' : 'asc');
        let path = this.props.location.pathname;
        if (path.slice(-1) === '/') path = this.props.history.location.pathname.slice(0, -1);
        this.props.history.push(path + '?' + search.toString());
    }

    async fetchExpenses() {
        console.info('Getting expenses');
        const { start, end } = this.props;
        const { sort, order } = this.state;
        const res = await fetch(
            `/api/users/expenses/summary?start=${start}&end=${end}&sort=${optionsLower[sort]}&order=${orderDir[order]}`
        );
        if (res.status === 200) {
            const data = await res.json();
            this.setState({ expenses: data.expenses });
        } else {
            console.error('Error fetching results');
        }
    }

    async deleteExpense(id, ind) {
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
        const { expenses, expand, openSort, sort, order } = this.state;
        let total = 0;
        return (
            <div className={classes.container}>
                <Header
                    open={openSort}
                    setOpen={() => this.setState({ openSort: !openSort })}
                    title="Expenses"
                    dashboard={{
                        setSort: val => this.setState({ sort: val }, this.updateFilters),
                        setOrder: val => this.setState({ order: val }, this.updateFilters),
                        sort,
                        order,
                        options,
                    }}
                />
                <div className={classes.expenseList}>
                    {expenses.length === 0 ? <label>No recorded expenses</label> : null}
                    {expenses.map((el, ind) => {
                        total += el.amount;
                        return el.id === expand ? (
                            <ExpenseFull
                                key={el.id}
                                el={el}
                                ind={ind}
                                expand={() => this.setState({ expand: null })}
                                deleteExpense={() => this.deleteExpense(el.id, ind)}
                            />
                        ) : (
                            <ExpenseSummary
                                key={el.id}
                                el={el}
                                ind={ind}
                                expand={() => this.setState({ expand: el.id })}
                            />
                        );
                    })}
                </div>
                <Summary total={total} history={this.props.history} />
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { date } = state;
    const { start, end } = date.period;
    return { date, start, end };
};

export default connect(mapStateToProps)(withStyles(styles)(Expenses));
