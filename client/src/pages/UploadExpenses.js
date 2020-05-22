import React, { useState } from 'react';
import { css } from 'emotion';
import ColumnSelect from '../components/expenses_upload/ColumnSelect';
import ApproveData from '../components/expenses_upload/ApproveData';
import UploadStep from '../components/expenses_upload/UploadStepper.tsx';

const uploadCss = css`
    width: 100%;
    max-width: 1200px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0 auto;
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

    const uploadWrapper = css`
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    const uploadInputCss = css`
        border: 1px solid black;
        width: 90%;
        max-width: 800px;
        height: 120px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.7em;
        font-weight: 600;
        border-radius: 5px;
        &:hover {
            box-shadow: 0 0 0 2pt lightblue;
        }
    `;

    return (
        <div className={uploadCss}>
            {step === 0 && (
                <UploadStep step={step} setStep={setStep}>
                    <div className={uploadWrapper}>
                        <label className={uploadInputCss} for="fileUpload">
                            Upload File
                        </label>
                        <input
                            className={css`
                                display: none;
                            `}
                            id="fileUpload"
                            type="file"
                            onChange={handleUpload}
                            accept={'.csv'}
                        />
                    </div>
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
