import React, { useState } from 'react';
import { css } from 'emotion';
import ColumnSelect from '../components/expenses_upload/ColumnSelect';
import ApproveData from '../components/expenses_upload/ApproveData';
import UploadStep from '../components/expenses_upload/UploadStepper.tsx';
import { useUploadStep } from '../components/common_hooks/uploadStepHook';
import UploadCsvExpense from './UploadCsvExpense';
import { flexJustifyCenterCss } from '../components/styling/CommonStyles';

const uploadCss = css`
    ${flexJustifyCenterCss}
    width: 100%;
    max-width: 1200px;
    height: 100%;
    flex-direction: column;
    margin: 0 auto;
`;

export default function UploadExpenses() {
    const [step] = useUploadStep();

    return (
        <div className={uploadCss}>
            {step === 0 && <UploadCsvExpense />}
            {step === 1 && <ColumnSelect />}
            {step === 2 && <ApproveData />}
        </div>
    );
}
