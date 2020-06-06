import React from 'react';
import { css } from 'emotion';
import { IChildren } from '../typescript/general_interfaces';

const commonCss = css`
    display: flex;
`;

export const flexColumnCss = css`
    ${commonCss}
    flex-direction: column;
    overflow: auto;
`;

export function ColumnFlex({ children }: IChildren) {
    return <div className={flexColumnCss}>{children}</div>;
}

export function RowFlex({ children }: IChildren) {
    return <div className={commonCss}>{children}</div>;
}
