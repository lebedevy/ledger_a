import React from 'react';
import { useSelector } from 'react-redux';
import { Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { css } from 'emotion';
import { useHistory } from 'react-router-dom';

export default function AddExpenseButton() {
    const { mobile } = useSelector((state: any) => state.screen);
    const history = useHistory();

    const addExpense = css`
        position: fixed;
        right: 10px;
        bottom: ${mobile ? '9vh' : '10px'};
    `;

    return (
        <div className={addExpense}>
            <Fab
                size="medium"
                color="secondary"
                onClick={() => history.push('/users/expenses/add')}
            >
                <AddIcon />
            </Fab>
        </div>
    );
}
