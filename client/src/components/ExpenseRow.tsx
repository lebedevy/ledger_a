import React from 'react';
import { css } from 'emotion';
import EditableCell from './expense_select/EditableCell';
import { IExpense, IExclude } from './typescript/general_interfaces';
import BasicCell from './expense_select/BasicCell';

const expenseEntry = css`
    padding: 0 1px;
    display: flex;
    bottom-border: 1px solid #00000060;
    button {
        borderradius: 0;
        border: 1px solid #00000020;
        minwidth: 0;
    }
`;

export default function ExpenseRow({
    expense,
    exclude,
    editable,
}: {
    expense: IExpense;
    exclude: IExclude;
    editable?: boolean;
}) {
    return editable ? (
        <EditableRow expense={expense} exclude={exclude} />
    ) : (
        <NonEditableRow expense={expense} exclude={exclude} />
    );
}

function EditableRow({ expense, exclude }: { expense: IExpense; exclude: IExclude }) {
    return (
        <tr className={expenseEntry}>
            <EditableCell content={expense.amount} type="amount" id={expense.id} />
            {!exclude?.store && (
                <EditableCell
                    type="store"
                    content={expense?.store?.store_name ?? ''}
                    id={expense.id}
                />
            )}
            {!exclude?.category && (
                <EditableCell
                    content={expense?.category?.category_name ?? ''}
                    type="category"
                    id={expense.id}
                />
            )}
            {!exclude?.date && <EditableCell content={expense.date} type="date" id={expense.id} />}
        </tr>
    );
}

function NonEditableRow({ expense, exclude }: { expense: IExpense; exclude: IExclude }) {
    return (
        <tr className={expenseEntry}>
            <BasicCell content={expense.amount} type="amount" />
            {!exclude?.store && (
                <BasicCell type="store" content={expense?.store?.store_name ?? ''} />
            )}
            {!exclude?.category && (
                <BasicCell content={expense?.category?.category_name ?? ''} type="category" />
            )}
            {!exclude?.date && <BasicCell content={expense.date} type="date" />}
        </tr>
    );
}
