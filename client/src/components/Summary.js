import React from 'react';
import { connect } from 'react-redux';
import { getCurrencyFormat } from '../utility/utility';
import { makeStyles } from '@material-ui/styles';
import AddExpenseButton from './AddExpenseButton';

const useStyles = makeStyles({
    summary: {
        padding: '10px',
        height: '70px',
        background: '#96C3CE',
    },
    total: {
        fontWeight: 'bold',
    },
    dates: {
        display: 'block',
        padding: '10px 0',
        fontSize: '0.9em',
        fontStyle: 'italic',
    },
});

function Summary({ total, start, end, history }) {
    const classes = useStyles();
    return (
        <div className={classes.summary}>
            <label>Total: </label>
            <label className={classes.total}>${getCurrencyFormat(total)}</label>
            <br />
            <label className={classes.dates}>{`${start} to ${end}`}</label>
            <AddExpenseButton history={history} />
        </div>
    );
}

const mapStateToProps = state => {
    const { date } = state;
    const { start, end } = date.period;
    return { start, end };
};

export default connect(mapStateToProps)(Summary);
