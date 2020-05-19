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
    refetch,
}: {
    expense: IExpense;
    exclude?: IExclude;
    editable?: boolean;
    refetch: () => any;
}) {
    return editable ? (
        <EditableRow expense={expense} exclude={exclude} refetch={refetch} />
    ) : (
        <NonEditableRow expense={expense} exclude={exclude} />
    );
}

function EditableRow({
    expense,
    exclude,
    refetch,
}: {
    expense: IExpense;
    exclude?: IExclude;
    refetch: () => any;
}) {
    return (
        <tr className={expenseEntry}>
            <EditableCell
                content={expense.amount}
                type="amount"
                id={expense.id}
                refetch={refetch}
            />
            {!exclude?.store && (
                <EditableCell
                    type="store"
                    content={expense.store ?? ''}
                    id={expense.id}
                    refetch={refetch}
                />
            )}
            {!exclude?.category && (
                <EditableCell
                    content={expense.category ?? ''}
                    type="category"
                    id={expense.id}
                    refetch={refetch}
                />
            )}
            {!exclude?.date && (
                <EditableCell
                    content={expense.date}
                    type="date"
                    id={expense.id}
                    refetch={refetch}
                />
            )}
        </tr>
    );
}

function NonEditableRow({ expense, exclude }: { expense: IExpense; exclude?: IExclude }) {
    return (
        <tr className={expenseEntry}>
            <BasicCell content={expense.amount} type="amount" />
            {!exclude?.store && <BasicCell type="store" content={expense.store ?? ''} />}
            {!exclude?.category && <BasicCell content={expense.category ?? ''} type="category" />}
            {!exclude?.date && <BasicCell content={expense.date} type="date" />}
        </tr>
    );
}
