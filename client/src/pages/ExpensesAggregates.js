import React, { Component } from 'react';
import { useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import Summary from '../components/Summary';
import AggregateSummary from '../components/AggregateSummary';
import Header from '../components/Header';
import { getSort, getSortIndexes } from '../utility/utility';

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
});

const options = ['Amount', 'Name'];
const optionsLower = options.map(el => el.toLowerCase());
const orderDir = ['asc', 'desc'];

class ExpensesAggregates extends Component {
    state = {
        expenses: [],
        sortOpen: false,
        type: this.props.match.params.type,
        sort: 0,
        order: 1,
    };

    componentDidMount() {
        const [sort, order] = getSortIndexes(optionsLower, ...getSort(this.props.location.search));
        if (sort || order) {
            this.setState({ sort: sort == null ? 0 : sort, order: order == null ? 1 : order }, () =>
                this.fetchExpenses()
            );
        } else {
            this.fetchExpenses();
        }
    }

    // If component pathname changed from cat to store, reload component data to change type
    componentDidUpdate(props) {
        if (this.props.location.pathname !== props.location.pathname) {
            const { match } = this.props;
            const [sort, order] = getSortIndexes(
                optionsLower,
                ...getSort(this.props.location.search)
            );
            this.setState(
                {
                    type: match.params.type,
                    sort: sort == null ? 0 : sort,
                    order: order == null ? 1 : order,
                },
                () => this.fetchExpenses()
            );
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
        console.log('Getting expenses');
        const { start, end } = this.props;
        const { type, sort, order } = this.state;
        const res = await fetch(
            `/api/users/expenses/summary/${type}?start=${start}&end=${end}&sort=${optionsLower[sort]}&order=${orderDir[order]}`
        );
        const data = await res.json();
        this.setState({ expenses: data });
    }

    render() {
        const { classes } = this.props;
        const { expenses, type, sortOpen, sort, order } = this.state;
        let total = 0;
        return (
            <div className={classes.container}>
                <Header
                    setOpen={() => this.setState({ sortOpen: !sortOpen })}
                    open={sortOpen}
                    title={`Expenses by ${type === 'cat' ? 'Category' : 'Store'}`}
                    dashboard={{
                        setSort: val => this.setState({ sort: val }, this.updateFilters),
                        setOrder: val => this.setState({ order: val }, this.updateFilters),
                        sort,
                        order,
                        options,
                    }}
                />
                <div className={classes.expenseList}>
                    {expenses.length === 0 ? (
                        <label>{`No expenses for ${
                            type === 'cat' ? 'categories' : 'stores'
                        }`}</label>
                    ) : null}
                    {expenses.map(el => {
                        total += el.amount;
                        return <AggregateSummary key={el.id} type={type} el={el} />;
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

export default connect(mapStateToProps)(withStyles(styles)(ExpensesAggregates));
