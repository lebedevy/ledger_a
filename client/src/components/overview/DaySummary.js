import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import SummaryDetailsButton from './SummaryDetailsButton';
import Details from './SummaryDetails';
import { getCurrencyFormat } from '../../utility/utility';
import SummaryItem from '../SummaryItem';

export default function DaySummary({ day }) {
    const [expanded, setExpanded] = useState(false);
    const [expenses, setExpenses] = useState(null);

    useEffect(() => {
        if (day) fetchExpenseSummary();
    }, [day]);

    async function fetchExpenseSummary() {
        console.log('Fetching day summary');
        const res = await fetch(
            `/api/users/expenses/summary?start=${day.date}&end=${day.date}&sort=amount&order=desc`
        );
        if (res.status === 200) {
            const data = await res.json();
            if (data.expenses) {
                setExpenses(data.expenses);
                return;
            }
        }
        console.error('Error fetching results');
    }

    return (
        <SummaryItem>
            {day == null ? (
                <h2>Select day to see summary</h2>
            ) : (
                <>
                    <h2>{`Summary for ${day.date}`}</h2>
                    <label>{`Expenses: $${getCurrencyFormat(day.amount)}`}</label>
                    <SummaryDetailsButton setExpanded={setExpanded} expanded={expanded} />
                    {(() => {
                        if (expanded) {
                            if (expenses == null) fetchExpenseSummary();
                            return <Details expenses={expenses} />;
                        } else {
                            return null;
                        }
                    })()}
                </>
            )}
        </SummaryItem>
    );
}
