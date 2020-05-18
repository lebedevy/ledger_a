import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import Summary from '../components/Summary';
import AggregateSummary from '../components/AggregateSummary';
import Header from '../components/Header';
import { getSort, getSortIndexes } from '../utility/utility';
import LoadingComponent from '../components/LoadingComponent';
import { fetchAggregateExpensesIfNeeded, invalidateExpenses } from '../redux/actions';

const useStyles = makeStyles({
    container: {
        margin: '0 auto',
        width: '100vw',
        maxWidth: '1200px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
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
const optionsLowerCase = options.map((el) => el.toLowerCase());
const orderDir = ['asc', 'desc'];

/*
 * Should seperate the logic for expense type into a wrapper, and just have this as a dumb
 * component that renders an expense list it's given
 *
 */

function ExpensesAggregates({
    aggregateExpenses,
    height,
    width,
    start,
    end,
    location,
    match,
    history,
    fetchDataIfNeeded,
    invalidateExpenses,
}) {
    const classes = useStyles();
    const [sort, setSort] = useState(0);
    const [order, setOrder] = useState(1);
    const [type, setType] = useState(getType());
    const [sortOpen, setSortOpen] = useState(false);

    useEffect(() => {
        getFilters();
        // Temp fix:
        // Since the aggregate data is now shared between the overview and details
        // If details changes the sort of aggregate data from the one required for
        // overview (amount, desc),the data should be invalidated
        return () => {
            // checking sort/order against original doesnt seem to work(function is constructed when component mounts
            // so the values will almost always reflect the original sort && order, and will not be updated since they are primitives)
            invalidateExpenses(type);
        };
    }, []);

    // update type param
    useEffect(() => {
        console.log(match.params.type, type);
        if (match.params.type !== type) {
            setType(getType());
            getFilters();
        }
    }, [match, type]);

    // Update url on sort/order change
    useEffect(() => {
        updateURL();
    }, [order, sort]);

    // Refetch expenses if any parameter changes
    useEffect(() => {
        fetchData();
    }, [type, start, end, sort, order]);

    const updateSortParams = (field, val) => {
        if (field === 'sort') setSort(val);
        else setOrder(val);
        invalidateExpenses(type);
    };

    function getType() {
        return match.params.type === 'category' ? 'category' : 'store';
    }

    function getFilters() {
        const [updatedSort, updatedOrder] = getSortIndexes(
            optionsLowerCase,
            ...getSort(location.search)
        );
        if (updatedSort != null && updatedSort != sort) updateSortParams('sort', updatedSort);
        if (updatedOrder != null && updatedOrder != order) updateSortParams('order', updatedOrder);
    }

    function updateURL() {
        const search = new URLSearchParams();
        search.set('sort', optionsLowerCase[sort]);
        search.set('order', order === 1 ? 'desc' : 'asc');
        let path = location.pathname;
        if (path.slice(-1) === '/') path = history.location.pathname.slice(0, -1);
        history.push(path + '?' + search.toString());
    }

    function fetchData() {
        console.log('Calling redux fetch');
        const params = `?start=${start}&end=${end}&sort=${optionsLowerCase[sort]}&order=${orderDir[order]}`;
        console.log(type, params);
        fetchDataIfNeeded([type, params]);
    }

    let total = 0;
    console.log(aggregateExpenses);
    const expenses = aggregateExpenses[type] ? aggregateExpenses[type].items : null;

    console.log(expenses);

    return (
        <div
            className={clsx(width > 600 ? classes.desktop : classes.mobile, classes.container)}
            style={width <= 600 ? { height: `calc(${height}px - 16vh)` } : {}}
        >
            <Header
                setOpen={() => setSortOpen(!sortOpen)}
                open={sortOpen}
                title={`Expenses by ${type === 'category' ? 'Category' : 'Store'}`}
                dashboard={{
                    setSort: (val) => updateSortParams('sort', val),
                    setOrder: (val) => updateSortParams('order', val),
                    sort,
                    order,
                    options,
                }}
            />
            <div className={classes.expenseList}>
                {expenses && expenses.length === 0 ? (
                    <label>{`No expenses for ${
                        type === 'category' ? 'categories' : 'stores'
                    }`}</label>
                ) : null}
                {expenses &&
                    expenses.map((el) => {
                        total += el.amount;
                        return <AggregateSummary key={el.id} type={type} el={el} />;
                    })}
                {!expenses && <LoadingComponent />}
            </div>
            <Summary total={total} />
        </div>
    );
}

const mapStateToProps = (state) => {
    const { aggregateExpenses } = state;
    const { width, height } = state.screen;
    const { start, end } = state.date.period;
    return { aggregateExpenses, height, width, start, end };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchDataIfNeeded: (args) => dispatch(fetchAggregateExpensesIfNeeded(args)),
        invalidateExpenses: (args) => dispatch(invalidateExpenses(args)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExpensesAggregates);
