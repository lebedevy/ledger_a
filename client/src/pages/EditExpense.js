import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import ExpenseManager from '../components/ExpenseManager';

const useStyles = makeStyles({
    container: {
        height: '100%',
        width: '100%',
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

    console.log(match.params.id);

    async function fetchAPI() {
        const res = await fetch(`/api/users/expenses/edit/${match.params.id}`);
        console.log(res);
        const data = await res.json();
        console.log(data);
        setAmount(data.expense.amount);
        setStore(data.expense.store);
        setCategory(data.expense.category);
        setDate(data.expense.date);
    }

    useEffect(() => {
        fetchAPI();
    }, []);

    // store/category popup if did not exist in db before

    async function edit() {
        console.log(amount, store, category, date);
        const res = await fetch(`/api/users/expenses/edit/${match.params.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ expenses: { amount, store, category, date } }),
        });
        const data = await res.json();
        console.log(res, data);
        if (res.status === 200) history.push('/users/expenses/summary');
    }

    return (
        <div
            className={classes.container}
            style={mobile ? { height: `calc(${height}px - 16vh)` } : {}}
        >
            <h2>Edit Expense</h2>
            <ExpenseManager
                amount={amount}
                setAmount={value => setAmount(value)}
                category={category}
                setCategory={value => setCategory(value)}
                store={store}
                setStore={value => setStore(value)}
                date={date}
                setDate={value => setDate(value)}
                submit={edit}
                buttonLabel="save"
            />
        </div>
    );
}

const mapStateToProps = state => {
    const { height, mobile } = state.screen;
    return { height, mobile };
};

export default connect(mapStateToProps)(EditExpense);
