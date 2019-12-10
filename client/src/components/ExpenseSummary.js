import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { getFormatedDate, getCurrencyFormat } from '../utility/utility';
// import MoreVertIcon from '@material-ui/icons/MoreVert';

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
        '& button': {
            borderRadius: 0,
            border: '1px solid #00000020',
            minWidth: '0',
        },
    },
});

function ExpenseSummary({ el, ind, expand }) {
    const classes = useStyles();
    return (
        <div className={classes.expenseEntry} onClick={expand}>
            <label>{`$${getCurrencyFormat(el.amount)}`}</label>
            <label>{el.store.store_name}</label>
            <label>{el.category.category_name}</label>
            <label>{el.date}</label>
            {/* {window.innerWidth > 600 ? (
                <IconButton size="small">
                    <MoreVertIcon fontSize="small" />
                </IconButton>
            ) : null} */}
        </div>
    );
}

export default ExpenseSummary;
