import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import { TextField, Button, CircularProgress } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/styles';
import {
    fetchTemplateListIfNeeded,
    invalidateExpenses,
    invalidateTemplateList,
} from '../redux/actions';

const useStyles = makeStyles({
    form: {
        position: 'relative',
        padding: '10px',
        width: 'calc(100% - 60px)',
        minWidth: '230px',
        maxWidth: '300px',
        margin: '0 50px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#FBF5F399',
        borderRadius: '5px',
        border: '1px solid #00000020',
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
    fetchDataIfNeeded,
    invalidateExpenses,
    invalidateTemplateList,
}) {
    const classes = useStyles();
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchDataIfNeeded('categories');
        fetchDataIfNeeded('stores');
    }, []);

    const submitExpense = e => {
        e.preventDefault();
        setSubmitting(true);
        if (stores && !stores.items.includes(store)) invalidateTemplateList('stores');
        if (categories && !categories.items.includes(category))
            invalidateTemplateList('categories');
        invalidateExpenses('category');
        invalidateExpenses('store');
        submit();
    };

    return (
        <form className={classes.form} onSubmit={submitExpense}>
            <div className={classes.backlay} />
            {submitting && (
                <div className={classes.loading}>
                    <div className={classes.backlay} />
                    <CircularProgress />
                </div>
            )}
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
                options={stores && stores.items}
                disableClearable
                inputValue={store}
                onInputChange={(e, val) => setStore(val)}
                renderInput={params => <FormatedTextField {...params} placeholder="Store" />}
            />
            <Autocomplete
                freeSolo
                autoCapitalize="words"
                options={categories && categories.items}
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
            <Button type="submit" color="primary" variant="contained" disabled={submitting}>
                {buttonLabel}
            </Button>
        </form>
    );
}

const mapStateToProps = state => {
    const { stores, categories } = state.templateLists;
    return { categories, stores };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchDataIfNeeded: args => dispatch(fetchTemplateListIfNeeded(args)),
        invalidateExpenses: args => dispatch(invalidateExpenses(args)),
        invalidateTemplateList: args => dispatch(invalidateTemplateList(args)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExpenseManager);
