import React, { useState } from 'react';
import { Stepper, Step, StepLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';

const useStyles = makeStyles({
    container: {},
    table: {
        maxWidth: '1200px',
        width: '100vw',
        margin: '0 auto',
    },
    body: {
        maxWidth: '1200px',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        '& tr': {
            flex: 1,
            display: 'flex',
            '& td': {
                flex: 1,
                // border: '1px solid #00000020',
            },
        },
    },
    td: {
        border: '1px solid #00000020',
    },
    amountCol: {
        background: '#2E9B56',
    },
    dateCol: {
        background: '#E9724C',
    },
    storeCol: {
        background: '#255F85',
    },
    categoryCol: {
        background: '#FFC857',
    },
    unselectedCol: {
        background: '#C5283D',
    },
    colBorder: {
        borderLeft: '2px solid #000000',
    },
    colHover: {
        background: 'white',
    },
    colButton: {
        height: '2em',
        width: '100px',
    },
});

// amount, store, category, date, unselected
const backgrounds = ['2E9B56', '255F85', 'FFC857', 'E9724C', 'F25F5C'];
const buttons = ['Amount', 'Store', 'Category', 'Date', 'Unselect'];

function getColumns() {
    return [
        { name: 'amount', hover: 'amountCol' },
        { name: 'store', hover: 'storeCol' },
        { name: 'category', hover: 'categoryCol' },
        { name: 'date', hover: 'dateCol' },
    ];
}

export default function ColumnSelect({ expenses }) {
    const classes = useStyles();
    const columns = getColumns();
    const [hover, setHover] = useState(null);
    const [select, setSelect] = useState(0);
    const [col, setCol] = useState({});
    const [amount, setAmount] = useState({ name: 'amount', hover: 'amountCol' });
    const [store, setStore] = useState({ name: 'store', hover: 'storeCol' });
    const [category, setCategory] = useState({ name: 'category', hover: 'categoryCol' });
    const [date, setDate] = useState({ name: 'date', hover: 'dateCol' });

    function setColumnType(ind, select) {
        const temp = {};
        for (let c in col) {
            if (col[c] !== select && c != ind) temp[c] = col[c];
        }
        console.log(temp);
        if (select < 4) temp[ind] = select;
        console.log(temp);
        setCol(temp);
    }

    console.log(col);
    return (
        <div>
            <p>Set the upload columns</p>
            <p className={classes.unselectedCol}>Columns in this color will be deleted</p>
            <SetColumns select={select} setSelect={setSelect} />
            <table className={classes.table} onMouseLeave={() => setHover(null)}>
                <tbody className={classes.body}>
                    {expenses &&
                        expenses.map((row, i) => (
                            <tr>
                                {row.map((item, ind) => {
                                    let bk = backgrounds[4];
                                    if (col[ind] != null) bk = backgrounds[col[ind]] + '99';
                                    if (ind === hover) bk = backgrounds[select];
                                    // if (i === 0) console.log(bk);
                                    return (
                                        <td
                                            onClick={() => setColumnType(ind, select)}
                                            onMouseEnter={() => {
                                                if (ind !== hover) setHover(ind);
                                            }}
                                            // onMouseLeave={() => setHover(null)}
                                            className={clsx(
                                                ind > 0 && classes.colBorder,
                                                classes.td
                                            )}
                                            style={{ background: `#${bk}` }}
                                        >
                                            {item}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}

function SetColumns({ select, setSelect }) {
    const classes = useStyles();
    return (
        <div>
            {buttons.map((label, ind) => (
                <button
                    className={classes.colButton}
                    style={{ background: `#${backgrounds[ind]}99` }}
                    onClick={() => setSelect(ind)}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}

function ColumnTypes() {
    return (
        <select>
            <option>Amount</option>
            <option>Store</option>
            <option>Category</option>
            <option>Date</option>
        </select>
    );
}
