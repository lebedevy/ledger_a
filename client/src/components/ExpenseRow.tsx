import React, { useMemo } from 'react';
import { css } from 'emotion';
import EditableCell from './expense_select/EditableCell';
import { IExpense, IExclude, RootState, IAggregated } from './typescript/general_interfaces';
import BasicCell from './expense_select/BasicCell';
import { useSelector, useDispatch } from 'react-redux';
import { addDeleteId, removeDeleteId } from '../redux/actions';

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

export function EditableRow({
    expense,
    exclude,
    refetch,
}: {
    expense: IExpense | IAggregated;
    exclude?: IExclude;
    refetch: () => any;
}) {
    const dispatch = useDispatch();
    const { deleting, deleteIds } = useSelector((state: RootState) => state.editing.deletingMode);
    const checked = useMemo(() => deleteIds.includes(expense.id), [deleteIds, expense]);

    const updateDeleteState = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (deleteIds.includes(expense.id)) dispatch(removeDeleteId(expense.id));
        else dispatch(addDeleteId(expense.id));
    };

    return (
        <tr className={expenseEntry}>
            {deleting && <input checked={checked} type="checkbox" onChange={updateDeleteState} />}
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
                    content={(expense as IExpense).date}
                    type="date"
                    id={expense.id}
                    refetch={refetch}
                />
            )}
        </tr>
    );
}

export function NonEditableRow({
    expense,
    exclude,
}: {
    expense: IExpense | IAggregated;
    exclude?: IExclude;
}) {
    return (
        <tr className={expenseEntry}>
            <BasicCell content={expense.amount} type="amount" />
            {!exclude?.store && <BasicCell type="store" content={expense.store ?? ''} />}
            {!exclude?.category && <BasicCell content={expense.category ?? ''} type="category" />}
            {!exclude?.date && <BasicCell content={(expense as IExpense).date} type="date" />}
        </tr>
    );
}
