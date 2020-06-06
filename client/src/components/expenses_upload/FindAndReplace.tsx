import React, { useState, useEffect } from 'react';
import { IExpense } from '../typescript/general_interfaces';
import { css } from 'emotion';

interface IMap {
    [key: string]: any;
    [key: number]: any;
}

interface IUnique {
    [amount: string]: Array<string>;
    store: Array<string>;
    category: Array<string>;
    date: Array<string>;
}

interface IProps {
    close: () => void;
    expenses: Array<IExpense>;
    updateExp: (o: string, t: string, u: string) => void;
}

export default function FindAndReplace({ updateExp, expenses, close }: IProps) {
    // Make the replace all option pop up on clicking a cell
    const [original, setOriginal] = useState('');
    const [update, setUpdate] = useState('');
    const [type, setType] = useState(1);
    const [unqiue, setUnique] = useState<IUnique>({
        amount: [],
        store: [],
        category: [],
        date: [],
    });

    const types = ['amount', 'store', 'category', 'date'];

    useEffect(() => {
        const am: IMap = {},
            st: IMap = {},
            ct: IMap = {},
            dt: IMap = {};
        expenses.forEach((exp: IExpense) => {
            const { amount, store, category, date } = exp;
            am[amount] = 1;
            st[store] = 1;
            ct[category] = 1;
            dt[date] = 1;
        });
        setUnique({
            amount: Object.keys(am),
            store: Object.keys(st),
            category: Object.keys(ct),
            date: Object.keys(dt),
        });
    }, [expenses]);

    useEffect(() => {
        const vals = unqiue[types[type]];
        setOriginal(vals.length > 0 ? vals[0] : '');
    }, [type]);

    return (
        <div
            className={css`
                display: flex;
                justify-content: center;
                align-items: center;
                position: fixed;
                top: 0;
                bottom: 0;
                right: 0;
                left: 0;
                background: #00000030;
                z-index: 10000;
            `}
        >
            <div
                className={css`
                    display: flex;
                    flex-direction: column;
                    min-height: 150px;
                    width: 400px;
                    background: #ffffff;
                    align-items: center;
                `}
            >
                <h2>Find and Replace in Column</h2>
                <label>Column</label>
                <select value={type} onChange={(e) => setType(parseInt(e.target.value))}>
                    {types.map((t, ind) => (
                        <option value={ind}>{t}</option>
                    ))}
                </select>
                <label>Find</label>
                <select
                    value={original}
                    onChange={(e) => {
                        console.log(e.target.value);
                        setOriginal(e.target.value);
                    }}
                >
                    {unqiue[types[type]].map((val) => (
                        <option value={val}>{val}</option>
                    ))}
                </select>
                <label>Replace</label>
                <input
                    value={update}
                    placeholder={'New value'}
                    onChange={(e) => setUpdate(e.target.value)}
                />
                <button onClick={() => updateExp(original, types[type], update)}>Update</button>
                <button onClick={close}>Cancel</button>
            </div>
        </div>
    );
}
