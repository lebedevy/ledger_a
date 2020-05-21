import React, { useState, useEffect } from 'react';
import SummaryDetailsButton from '../overview/SummaryDetailsButton';
import { NonEditableRow } from '../ExpenseRow';
import { getCurrencyFormat } from '../../utility/utility';
import { Switch } from '@material-ui/core';
import { useSelector } from 'react-redux';
import SummaryItem from '../SummaryItem';
import WeeklySummary from '../AggregateOverview/WeeklySummary';
import { IExpense, IAggregate, RootState, IAggregated } from '../typescript/general_interfaces';

interface IProps {
    selected: { data: Array<IExpense>; el: IAggregate };
    type: string;
}

export default function AggregateDetails({ selected, type }: IProps) {
    const { start, end } = useSelector((state: RootState) => state.date.period);
    const [total, setTotal] = useState(0);
    const [expanded, setExpanded] = useState(false);
    const [checked, setChecked] = useState(false);
    const [grouped, setGrouped] = useState<Array<IAggregated>>([]);

    useEffect(() => {
        groupExpenses();
    }, [selected]);

    function groupExpenses() {
        let total = 0;
        let grouped = {} as { [key: string]: IAggregated };
        let t = type === 'category' ? 'store' : 'category';
        selected.data.forEach((el) => {
            if (grouped[el[t]]) grouped[el[t]]['amount'] += el['amount'];
            else {
                const { id, user_id, category, store, amount } = el;
                const expense = { id, user_id, category, store, amount };
                expense[type === 'category' ? 'store' : 'category'] =
                    el[type === 'category' ? 'store' : 'category'];
                grouped[el[t]] = expense;
            }
            total += el.amount;
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
                    {checked
                        ? grouped.map((expense) => (
                              <NonEditableRow
                                  key={expense.id}
                                  expense={expense}
                                  exclude={{
                                      [type === 'category' ? 'category' : 'store']: true,
                                      date: true,
                                  }}
                              />
                          ))
                        : selected.data.map((expense) => (
                              <NonEditableRow
                                  key={expense.id}
                                  expense={expense}
                                  exclude={{ [type === 'category' ? 'category' : 'store']: true }}
                              />
                          ))}
                </table>
            ) : null}
        </SummaryItem>
    );
}

interface IPropsGroup {
    checked: boolean;
    setChecked: (chk: boolean) => void;
    type: string;
}

function GroupDetailsSwitch({ checked, setChecked, type }: IPropsGroup) {
    return (
        <div>
            <label>Group by {type}</label>
            <Switch checked={checked} onChange={() => setChecked(!checked)} />
        </div>
    );
}
