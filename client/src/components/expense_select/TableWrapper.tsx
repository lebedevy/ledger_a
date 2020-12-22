import React from 'react';
import { css } from 'emotion';

export const tableContainer = css`
    overflow-y: auto;
    overflow-x: hidden;
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #ffffff;
    border-radius: 5px;
`;

export default function TableWrapper({ children }: { children: any }) {
    return (
        <div className={tableContainer}>
            <table style={{ width: '100%' }}>{children}</table>
        </div>
    );
}
