import React, { useState } from 'react';
import { Stepper, Step, StepLabel } from '@material-ui/core';
import { css } from 'emotion';

const flexCss = css`
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: auto;
`;

interface IProps {
    step: number;
    setStep: any;
    action: any;
    children: JSX.Element;
}

export default function UploadStep({ step, setStep, action, children }: IProps) {
    const steps = ['Upload CSV', 'Select Columns', 'Verify Data'];
    return (
        <div className={flexCss}>
            <div className={flexCss}>{children}</div>
            <div>
                {step > 0 && <button onClick={() => setStep(step - 1)}>Back</button>}
                {step > 0 && <button onClick={action}>{step < 2 ? 'Next' : 'Upload'}</button>}
            </div>
            <Stepper activeStep={step} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
        </div>
    );
}
