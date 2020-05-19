import React from 'react';
import { tableContainer } from './ExpenseTableClasses';

export default function TableWrapper({ children }: { children: any }) {
    return (
        <div className={tableContainer}>
            <table style={{ width: '100%' }}>{children}</table>
        </div>
    );
}
