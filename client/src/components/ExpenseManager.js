import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import { TextField, Button, CircularProgress } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/styles';
import { setCategories, setStores } from '../redux/actions';

const useStyles = makeStyles({
    form: {
        position: ' relative',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#FBF5F399',
        borderRadius: '5px',
        '& button': { marginTop: '10px' },
        '& div': { width: '100%' },
    },
    backlay: {
        borderRadius: '5px',
        background: '#FBF5F380',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
    },
    loading: {
        zIndex: 3,
        borderRadius: '5px',
        background: '#585B5699',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

const FormatedTextField = withStyles({
    root: {
        width: '100%',
        padding: '5px',
        '& label.Mui-focused': {
            color: '#E28413',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: '#E28413',
        },
    },
})(TextField);

function ExpenseManager({
    amount,
    store,
    category,
    date,
    setAmount,
    setStore,
    setCategory,
    setDate,
    submit,
    buttonLabel,
    categories,
    stores,
    setCategories,
    setStores,
}) {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (categories === null) {
            console.log('Categories not set.');
            getCategories();
        }
        if (stores === null) {
            console.log('Stores not set.');
            getStores();
        }
    });

    async function getCategories() {
        const catRes = await fetch('/api/users/expenses/categories');
        if (catRes.status === 200) {
            const data = await catRes.json();
            const output = data.categories.map(el => el['category_name']);
            setCategories(output);
        }
    }

    async function getStores() {
        const strRes = await fetch('/api/users/expenses/stores');
        if (strRes.status === 200) {
            const data = await strRes.json();
            const result = data.stores.map(el => el['store_name']);
            setStores(result);
        }
    }

    function submitExpense(e) {
        e.preventDefault();
        setLoading(true);
        submit();
    }

    return (
        <form className={classes.form} onSubmit={e => submitExpense(e)}>
            <div className={classes.backlay} />
            {loading ? (
                <div className={classes.loading}>
                    <div className={classes.backlay} />
                    <CircularProgress />
                </div>
            ) : null}
            <FormatedTextField
                className={classes.root}
                placeholder="Amount"
                type="number"
                required
                value={amount}
                onChange={e => setAmount(e.target.value)}
            />
            <Autocomplete
                freeSolo
                autoCapitalize="words"
                options={stores || []}
                disableClearable
                inputValue={store}
                onInputChange={(e, val) => setStore(val)}
                renderInput={params => <FormatedTextField {...params} placeholder="Store" />}
            />
            <Autocomplete
                freeSolo
                autoCapitalize="words"
                options={categories || []}
                disableClearable
                inputValue={category}
                onInputChange={(e, val) => setCategory(val)}
                renderInput={params => (
                    <FormatedTextField {...params} placeholder="Expense category" fullWidth />
                )}
            />
            <FormatedTextField
                placeholder="Date"
                required
                value={date}
                type="date"
                onChange={e => setDate(e.target.value)}
            />
            <Button type="submit" color="primary" variant="contained" disabled={loading}>
                {buttonLabel}
            </Button>
        </form>
    );
}

const mapStateToProps = state => {
    const { categories, stores } = state;
    return { categories, stores };
};

export default connect(mapStateToProps, { setCategories, setStores })(ExpenseManager);
