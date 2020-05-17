import React, { useState, useEffect, SyntheticEvent, useMemo } from 'react';
import { css } from 'emotion';
import clsx from 'clsx';
import { getCurrencyFormat } from '../../utility/utility';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutlined';
import { cellBaseCss, cellPaddingCss } from './CellClasses';
import { useDispatch, useSelector } from 'react-redux';
import { setEditingExpense } from '../../redux/actions';
import { RootState } from '../typescript/general_interfaces';
import { CircularProgress } from '@material-ui/core';

const inputCell = css`
    border: none;
    background: #e6e8e6;
    width: 100%;
    height: 100%;
    font-size: 1em;
`;

const cancelCss = css`
    position: absolute;
    right: 5px;
    display: inline-block;
    overflow: hidden;
    max-height: 100%;
`;

interface IProps {
    type: string;
    content: string | number;
    id?: number;
}

export default function EditableCell({ content, type, id }: IProps) {
    const dispatch = useDispatch();
    const { cellEdit } = useSelector((state: RootState) => state);
    const [value, setValue] = useState<number | string>('');
    const [loading, setLoading] = useState(false);

    const cellId = useMemo(() => `${id}${type}`, [id, type]);
    const editing = useMemo(() => cellEdit === cellId, [cellId, cellEdit]);

    useEffect(() => {
        setValue(content);
    }, []);

    useEffect(() => {
        if (!loading && !editing && value !== content) setValue(content);
    }, [editing, loading, content, value]);

    // Set current cell as the cell being edited in redux
    const update = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const setEditing = (start: boolean) => {
        dispatch(setEditingExpense(start ? cellId : null));
    };

    const cancel = (e: SyntheticEvent) => {
        // Stop onclick from triggering on parent
        e.stopPropagation();
        setValue(content);
        if (editing) setEditing(false);
    };

    const submit = async (e: SyntheticEvent) => {
        // Stop onclick from triggering on parent
        e.stopPropagation();

        setLoading(true);
        const res = await fetch(`/api/users/expenses/edit/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ expense: { [type]: value } }),
        });

        setLoading(false);
        if (res.status === 200 && editing) {
            console.log('Update success');
            setEditing(false);
        }
    };

    const colorCss = (color: string) => {
        return css`
            &:hover {
                color: ${color};
            }
        `;
    };

    return (
        <td
            onClick={() => setEditing(true)}
            className={clsx(cellBaseCss, !editing && cellPaddingCss)}
        >
            {loading && (
                <div>
                    <CircularProgress />
                </div>
            )}
            {editing ? (
                <div
                    className={css`
                        position: relative;
                    `}
                >
                    <input
                        type={type}
                        autoFocus
                        className={inputCell}
                        value={value}
                        onChange={update}
                    />
                    <div className={cancelCss}>
                        <CheckCircleOutlinedIcon
                            className={colorCss('#00CC66')}
                            fontSize="small"
                            onClick={submit}
                        />
                        <CancelIcon
                            className={colorCss('#F71735')}
                            fontSize="small"
                            onClick={cancel}
                        />
                    </div>
                </div>
            ) : type === 'amount' ? (
                `$${getCurrencyFormat(value)}`
            ) : (
                value
            )}
        </td>
    );
}
