import React from 'react';
import { connect } from 'react-redux';
import { Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    addExpense: {
        position: 'fixed',
        right: '10px',
    },
});

function AddExpenseButton({ history, width }) {
    const classes = useStyles();
    return (
        <Fab
            className={classes.addExpense}
            style={{ bottom: width > 600 ? '10px' : '9vh ' }}
            size="medium"
            color="secondary"
            onClick={() => history.push('/users/expenses/add')}
        >
            <AddIcon />
        </Fab>
    );
}

const mapStateToProps = state => {
    const { width } = state.screen;
    return { width };
};

export default connect(mapStateToProps)(AddExpenseButton);
