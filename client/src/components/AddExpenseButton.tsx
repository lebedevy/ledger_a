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

function AddExpenseButton({ history, mobile }) {
    const classes = useStyles();
    return (
        <Fab
            className={classes.addExpense}
            style={{ bottom: mobile ? '9vh' : '10px' }}
            size="medium"
            color="secondary"
            onClick={() => history.push('/users/expenses/add')}
        >
            <AddIcon />
        </Fab>
    );
}

const mapStateToProps = state => {
    const { mobile } = state.screen;
    return { mobile };
};

export default connect(mapStateToProps)(AddExpenseButton);
