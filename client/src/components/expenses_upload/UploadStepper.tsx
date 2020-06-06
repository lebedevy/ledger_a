import React, { useState } from 'react';
import { Stepper, Step, StepLabel } from '@material-ui/core';
import { css } from 'emotion';
import { bigButtonCss } from '../styling/CommonStyles';

const flexCss = css`
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: auto;
`;

const buttonBarCss = css`
    height: 50px;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    align-items: center;
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
            <div className={buttonBarCss}>
                {step > 0 && (
                    <button
                        className={bigButtonCss({ main: '688EFF', secondary: '6186F4' })}
                        onClick={() => setStep(step - 1)}
                    >
                        Back
                    </button>
                )}
                {step > 0 && (
                    <button
                        className={bigButtonCss({ main: '37509b', secondary: '4460b7' })}
                        onClick={action}
                    >
                        {step < 2 ? 'Next' : 'Upload'}
                    </button>
                )}
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
