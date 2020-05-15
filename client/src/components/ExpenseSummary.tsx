import React, { useState } from 'react';
import { getCurrencyFormat } from '../utility/utility';
import { css } from 'emotion';

const expenseEntry = css`
    padding: 0 1px;
    display: flex;
    bottom-border: 1px solid #00000060;
    td {
        min-height: 1em;
        padding: 2px 0;
        flex: 1 1 0;
        border: 1px solid #00000020;
        min-width: 0;
        word-break: break-all;
        overflow-x: auto;
    }
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

function ExpenseSummary({ el, expand, exclude }: { expand: any; el: IExpense; exclude: IExclude }) {
    return (
        <tr className={expenseEntry} /*onClick={expand}*/>
            <EditableCel content={`$${getCurrencyFormat(el.amount)}`} />
            {!exclude?.store && <EditableCel content={el?.store?.store_name ?? ''} />}
            {!exclude?.category && <EditableCel content={el?.category?.category_name ?? ''} />}
            {!exclude?.date && <EditableCel content={el.date} />}
        </tr>
    );
}

export default ExpenseSummary;

function EditableCel({ content }: { content: string | number }) {
    const [editing, setEditing] = useState(false);
    return (
        <td onClick={() => setEditing(true)}>{editing ? <input value={content} /> : content}</td>
    );
}
