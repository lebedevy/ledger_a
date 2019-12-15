import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import Summary from '../components/Summary';
import AggregateSummary from '../components/AggregateSummary';
import Header from '../components/Header';

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
    state = { expenses: [], openSort: false, type: this.props.match.params.type };

    componentDidMount() {
        this.fetchExpenses(this.props.start, this.props.end);
    }

    componentDidUpdate(props) {
        if (props !== this.props) {
            this.setState({ type: this.props.match.params.type }, () =>
                this.fetchExpenses(this.props.start, this.props.end)
            );
        }
    }

    async fetchExpenses(start, end) {
        const { type } = this.state;
        const res = await fetch(`/api/users/expenses/summary/${type}?start=${start}&end=${end}`);
        const data = await res.json();
        console.log(data);
        // data.expenses.forEach(el => console.log(el));
        this.setState({ expenses: data });
    }

    render() {
        const { classes } = this.props;
        const { expenses, type } = this.state;
        let total = 0;
        return (
            <div className={classes.container}>
                <Header title={`Expenses by ${type === 'cat' ? 'Category' : 'Store'}`} />
                <div className={classes.expenseList}>
                    {expenses.length === 0 ? (
                        <label>{`No expenses for ${
                            type === 'cat' ? 'categories' : 'stores'
                        }`}</label>
                    ) : null}
                    {expenses.map(el => {
                        total += el.amount;
                        return <AggregateSummary type={type} el={el} />;
                    })}
                </div>
                <Summary total={total} />
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { date } = state;
    const { start, end } = date.period;
    console.log(start, end);
    return { date, start, end };
};

export default connect(mapStateToProps)(withStyles(styles)(ExpensesAggregates));
