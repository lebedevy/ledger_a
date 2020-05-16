import React from 'react';
import { css } from 'emotion';
import EditableCell from './expense_select/EditableCell';

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

interface IExpense {
    store: any;
    category: any;
    amount: number;
    date: string;
}

interface IExclude {
    store?: string;
    category?: string;
    date?: string;
}

export default function ExpenseRow({ el, exclude }: { el: IExpense; exclude: IExclude }) {
    return (
        <tr className={expenseEntry}>
            <EditableCell content={el.amount} type="currency" />
            {!exclude?.store && <EditableCell content={el?.store?.store_name ?? ''} />}
            {!exclude?.category && <EditableCell content={el?.category?.category_name ?? ''} />}
            {!exclude?.date && <EditableCell content={el.date} type="date" />}
        </tr>
    );
}
