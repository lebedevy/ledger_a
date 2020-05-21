import React from 'react';
import { EditableRow } from '../ExpenseRow';
import { CircularProgress } from '@material-ui/core';
import { css } from 'emotion';

const containerCss = css`
    display: flex;
    justify-content: center;
`;

export default function Details({ expenses, refetch }) {
    return expenses ? (
        <table style={{ width: '100%' }}>
            {expenses.map((expense) => (
                <EditableRow
                    key={expense.id}
                    expense={expense}
                    exclude={{ date: 1 }}
                    refetch={refetch}
                />
            ))}
        </table>
    ) : (
        <div className={containerCss}>
            <CircularProgress />
        </div>
    );
}
