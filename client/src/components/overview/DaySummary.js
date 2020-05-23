import React, { useState, useEffect } from 'react';
import SummaryDetailsButton from './SummaryDetailsButton';
import Details from './SummaryDetails';
import { getCurrencyFormat, getFormatedDate } from '../../utility/utility';
import SummaryItem from '../SummaryItem';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    emptyList: {
        textAlign: 'center',
    },
    selectOther: {
        fontStyle: 'italic',
        fontSize: '.8em',
    },
});

export default function DaySummary({ day }) {
    const classes = useStyles();
    const today = getFormatedDate(useSelector((state) => state.date.today));
    const [expanded, setExpanded] = useState(false);
    const [expenses, setExpenses] = useState(null);
    const [todaysExpenses, setTodaysExpenses] = useState(null);
    const [todaysTotal, setTodaysTotal] = useState(0);

    useEffect(() => {
        fetchTodaysExpenses();
    }, []);

    useEffect(() => {
        if (day !== null) fetchExpenseSummary();
    }, [day]);

    const fetchExpenses = async (date) => {
        console.log(`Fetching day summary ${date}`);
        const res = await fetch(
            `/api/users/expenses/summary?start=${date}&end=${date}&sort=amount&order=desc`
        );
        if (res.status === 200) {
            const data = await res.json();
            if (data.expenses) {
                return data.expenses;
            }
        }
        console.error('Error fetching results');
        return [];
    };

    async function fetchTodaysExpenses() {
        const data = await fetchExpenses(today);
        setTodaysTotal(data.reduce((total, el) => total + el.amount, 0));
        setTodaysExpenses(data);
    }

    async function fetchExpenseSummary() {
        setExpenses(await fetchExpenses(day.date));
    }

    const expensesList = day ? expenses : todaysExpenses;

    return (
        <SummaryItem>
            {day == null ? (
                <>
                    <div>
                        <h2>Today's Expenses</h2>
                        <label className={classes.selectOther}>
                            Select any other day on the graph above to view that day's expenses
                        </label>
                    </div>
                    <label>{today}</label>
                    <label>{`Expenses: $${getCurrencyFormat(todaysTotal)}`}</label>
                </>
            ) : (
                <>
                    <h2>{`Summary for ${day.date}`}</h2>
                    <label>{`Expenses: $${getCurrencyFormat(day.amount)}`}</label>
                </>
            )}
            {expensesList && expensesList.length > 0 ? (
                <SummaryDetailsButton setExpanded={setExpanded} expanded={expanded} />
            ) : (
                <label className={classes.emptyList}>No expenses for selected date</label>
            )}
            {expanded && <Details expenses={expensesList} refetch={fetchExpenseSummary} />}
        </SummaryItem>
    );
}
