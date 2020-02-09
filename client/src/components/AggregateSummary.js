import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { getCurrencyFormat } from '../utility/utility';

const useStyles = makeStyles({
    expenseEntry: {
        padding: '0 1px',
        display: 'flex',
        bottomBorder: '1px solid #00000060',
        '& label': {
            padding: '2px 0',
            flex: '1 1 0',
            border: '1px solid #00000020',
            minWidth: '0',
            'overflow-x': 'auto',
        },
    },
});

function AggregateSummary({ el, type, ind, expand }) {
    const classes = useStyles();
    return (
        <div className={classes.expenseEntry} onClick={expand}>
            <label>{type === 'category' ? el.category_name : el.store_name}</label>
            <label>{`$${getCurrencyFormat(el.amount)}`}</label>
        </div>
    );
}

export default AggregateSummary;
