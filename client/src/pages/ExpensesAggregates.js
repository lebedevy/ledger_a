import React, { Component } from 'react';
import { useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import Summary from '../components/Summary';
import AggregateSummary from '../components/AggregateSummary';
import Header from '../components/Header';
import { getSort } from '../utility/utility';

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

class ExpensesAggregates extends Component {
    state = {
        expenses: [],
        sortOpen: false,
        type: this.props.match.params.type,
        sort: null,
        order: null,
    };

    componentDidMount() {
        const [sort, order] = getSort(this.props.location.search);
        this.setState({ sort, order }, () => this.fetchExpenses(this.props.start, this.props.end));
    }

    componentDidUpdate(props) {
        if (this.props.location.pathname !== props.location.pathname) {
            console.log('Closing dashboard');
            this.setState({ sortOpen: false });
        }
        if (props !== this.props) {
            const { match } = this.props;
            const [sort, order] = getSort(this.props.location.search);
            this.setState({ type: match.params.type, sort, order }, () =>
                this.fetchExpenses(this.props.start, this.props.end)
            );
        }
    }

    async fetchExpenses(start, end) {
        console.log('Getting expenses');
        const { type, sort, order } = this.state;
        const res = await fetch(
            `/api/users/expenses/summary/${type}?start=${start}&end=${end}&sort=${sort}&order=${order}`
        );
        const data = await res.json();
        this.setState({ expenses: data });
    }

    render() {
        const { classes } = this.props;
        const { expenses, type, sortOpen } = this.state;
        let total = 0;
        return (
            <div className={classes.container}>
                <Header
                    setOpen={() => this.setState({ sortOpen: !sortOpen })}
                    open={sortOpen}
                    title={`Expenses by ${type === 'cat' ? 'Category' : 'Store'}`}
                    history={this.props.history}
                    type={'aggregate'}
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
