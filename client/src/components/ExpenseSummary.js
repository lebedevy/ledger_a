import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { getCurrencyFormat } from '../utility/utility';

const useStyles = makeStyles({
    expenseEntdy: {
        padding: '0 1px',
        display: 'flex',
        bottomBorder: '1px solid #00000060',
        '& td': {
            minHeight: '1em',
            padding: '2px 0',
            flex: '1 1 0',
            border: '1px solid #00000020',
            minWidth: '0',
            wordBreak: 'break-all',
            'overflow-x': 'auto',
        },
        '& button': {
            borderRadius: 0,
            border: '1px solid #00000020',
            minWidth: '0',
        },
    },
});

function ExpenseSummary({ el, ind, expand, exclude }) {
    const classes = useStyles();
    return (
        <tr className={classes.expenseEntdy} onClick={expand}>
            <td>{`$${getCurrencyFormat(el.amount)}`}</td>
            {!exclude || !exclude['store'] ? <td>{el.store ? el.store.store_name : ''}</td> : null}
            {!exclude || !exclude['category'] ? (
                <td>{el.category ? el.category.category_name : ''}</td>
            ) : null}
            {!exclude || !exclude['date'] ? <td>{el.date}</td> : null}
        </tr>
    );
}

export default ExpenseSummary;
