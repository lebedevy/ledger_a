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

interface IProps {
    setEditing: (val: boolean) => void;
    startEdit: () => void;
    submit: (val: string | number) => void;
    classes?: Array<string> | null;
    predictions?: Array<number> | null;
    editing: boolean;
    loading: boolean;
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
    content,
    setEditing,
}: IProps) {
    const [value, setValue] = useState<number | string>(content);
    const [showDropdown, setShowDropdown] = useState(false);

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
        setShowDropdown(false);
        setValue(content);
        if (editing) setEditing(false);
    };

    const sendSubmit = (e: SyntheticEvent) => {
        e.stopPropagation();
        setShowDropdown(false);
        submit(value);
    };

    const selectDropdown = (val: string) => {
        setShowDropdown(false);
        submit(val);
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
                    {showDropdown && predictions && classes && type === 'category' && (
                        <CategorySuggestions
                            setCategory={selectDropdown}
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
