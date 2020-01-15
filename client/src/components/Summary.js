import React from 'react';
import { connect } from 'react-redux';
import { getCurrencyFormat } from '../utility/utility';
import { makeStyles } from '@material-ui/styles';
import AddExpenseButton from './AddExpenseButton';
import clsx from 'clsx';

const useStyles = makeStyles({
    summary: {
        padding: '10px',
        height: '70px',
        background: '#EBF2FA',
        borderTop: '1px solid #00000050',
    },
    desktop: {
        border: 'solid 1px #00000020',
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

function Summary({ total, start, end, history, mobile, width }) {
    const classes = useStyles();
    return (
        <div className={clsx(classes.summary, width >= 1200 && classes.desktop)}>
            <label>Total: </label>
            <label className={classes.total}>${getCurrencyFormat(total)}</label>
            <br />
            <label className={classes.dates}>{`${start} to ${end}`}</label>
            <AddExpenseButton history={history} />
        </div>
    );
}

const mapStateToProps = state => {
    const { start, end } = state.date.period;
    const { mobile, width } = state.screen;
    return { start, end, mobile, width };
};

export default connect(mapStateToProps)(Summary);
