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

function AggregateOverview({ start, end, match, width, fetchData }) {
    const classes = useStyles();
    const [type, setType] = useState(match.params.type);
    const [total, setTotal] = useState(0);
    const [data, setData] = useState(null);
    const [selected, setSelected] = useState(null);
    const [loadingSelected, setLoadingSelected] = useState(false);
    const [legendOpen, setLegendOpen] = useState(false);

    // update type param
    useEffect(() => {
        if (match.params.type !== type) {
            setType(match.params.type);
        }
    }, [match]);

    // Fetch expenses on type change
    useEffect(() => {
        setSelected(null);
        fetchExpenses();
    }, [type, start, end]);

    async function fetchExpenses() {
        const params = `${type}?start=${start}&end=${end}`;
        console.log(fetchData);
        fetchData([type === 'cat' ? 'category' : 'store', params]);
        // store.dispatch(
        //     fetchAggregateExpensesIfNeeded([type === 'cat' ? 'category' : 'store', params])
        // );
        // console.log(`Getting ${type === 'cat' ? 'category' : 'store'} expenses overview`);
        // const res = await fetch(`/api/users/expenses/summary/${type}?start=${start}&end=${end}`);
        // if (res.ok) {
        //     const data = await res.json();
        //     formatData(data);
        //     return;
        // }
        // console.log('Error fetching data');
        // console.log(await res.json());
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
            console.info(`Getting ${type === 'cat' ? 'category' : 'store'} details`);
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
                <h1>{`${type === 'cat' ? 'Category' : 'Store'} Overview`}</h1>
                <div className={classes.graph}>
                    {data ? (
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
                    ) : (
                        <React.Fragment>
                            <div style={{ height: '80vw', maxHeight: '500px' }} />
                            <LoadingComponent />
                        </React.Fragment>
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
    const { start, end } = state.date.period;
    const { width } = state.screen;
    return { start, end, width };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchData: args => dispatch(fetchAggregateExpensesIfNeeded(args)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AggregateOverview);
