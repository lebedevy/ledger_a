import React, { useEffect, useState } from 'react';
import { isNil } from 'ramda';
import { css } from 'emotion';
import HelpIcon from '@material-ui/icons/Help';
import UploadStep from './UploadStepper.tsx';
import FindReplaceIcon from '@material-ui/icons/FindReplace';
import { getOptions, getCurrencyFormat } from '../../utility/utility';
import { IconButton } from '@material-ui/core';
import { RowFlex, flexColumnCss } from '../common_components/CommonComponents';
import clsx from 'clsx';
import BasicEditableCell from '../expense_select/BasicEditableCell';
import FindAndReplace from './FindAndReplace';
import { useSelector } from 'react-redux';

const tableCss = css`
    max-width: 1200px;
    width: 100vw;
    margin: 0 auto;
    ${flexColumnCss}
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
    position: relative;
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

export default function ApproveData() {
    const { baseExpenses, expenses: expensesProp, predictions, types } = useSelector(
        (state) => state.uploadExpenses
    );
    const [expenses, setExpenses] = useState([]);
    const [latest, setLatest] = useState(null);
    const [earliest, setEarliest] = useState(null);
    const [currentExpenses, setCurrentExpenses] = useState([]);
    const [edit, setEdit] = useState({ ind: null, type: null });
    const [openFR, setOpenFR] = useState(false);
    const [complete, setComplete] = useState(false);
    const [message, setMesage] = useState('');
    // Whether or not an expense gets uloaded, and the reason
    const [upload, setUpload] = useState([]);
    const [reason, setReason] = useState([]);

    const addPredictions = () => {
        // For now I will duplicate the category list suggestion for every expense
        // In the future I should have one master list with ids and attach a list
        // of suggestion ids ordered by likelyhood to reduce data duplication
        console.log(predictions);
        console.log(expensesProp);

        const predictionMap = {};

        predictions.predictions.forEach((p) => (predictionMap[p.expense_id] = p.predictions));

        return Object.values(expensesProp).map((exp) => {
            const options = getOptions(predictionMap[exp.id], predictions.classList);

            return {
                ...exp,
                category: options[0]?.[1] ?? '',
                predictions: predictionMap[exp.id],
            };
        });
    };

    useEffect(() => {
        console.log(expensesProp, predictions);
        if (predictions && expensesProp) setExpenses(addPredictions());
        else setExpenses(expensesProp ? [...Object.values(expensesProp)] : []);
    }, [expensesProp, predictions]);

    const getDateRange = () => {
        let earliest = null,
            latest = null;
        Object.values(expensesProp).forEach((exp) => {
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
                        (r += `${dup.store ?? ''}, ${dup.category ?? ''}, ${getCurrencyFormat(
                            dup.amount
                        )}, ${dup.date}\n`)
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
        getDateRange();
    }, [expensesProp]);

    useEffect(() => {
        updateUpload();
    }, [currentExpenses]);

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

    const resetEditing = () => {
        setEdit({ ind: null, type: null });
    };

    const updateExpense = (ind, type, val) => {
        if (type === 'store') {
            addStoreNameMapping(baseExpenses[expenses[ind].id][types[2]], val);
        }
        const updatedExp = [...expenses];
        updatedExp[ind] = { ...updatedExp[ind], [type]: val };
        setExpenses(updatedExp);
        resetEditing();
    };

    const updateAll = (original, type, update) => {
        const updated = new Set();

        setExpenses(
            expenses.map((exp) => {
                if (exp[type] === original) {
                    // Add store name mapping
                    const originalName = baseExpenses[exp.id][types[2]];
                    if (type === 'store' && !updated.has(originalName))
                        addStoreNameMapping(originalName, update);
                    updated.add(originalName);

                    return { ...exp, [type]: update };
                } else {
                    return exp;
                }
            })
        );
        setOpenFR(false);
    };

    function addStoreNameMapping(original, val) {
        fetch(`/api/users/expenses/upload_store_names/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ original, val }),
        });
    }

    const display = ['amount', 'store', 'category', 'date'];

    return !complete ? (
        <UploadStep action={uploadExpenses}>
            {openFR && (
                <FindAndReplace
                    close={() => setOpenFR(false)}
                    updateExp={updateAll}
                    expenses={expenses}
                />
            )}
            <RowFlex>
                <IconButton onClick={() => setOpenFR(true)}>
                    <FindReplaceIcon />
                </IconButton>
            </RowFlex>

            <table className={tableCss}>
                <thead className={bodyCss}>
                    <tr>
                        <th className={uploadCol}>Upload</th>
                        <th className={borderCss}>Amount</th>
                        <th className={borderCss}>Store</th>
                        <th className={borderCss}>Category</th>
                        <th className={borderCss}>Date</th>
                    </tr>
                </thead>
                <tbody className={clsx(bodyCss, flexColumnCss)}>
                    {expenses &&
                        upload.length === expenses.length &&
                        expenses.map((el, ind) => (
                            <tr className={!upload[ind] && fadedRow}>
                                <td className={uploadCol}>
                                    <input
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
                                {display.map((type) => (
                                    <BasicEditableCell
                                        type={type}
                                        content={el[type]}
                                        editing={edit.ind === ind && edit.type === type}
                                        startEdit={() => setEdit({ ind, type })}
                                        classes={predictions?.classList}
                                        predictions={el?.predictions}
                                        setEditing={resetEditing}
                                        submit={(val) => updateExpense(ind, type, val)}
                                    />
                                ))}
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
