import React from 'react';
import { css } from 'emotion';
import { IChildren } from '../typescript/general_interfaces';
import { CircularProgress } from '@material-ui/core';

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

const loadingCss = css`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: #00000099;
    z-index: 10000;
`;

export function NestedLoading({ loading }: { loading: boolean }) {
    return loading ? (
        <div className={loadingCss}>
            <CircularProgress />
        </div>
    ) : null;
}
