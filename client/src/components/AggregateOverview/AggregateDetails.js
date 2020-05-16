import React, { useState, useEffect } from 'react';
import SummaryDetailsButton from '../overview/SummaryDetailsButton';
import ExpenseRow from '../ExpenseRow';
import { getCurrencyFormat } from '../../utility/utility';
import { Switch } from '@material-ui/core';
import { connect } from 'react-redux';
import SummaryItem from '../SummaryItem';
import WeeklySummary from '../AggregateOverview/WeeklySummary';

function AggregateDetails({ selected, type, start, end }) {
    const [total, setTotal] = useState(0);
    const [expanded, setExpanded] = useState(false);
    const [checked, setChecked] = useState(false);
    const [grouped, setGrouped] = useState(null);

    useEffect(() => {
        groupExpenses();
    }, [selected]);

    function groupExpenses() {
        let total = 0;
        let grouped = {};
        let t = type === 'category' ? 'store_id' : 'category_id';
        selected.data.forEach((el) => {
            if (grouped[el[t]]) grouped[el[t]]['amount'] += el['amount'];
            else {
                const { id, user_id, category_id, store_id, amount } = el;
                const expense = { id, user_id, category_id, store_id, amount };
                expense[type === 'category' ? 'store' : 'category'] =
                    el[type === 'category' ? 'store' : 'category'];
                grouped[el[t]] = expense;
            }
            return (total += el.amount);
        });
        const sorted = Object.values(grouped).sort((a, b) => b['amount'] - a['amount']);
        setGrouped(sorted);
        setTotal(total);
    }

    return (
        <SummaryItem>
            <h2>Period Details</h2>
            <label>{`${start} to ${end}`}</label>
            <label>{`Total ${
                type === 'category' ? 'category' : 'store'
            } expense: $${getCurrencyFormat(total)}`}</label>
            <h3>Period Overview</h3>
            <h4>Period expenses by week</h4>

            <WeeklySummary expenses={selected.data} />
            <h3>Transactions</h3>
            <SummaryDetailsButton expanded={expanded} setExpanded={setExpanded} />
            {expanded ? (
                <GroupDetailsSwitch
                    checked={checked}
                    setChecked={setChecked}
                    type={type === 'category' ? 'store' : 'category'}
                />
            ) : null}
            {expanded ? (
                <table style={{ width: '100%' }}>
                    {(() => (checked ? grouped : selected.data))().map((el) => {
                        const exclude = { [type === 'category' ? 'category' : 'store']: true };
                        if (checked) exclude['date'] = true;
                        return <ExpenseRow key={el.id} el={el} exclude={exclude} />;
                    })}
                </table>
            ) : null}
        </SummaryItem>
    );
}

const mapStateToProps = (state) => {
    const { start, end } = state.date.period;
    const { mobile } = state.screen;
    return { start, end, mobile };
};

export default connect(mapStateToProps)(AggregateDetails);

function GroupDetailsSwitch({ checked, setChecked, type }) {
    const classes = {
        contianer: {
            display: 'flex',
            alignItems: 'center',
        },
    };
    return (
        <div>
            <label>Group by {type}</label>
            <Switch checked={checked} onChange={() => setChecked(!checked)} />
        </div>
    );
}
