import React, { Component } from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import Summary from '../components/Summary';
import ExpenseSummary from '../components/ExpenseSummary';
import ExpenseFull from '../components/ExpenseFull';
import Header from '../components/Header';
import { getSort, getSortIndexes } from '../utility/utility';
import LoadingComponent from '../components/LoadingComponent';

const styles = theme => ({
    container: {
        margin: '0 auto',
        width: '100vw',
        // width: '100vh',
        maxWidth: '1200px',
        display: 'flex',
        flexDirection: 'column',
        // background: '#00000020',
        overflow: 'hidden',
    },
    mobile: {
        // height: '84vh',
        // maxHeight: '100%',
    },
    desktop: {
        height: 'calc(100vh - 130px)',
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
    state = { expenses: null, openSort: false, expand: null, sort: 0, order: 0 };

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

    componentDidUpdate(props) {
        if (this.props.start !== props.start || this.props.end !== props.end) {
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
        const { classes, width, height, history } = this.props;
        const { expenses, expand, openSort, sort, order } = this.state;
        let total = 0;
        return (
            <div
                className={clsx(width > 600 ? classes.desktop : classes.mobile, classes.container)}
                style={width <= 600 ? { height: `calc(${height}px - 16vh)` } : {}}
            >
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
                    {expenses && expenses.length === 0 ? <label>No recorded expenses</label> : null}
                    {expenses ? (
                        <table style={{ width: '100%' }}>
                            {expenses.map((el, ind) => {
                                total += el.amount;
                                return el.id === expand ? (
                                    <ExpenseFull
                                        key={el.id}
                                        history={history}
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
                        </table>
                    ) : null}
                    {!expenses ? <LoadingComponent /> : null}
                </div>
                <Summary total={total} history={history} />
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { width, height } = state.screen;
    const { start, end } = state.date.period;
    return { height, width, start, end };
};

export default connect(mapStateToProps)(withStyles(styles)(Expenses));
