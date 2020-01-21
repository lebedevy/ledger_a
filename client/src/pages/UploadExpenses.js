import React, { useState } from 'react';
import { Stepper, Step, StepLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import ColumnSelect from '../components/expenses_upload/ColumnSelect';

const useStyles = makeStyles({
    container: {},
});

function getSteps() {
    return ['Upload CSV', 'Select Columns', 'Verify Data'];
}

export default function UploadExpenses() {
    const classes = useStyles();
    const steps = getSteps();
    const [expenses, setExpenses] = useState(null);
    const [step, setStep] = useState(0);

    async function handleUpload(event) {
        // Get FileList object from the input element
        const { files } = event.target;
        const rows = await getContent(files);
        const expenses = [];

        for (let row in rows) {
            const expense = rows[row].split(',');
            expenses.push(expense);
        }
        setStep(step + 1);
        setExpenses(expenses);
    }

    async function getContent(files) {
        // .item(index) gets the file stored at given index in the FileList obj
        // Get file contents and parse csv by splitting on newline and then on commas
        // https://developer.mozilla.org/en-US/docs/Web/API/File
        const file = files.item(0);
        const contents = await file.text();
        return contents.split('\n');
    }

    return (
        <div>
            <button disabled={step === 0} onClick={() => setStep(step - 1)}>
                Back
            </button>
            <Stepper activeStep={step} alternativeLabel>
                {steps.map(label => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            {step === 0 && <input type="file" onChange={handleUpload} accept={'.csv'} />}
            {step === 1 && <ColumnSelect expenses={expenses} />}
        </div>
    );
}
