import React from 'react';
import { useSelector } from 'react-redux';
import { getCurrencyFormat } from '../utility/utility';
import AddExpenseButton from './AddExpenseButton';
import clsx from 'clsx';
import { css } from 'emotion';

const datesCss = css`
    display: block;
    padding: 10px 0;
    fontsize: 0.9em;
    fontstyle: italic;
`;

const summaryCss = css`
    padding: 10px;
    height: 70px;
    background: #ebf2fa;
    border-top: 1px solid #00000050;
`;

const desktopCss = css`
    border: 1px solid #00000020;
`;

const totalCss = css`
    font-weight: bold;
`;

interface IProps {
    total: number;
}

export default function Summary({ total }: IProps) {
    const { start, end, mobile, width } = useSelector((state: any) => {
        const {
            screen: { mobile, width },
            date: {
                period: { start, end },
            },
        } = state;
        return { start, end, mobile, width };
    });

    return (
        <div className={clsx(summaryCss, width >= 1200 && desktopCss)}>
            <label>Total: </label>
            <label className={totalCss}>${getCurrencyFormat(total)}</label>
            <br />
            <label className={datesCss}>{`${start} to ${end}`}</label>
            <AddExpenseButton />
        </div>
    );
}
