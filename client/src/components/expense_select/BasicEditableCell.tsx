import React, { useState, useEffect, SyntheticEvent } from 'react';
import clsx from 'clsx';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutlined';
import { cellBaseCss, cellPaddingCss } from './CellClasses';
import { css } from 'emotion';
import { backdropCss } from '../styling/CommonStyles';
import { getCurrencyFormat } from '../../utility/utility';
import { CircularProgress } from '@material-ui/core';
import { CategorySuggestions } from './CategorySuggestions';

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

interface IProps2 {
    setEditing: (val: boolean) => void;
    setShowDropdown: (val: boolean) => void;
    startEdit: () => void;
    submit: (e: SyntheticEvent, val: string | number) => void;
    classes?: Array<string> | null;
    predictions?: Array<number> | null;
    editing: boolean;
    loading: boolean;
    showDropdown: boolean;
    type: string;
    content: string | number;
}

export default function BasicEditableCell({
    submit,
    classes,
    predictions,
    editing,
    loading,
    startEdit,
    type,
    showDropdown,
    setShowDropdown,
    content,
    setEditing,
}: IProps2) {
    const [value, setValue] = useState<number | string>(content);

    useEffect(() => {
        if (!loading && !editing && value !== content) setValue(content);
    }, [editing, loading, content, value]);

    // Set current cell as the cell being edited in redux
    const update = (val: string) => {
        setValue(val);
    };

    const cancel = (e: SyntheticEvent) => {
        // Stop onclick from triggering on parent
        e.stopPropagation();
        setValue(content);
        if (editing) setEditing(false);
    };

    const sendSubmit = (e: SyntheticEvent) => {
        e.stopPropagation();
        submit(e, value);
    };

    const colorCss = (color: string) => {
        return css`
            &:hover {
                color: ${color};
            }
        `;
    };

    return (
        <td onClick={startEdit} className={clsx(cellBaseCss, !editing && cellPaddingCss)}>
            {loading && (
                <div className={backdropCss}>
                    <CircularProgress size={10} />
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
                        onChange={(e) => update(e.target.value)}
                        onBlur={() => setShowDropdown(false)}
                        onFocus={() => setShowDropdown(true)}
                    />
                    <div className={cancelCss}>
                        <CheckCircleOutlinedIcon
                            className={colorCss('#00CC66')}
                            fontSize="small"
                            onClick={sendSubmit}
                        />
                        <CancelIcon
                            className={colorCss('#F71735')}
                            fontSize="small"
                            onClick={cancel}
                        />
                    </div>
                    {showDropdown && type === 'category' && (
                        <CategorySuggestions
                            setCategory={(val) => {
                                update(val);
                                console.log(val);
                            }}
                            classes={classes}
                            predictions={predictions?.slice() ?? null}
                        />
                    )}
                </div>
            ) : type === 'amount' ? (
                `$${getCurrencyFormat(value as number)}`
            ) : (
                value
            )}
        </td>
    );
}
