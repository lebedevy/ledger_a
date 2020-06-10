import React, { useState, useEffect, ChangeEvent } from 'react';
import { isNil } from 'ramda';
import { css } from 'emotion';
import { getFormatedDate } from '../../utility/utility';
import UploadStep from './UploadStepper';
import { NestedLoading } from '../common_components/CommonComponents';
import { useUploadStep } from '../common_hooks/uploadStepHook';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, ITypes } from '../typescript/general_interfaces';
import {
    setUploadPredictions,
    setUploadCleanedExpenses,
    setUploadTypes,
} from '../../redux/actions';

const rowStyle = css`
    border: 1px solid black;
    display: flex;
`;

const cellStyle = css`
    flex: 1;
    border-right: 1px solid black;
`;

interface IUploadExpense {}

interface IUploadExpenseList {
    [id: number]: IUploadExpense;
}

export default function ColumnSelect() {
    const dispatch = useDispatch();
    const setStep = useUploadStep()[1];
    const { baseExpenses: data, types } = useSelector((state: RootState) => state.uploadExpenses);
    const [loading, setLoading] = useState(false);

    const processData = async () => {
        setLoading(true);

        let store_names = {} as any;

        if (!isNil(types[2])) {
            const res = await fetch(`/api/users/expenses/upload_store_names`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ expenses: data, index: types[2] }),
            });
            if (res.ok) store_names = (await res.json()).store_names;
        }

        const expenses = {} as IUploadExpenseList;
        for (const id in data) {
            const row = data[id];
            expenses[id] = {
                id: id,
                category: isNil(row[types[3]]) ? null : capitalize(row[types[3]].toLowerCase()),
                store: store_names[id]
                    ? store_names[id]['name']
                    : isNil(row[types[2]])
                    ? null
                    : capitalize(row[types[2]].toLowerCase()),
                amount:
                    isNil(row[types[1]]) || row[types[1]] === '' ? 0 : parseFloat(row[types[1]]),
                date: isNil(row[types[4]]) ? null : getFormatedDate(new Date(row[types[4]])),
            };
        }
        console.log(expenses);
        // Category has id 3; if no col is set for 3, no category columns included
        // In that case get predictions
        console.log(types[3]);
        if (isNil(types[3])) {
            const res = await fetch(`/api/users/expenses/category_suggestions/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ expenses: Object.values(expenses) }),
            });
            dispatch(setUploadPredictions(await res.json()));
        }
        // Stores have id 2; if stores are set, check if the store names need to be converted
        dispatch(setUploadCleanedExpenses(expenses));
        setLoading(false);
        setStep(2);
    };

    const capitalize = (item: string) => {
        return item.replace(/(?:^|\s|-)\S/g, (a) => a.toUpperCase());
    };

    return (
        <UploadStep action={processData}>
            <NestedLoading loading={loading} />
            <div style={{ overflow: 'auto' }}>
                <div className={rowStyle}>
                    {data &&
                        Object.values(data)[0] &&
                        Object.values(data)[0].map((_row: string, ind: number) => (
                            <ColumnTypeSelect index={ind} />
                        ))}
                </div>
                {data &&
                    Object.values(data)?.map((row) => (
                        <div className={rowStyle}>
                            {row.map((cell: string) => (
                                <div className={cellStyle}>{cell}</div>
                            ))}
                        </div>
                    ))}
            </div>
        </UploadStep>
    );
}

interface IPropsColT {
    index: number;
}

function ColumnTypeSelect({ index }: IPropsColT) {
    const dispatch = useDispatch();
    const { types } = useSelector((state: RootState) => state.uploadExpenses);
    const [value, setValue] = useState(0);

    useEffect(() => {
        // If current column has a type set already, find it and update state
        const res = Object.entries(types).find(([key, value]) => value === index);
        if (!isNil(res)) setValue(parseInt(res[0]));
        else setValue(0);
    }, [types]);

    const updateTypes = (e: ChangeEvent<HTMLSelectElement>) => {
        // Filter out all entries that reference the current column
        const update = {} as ITypes;
        const res = Object.entries(types).filter(([key, value]) => value !== index);
        res.forEach(([key, val]) => (update[parseInt(key)] = val));
        dispatch(setUploadTypes({ ...update, [e.target.value]: index }));
    };

    return (
        <select value={value} className={cellStyle} onChange={updateTypes}>
            <option value={0}></option>
            <option value={1}>Amount</option>
            <option value={2}>Store</option>
            <option value={3}>Category</option>
            <option value={4}>Date</option>
        </select>
    );
}
