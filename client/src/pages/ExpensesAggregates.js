import React, { Component } from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import Summary from '../components/Summary';
import AggregateSummary from '../components/AggregateSummary';
import Header from '../components/Header';
import { getSort, getSortIndexes } from '../utility/utility';
import LoadingComponent from '../components/LoadingComponent';

const styles = theme => ({
    container: {
        margin: '0 auto',
        width: '100vw',
        maxWidth: '1200px',
        display: 'flex',
        flexDirection: 'column',
        // background: '#00000020',
        overflow: 'hidden',
    },
    mobile: {
        // height: '84vh',
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

const options = ['Amount', 'Name'];
const optionsLower = options.map(el => el.toLowerCase());
const orderDir = ['asc', 'desc'];

class ExpensesAggregates extends Component {
    state = {
        expenses: null,
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
                    sortOpen: false,
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
        const { classes, width, height } = this.props;
        const { expenses, type, sortOpen, sort, order } = this.state;
        let total = 0;
        return (
            <div
                className={clsx(width > 600 ? classes.desktop : classes.mobile, classes.container)}
                style={width <= 600 ? { height: `calc(${height}px - 16vh)` } : {}}
            >
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
                    {expenses && expenses.length === 0 ? (
                        <label>{`No expenses for ${
                            type === 'cat' ? 'categories' : 'stores'
                        }`}</label>
                    ) : null}
                    {expenses
                        ? expenses.map(el => {
                              total += el.amount;
                              return <AggregateSummary key={el.id} type={type} el={el} />;
                          })
                        : null}
                    {!expenses ? <LoadingComponent /> : null}
                </div>
                <Summary total={total} history={this.props.history} />
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { width, height } = state.screen;
    const { start, end } = state.date.period;
    return { height, width, start, end };
};

export default connect(mapStateToProps)(withStyles(styles)(ExpensesAggregates));
