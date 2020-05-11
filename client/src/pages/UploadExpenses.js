import React, { useState } from 'react';
import { css } from 'emotion';
import ColumnSelect from '../components/expenses_upload/ColumnSelect';
import ApproveData from '../components/expenses_upload/ApproveData';
import UploadStep from '../components/expenses_upload/UploadStepper.tsx';

const uploadCss = css`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

export default function UploadExpenses() {
    const [data, setData] = useState(null);
    const [expenses, setExpenses] = useState(null);
    const [step, setStep] = useState(0);
    const [types, setTypes] = useState({});

    async function handleUpload(event) {
        // Get FileList object from the input element
        const { files } = event.target;
        const rows = await getContent(files);
        const data = [];

        for (let row in rows) {
            if (rows[row] !== '') {
                const expense = rows[row].split(',');
                data.push(expense);
            }
        }
        setStep(step + 1);
        setData(data);
    }

    async function getContent(files) {
        // .item(index) gets the file stored at given index in the FileList obj
        // Get file contents and parse csv by splitting on newline and then on commas
        // https://developer.mozilla.org/en-US/docs/Web/API/File
        const file = files.item(0);
        const contents = await file.text();
        return contents.split('\n');
    }

    function updateExpenses(expenses) {
        setExpenses(expenses);
        setStep(2);
    }

    return (
        <div className={uploadCss}>
            {step === 0 && (
                <UploadStep step={step} setStep={setStep}>
                    <input type="file" onChange={handleUpload} accept={'.csv'} />
                </UploadStep>
            )}
            {step === 1 && (
                <ColumnSelect
                    setExpenses={updateExpenses}
                    data={data}
                    setTypes={setTypes}
                    types={types}
                    step={step}
                    setStep={setStep}
                />
            )}
            {step === 2 && <ApproveData expensesProp={expenses} step={step} setStep={setStep} />}
        </div>
    );
}
