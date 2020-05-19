import React from 'react';
import clsx from 'clsx';
import { getCurrencyFormat } from '../../utility/utility';
import { cellBaseCss, cellPaddingCss } from './CellClasses';

interface IProps {
    type: string;
    content: string | number;
}

export default function BasicCell({ content, type }: IProps) {
    return (
        <td className={clsx(cellBaseCss, cellPaddingCss)}>
            {type === 'amount' ? `$${getCurrencyFormat(content)}` : content}
        </td>
    );
}
