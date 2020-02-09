import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';

import PieLegend from '../components/pie_overview/PieLegend';
import PieChart from '../components/pie_overview/PieChart';
import AggregateDetails from '../components/AggregateOverview/AggregateDetails';
import LoadingComponent from '../components/LoadingComponent';
import OverviewDetailsTrends from '../components/AggregateOverview/OverviewDetailsTrends';
import DetailsHeader from '../components/AggregateOverview/DetailsHeader';
import { fetchAggregateExpensesIfNeeded } from '../redux/actions';

// ADD SUPPORT FOR RANDOM COLOR GENERATION
const colors = [
    '7DBBC3',
    'DE6B48',
    'F4B9B2',
    '247BA0',
    'E5B181',
    '2E9B56',
    '8EB19D',
    'E4572E',
    'C2095A',
    'F25F5C',
    'B57BA6',
    'CECCCE',
    'FEB95F',
    '42CAFD',
    'F71735',
    'F0D2D1',
    '29335C',
    'F3A712',
    'A8C686',
    'FFE066',
];

const useStyles = makeStyles({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    page: {
        flex: 1,
        padding: '10px',
        maxWidth: '1200px',
    },
    graph: {
        padding: '20px 0',
        position: 'relative',
        background: '#FEFCFB',
        border: 'solid #00000020 1px',
        display: 'flex',
    },
});

function AggregateOverview({ start, end, match, width, aggregateExpenses, fetchDataIfNeeded }) {
    const classes = useStyles();
    const [expenses, setExpenses] = useState({});
    const [type, setType] = useState(getType());
    const [total, setTotal] = useState(0);
    const [data, setData] = useState(null);
    const [selected, setSelected] = useState(null);
    const [loadingSelected, setLoadingSelected] = useState(false);
    const [legendOpen, setLegendOpen] = useState(false);

    // update type param
    useEffect(() => {
        if (match.params.type !== type) {
            setType(getType());
        }
    }, [match]);

    // Fetch expenses on type change
    useEffect(() => {
        setSelected(null);
        fetchExpenses();
    }, [type, start, end]);

    // Rebuild expense list on change to expenses
    useEffect(() => {
        if (aggregateExpenses[type]) {
            formatData(aggregateExpenses[type].items);
            setExpenses(aggregateExpenses[type]);
        }
    }, [aggregateExpenses[type]]);

    function getType() {
        return match.params.type === 'category' ? 'category' : 'store';
    }

    async function fetchExpenses() {
        const params = `?start=${start}&end=${end}`;
        fetchDataIfNeeded([type, params]);
    }

    function formatData(data) {
        let total = 0;
        data.forEach((el, ind) => {
            total += el.amount;
            el.color = colors[ind];
        });
        setTotal(total);
        setData(data);
    }

    const getDetails = async el => {
        if (el) {
            setLoadingSelected(true);
            console.info(`Getting ${type} details`);
            const res = await fetch(
                `/api/users/expenses/overview/${type}/details?start=${start}&end=${end}&id=${el.id}`
            );
            if (res.ok) {
                const data = await res.json();
                const selected = { data: data.expenses, el };
                setSelected(selected);
                setLoadingSelected(false);
                return;
            }
            console.error('Error fetching data');
            console.log(await res.json());
        } else setSelected(null);
        setLoadingSelected(false);
    };

    return (
        <div className={classes.container}>
            <div className={classes.page}>
                <h1>{`${type === 'category' ? 'Category' : 'Store'} Overview`}</h1>
                <div className={classes.graph}>
                    {expenses.isFetching ? (
                        <React.Fragment>
                            <div style={{ height: '80vw', maxHeight: '500px' }} />
                            <LoadingComponent />
                        </React.Fragment>
                    ) : (
                        data && (
                            <React.Fragment>
                                <PieChart data={data} total={total} setSelected={getDetails} />
                                <PieLegend
                                    open={legendOpen}
                                    setLegendOpen={setLegendOpen}
                                    width={width}
                                    data={data}
                                    setSelected={getDetails}
                                />
                            </React.Fragment>
                        )
                    )}
                </div>
                <DetailsHeader selected={selected} type={type} />
                {!selected ? (
                    <React.Fragment>{loadingSelected ? <LoadingComponent /> : null}</React.Fragment>
                ) : (
                    <React.Fragment>
                        <AggregateDetails selected={selected} type={type} />
                        <OverviewDetailsTrends selected={selected} type={type} />
                    </React.Fragment>
                )}
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    const { aggregateExpenses } = state;
    const { start, end } = state.date.period;
    const { width } = state.screen;
    return { start, end, width, aggregateExpenses };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchDataIfNeeded: args => dispatch(fetchAggregateExpensesIfNeeded(args)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AggregateOverview);
