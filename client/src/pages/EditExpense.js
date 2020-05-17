import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import ExpenseManager from '../components/ExpenseManager';

const useStyles = makeStyles({
    container: {
        position: 'fixed',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#00000025',
    },
});

function EditExpense({ match, history, height, mobile }) {
    const classes = useStyles();
    const [amount, setAmount] = useState('');
    const [store, setStore] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');

    useEffect(() => {
        fetchAPI();
    }, []);

    async function fetchAPI() {
        const res = await fetch(`/api/users/expenses/edit/${match.params.id}`);
        const data = await res.json();
        setAmount(data.expense.amount);
        setStore(data.expense.store);
        setCategory(data.expense.category);
        setDate(data.expense.date);
    }

    async function edit() {
        const res = await fetch(`/api/users/expenses/edit/${match.params.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ expense: { amount, store, category, date } }),
        });
        if (res.status === 200) history.push('/users/expenses/get/summary');
    }

    return (
        <div className={classes.container} style={mobile ? { bottom: '8vh' } : { top: '65px' }}>
            <h2>Edit Expense</h2>
            <ExpenseManager
                amount={amount}
                setAmount={(value) => setAmount(value)}
                category={category}
                setCategory={(value) => setCategory(value)}
                store={store}
                setStore={(value) => setStore(value)}
                date={date}
                setDate={(value) => setDate(value)}
                submit={edit}
                buttonLabel="save"
            />
        </div>
    );
}

const mapStateToProps = (state) => {
    const { height, mobile } = state.screen;
    return { height, mobile };
};

export default connect(mapStateToProps)(EditExpense);
