import React, { useEffect, useState } from 'react';
import { isNil } from 'ramda';
import { css } from 'emotion';
import HelpIcon from '@material-ui/icons/Help';
import UploadStep from './UploadStepper.tsx';

const tableCss = css`
    max-width: 1200px;
    width: 100vw;
    margin: 0 auto;
`;

const bodyCss = css`
    max-width: 1200px;
    width: 100vw;
    display: flex;
    flex-direction: column;
    tr {
        flex: 1;
        display: flex;
        td {
            flex: 1;
            border-bottom: 1px solid #00000020;
        }
        th {
            flex: 1;
            border-bottom: 1px solid #00000020;
        }
    }
`;

const borderCss = css`
    border-left: 1px solid #00000030;
`;

const uploadCol = css`
    max-width: 100px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const fadedRow = css`
    background-color: lightgray;
`;

export default function ApproveData({ expensesProp, setStep, step }) {
    const [expenses, setExpenses] = useState([]);
    const [latest, setLatest] = useState(null);
    const [earliest, setEarliest] = useState(null);
    const [upload, setUpload] = useState([]);
    const [currentExpenses, setCurrentExpenses] = useState([]);
    const [reason, setReason] = useState([]);
    const [edit, setEdit] = useState({ ind: null, type: null });
    const [openFR, setOpenFR] = useState(false);
    const [complete, setComplete] = useState(false);
    const [message, setMesage] = useState('');

    useEffect(() => {
        console.log(expensesProp);
        setExpenses(expensesProp ? [...expensesProp] : []);
    }, [expensesProp]);

    const getDateRange = () => {
        let earliest = null,
            latest = null;
        expenses.forEach((exp) => {
            if (exp?.date) {
                if (isNil(latest) || latest < exp.date) latest = exp.date;
                if (isNil(earliest) || earliest > exp.date) earliest = exp.date;
            }
        });
        setLatest(latest);
        setEarliest(earliest);
    };

    const updateUpload = () => {
        const reason = [];
        const upload = expenses.map((exp) => {
            if (exp.amount === 0) {
                reason.push('Expense amount is zero');
                return false;
            }
            const duplicates = currentExpenses.filter(
                (cur) => cur.date === exp.date && cur.amount === exp.amount
            );
            if (0 < duplicates.length) {
                let r = `Possible duplicate of:\n`;
                duplicates.forEach(
                    (dup) =>
                        (r += `${dup.store?.store_name}, ${dup.category?.category_name}, ${dup.amount}, ${dup.date}\n`)
                );
                reason.push(r);
                return false;
            }
            reason.push(null);
            return true;
        });
        setReason(reason);
        setUpload(upload);
    };

    useEffect(() => {
        console.log(expenses);
        getDateRange();
        updateUpload();
    }, [expenses, currentExpenses]);

    const getCurrentExpenseData = async () => {
        const res = await fetch(
            `/api/users/expenses/summary?start=${earliest}&end=${latest}&sort=amount&order=desc`
        );
        if (res.status === 200) {
            const data = await res.json();
            if (data.expenses) {
                console.log(data.expenses);
                setCurrentExpenses(data.expenses);
            }
        }
    };

    useEffect(() => {
        if (!isNil(earliest) && !isNil(latest)) getCurrentExpenseData();
    }, [earliest, latest]);

    const updateUploadAtInd = (ind, val) => {
        console.log(ind, val);
        const updated = [...upload];
        updated[ind] = val;
        setUpload(updated);
    };

    const uploadExpenses = async () => {
        const uploadList = expenses.filter((_exp, ind) => upload[ind]);
        console.log(uploadList);
        const res = await fetch('/api/users/expenses/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                expenses: uploadList,
            }),
        });
        console.log(res);
        setComplete(true);
        const data = await res.json();
        console.log(data);
        setMesage(data.message);
    };

    const updateExpense = (ind, type, e) => {
        const val = e.target.value;
        console.log(ind, type, val);

        const updatedExp = [...expenses];
        updatedExp[ind] = { ...updatedExp[ind], [type]: val };
        setExpenses(updatedExp);
    };

    const updateAll = (original, type, update) => {
        console.log(original, type, update);

        setExpenses(
            expenses.map((exp) => {
                console.log(exp[type], original);
                if (exp[type] === original) {
                    return { ...exp, [type]: update };
                } else {
                    return exp;
                }
            })
        );
        setOpenFR(false);
    };

    const display = ['amount', 'store', 'category', 'date'];

    return !complete ? (
        <UploadStep step={step} setStep={setStep} action={uploadExpenses}>
            {openFR && <FindAndReplace updateExp={updateAll} expenses={expenses} />}
            <div>
                <button onClick={() => setOpenFR(true)}>Find and Replace</button>
            </div>
            <table className={tableCss}>
                <tbody className={bodyCss}>
                    <tr>
                        <th className={uploadCol}>Upload</th>
                        <th className={borderCss}>Amount</th>
                        <th className={borderCss}>Store</th>
                        <th className={borderCss}>Category</th>
                        <th className={borderCss}>Date</th>
                    </tr>
                    {expenses &&
                        upload.length === expenses.length &&
                        expenses.map((el, ind) => (
                            <tr className={!upload[ind] && fadedRow}>
                                <td className={uploadCol}>
                                    <input
                                        title="Test"
                                        type="checkbox"
                                        checked={upload[ind]}
                                        onChange={(e) => updateUploadAtInd(ind, e.target.checked)}
                                    />

                                    {!upload[ind] && (
                                        <div title={reason[ind]}>
                                            <HelpIcon fontSize="small" />
                                        </div>
                                    )}
                                </td>
                                {display.map((type) =>
                                    edit.ind === ind && edit.type === type ? (
                                        <td className={borderCss}>
                                            <input
                                                value={el[type]}
                                                onChange={(e) => updateExpense(ind, type, e)}
                                            />
                                        </td>
                                    ) : (
                                        <td
                                            className={borderCss}
                                            onClick={() => setEdit({ ind, type })}
                                        >
                                            {el[type]}
                                        </td>
                                    )
                                )}
                            </tr>
                        ))}
                </tbody>
            </table>
        </UploadStep>
    ) : (
        <div
            className={css`
                margin: 0 auto;
            `}
        >
            {message}
        </div>
    );
}

function FindAndReplace({ updateExp, expenses }) {
    // Make the replace all option pop up on clicking a cell
    const [original, setOriginal] = useState(null);
    const [update, setUpdate] = useState(null);
    const [type, setType] = useState(0);
    const [unqiue, setUnique] = useState({ amount: [], store: [], category: [], date: [] });

    const types = ['amount', 'store', 'category', 'date'];

    useEffect(() => {
        const am = {},
            st = {},
            ct = {},
            dt = {};
        expenses.forEach((exp) => {
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
        setOriginal(vals.length > 0 ? vals[0] : null);
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
                <select onChange={(e) => setType(e.target.value)}>
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
            </div>
        </div>
    );
}
