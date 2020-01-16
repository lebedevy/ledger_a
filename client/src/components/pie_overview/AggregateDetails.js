import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';

import SummaryDetailsButton from '../overview/SummaryDetailsButton';
import ExpenseSummary from '../ExpenseSummary';
import { getCurrencyFormat } from '../../utility/utility';
import { Switch } from '@material-ui/core';
import OverviewDetailsTrends from '../AggregateOverview/OverviewDetailsTrends';

const detailsUseStyles = makeStyles({
    selectedTitle: {
        display: 'flex',
        alignItems: 'center',
        // justifyContent: 'space-between',
        paddingBottom: '10px',
        '& h2': {
            wordBreak: 'break-all',
            '& label': {
                fontSize: '0.9em',
                fontStyle: 'italic',
                verticalAlign: 'center',
            },
        },
        '& div': {
            minHeight: '32px',
            minWidth: '32px',
            borderRadius: '50%',
        },
    },
});

export default function AggregateDetails({ selected, type }) {
    const classes = detailsUseStyles();
    const [total, setTotal] = useState(0);
    const [expanded, setExpanded] = useState(false);
    const [checked, setChecked] = useState(false);
    const [grouped, setGrouped] = useState(null);

    useEffect(() => {
        let total = 0;
        let grouped = {};
        let t = type === 'cat' ? 'store_id' : 'category_id';
        selected.data.forEach(el => {
            if (grouped[el[t]]) grouped[el[t]]['amount'] += el['amount'];
            else {
                const { id, user_id, category_id, store_id, amount } = el;
                const expense = { id, user_id, category_id, store_id, amount };
                expense[type === 'cat' ? 'store' : 'category'] =
                    el[type === 'cat' ? 'store' : 'category'];
                grouped[el[t]] = expense;
            }
            return (total += el.amount);
        });
        const sorted = Object.values(grouped).sort((a, b) => b['amount'] - a['amount']);
        setGrouped(sorted);
        setTotal(total);
    }, [selected]);

    return (
        <React.Fragment>
            <div className={classes.selectedTitle}>
                <div style={{ background: `#${selected.el.color}` }} />
                <h2>
                    Details:
                    <label>{`${
                        selected.el[type === 'cat' ? 'category_name' : 'store_name']
                    }`}</label>
                </h2>
            </div>
            <h3>Period Details</h3>
            <label>{`Total ${type === 'cat' ? 'category' : 'store'} expense: $${getCurrencyFormat(
                total
            )}`}</label>
            <SummaryDetailsButton expanded={expanded} setExpanded={setExpanded} />
            {expanded ? (
                <GroupDetailsSwitch
                    checked={checked}
                    setChecked={setChecked}
                    type={type === 'cat' ? 'store' : 'category'}
                />
            ) : null}
            {expanded ? (
                <table style={{ width: '100%' }}>
                    {(() => (checked ? grouped : selected.data))().map(el => {
                        const exclude = { [type === 'cat' ? 'category' : 'store']: true };
                        if (checked) exclude['date'] = true;
                        return <ExpenseSummary key={el.id} el={el} exclude={exclude} />;
                    })}
                </table>
            ) : null}
            <OverviewDetailsTrends selected={selected} type={type} />
        </React.Fragment>
    );
}

function OverviewDetailsPeriod() {}

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
