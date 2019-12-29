import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import SummaryDetailsButton from './SummaryDetailsButton';
import Details from './SummaryDetails';
import { getCurrencyFormat } from '../../utility/utility';

const useStyles = makeStyles({
    summaryItem: {
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #00000020',
        padding: '10px',
        margin: '10px 0',
        '& label': {
            padding: '5px',
        },
        '& h2': {
            padding: '5px',
            margin: 0,
        },
    },
});

export default function DaySummary({ day }) {
    const classes = useStyles();
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
        <div className={classes.summaryItem}>
            {day == null ? (
                <h2>Select day to see summary</h2>
            ) : (
                <React.Fragment>
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
                </React.Fragment>
            )}
        </div>
    );
}
