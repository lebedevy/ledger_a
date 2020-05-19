import React, { useState, useEffect } from 'react';
import { getCurrencyFormat } from '../../utility/utility';
import SummaryDetailsButton from './SummaryDetailsButton';
import Details from './SummaryDetails';
import SummaryItem from '../SummaryItem';

export default function MaxExpense({ max }) {
    const [expanded, setExpanded] = useState(false);
    const [expenses, setExpenses] = useState(null);

    useEffect(() => {
        if (max) fetchExpenseSummary();
    }, [max]);

    async function fetchExpenseSummary() {
        console.log('Fetching max expense data');
        const res = await fetch(
            `/api/users/expenses/summary?start=${max.date}&end=${max.date}&sort=amount&order=desc`
        );
        if (res.status === 200) {
            const data = await res.json();
            if (data.expenses) {
                return setExpenses(data.expenses);
            }
        }
        console.error('Error fetching results');
    }

    return (
        <SummaryItem>
            <h2>Max Daily Expense</h2>
            <label>{max ? max.date : 'loading...'}</label>
            <label>{max ? `$${getCurrencyFormat(max.amount)}` : ''}</label>
            <SummaryDetailsButton setExpanded={setExpanded} expanded={expanded} />
            {(() => {
                if (expanded) {
                    if (expenses == null) fetchExpenseSummary();
                    return <Details expenses={expenses} refetch={fetchExpenseSummary} />;
                } else {
                    return null;
                }
            })()}
        </SummaryItem>
    );
}
