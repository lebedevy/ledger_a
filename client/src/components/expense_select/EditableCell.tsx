import React, { useState } from 'react';
import { css } from 'emotion';
import clsx from 'clsx';
import { getCurrencyFormat } from '../../utility/utility';

const inputCell = css`
    border: none;
    background: #e6e8e6;
    width: 100%;
    height: 100%;
    font-size: 1em;
`;
const cellBasic = css`
    min-height: 1em;
    flex: 1 1 0;
    border: 1px solid #00000020;
    min-width: 0;
    word-break: break-all;
    overflow-x: auto;
`;

const baseCss = css`
    padding: 2px 1px;
`;

interface IProps {
    type?: string;
    content: string | number;
}

export default function EditableCell({ content, type }: IProps) {
    const [editing, setEditing] = useState(false);

    return (
        <td onClick={() => setEditing(true)} className={clsx(cellBasic, !editing && baseCss)}>
            {editing ? (
                <input
                    type={type}
                    autoFocus
                    onBlur={() => setEditing(false)}
                    className={inputCell}
                    value={content}
                />
            ) : type === 'currency' ? (
                `$${getCurrencyFormat(content)}`
            ) : (
                content
            )}
        </td>
    );
}
