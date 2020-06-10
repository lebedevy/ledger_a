import React from 'react';
import { Stepper, Step, StepLabel } from '@material-ui/core';
import { css } from 'emotion';
import { bigButtonCss } from '../styling/CommonStyles';
import { useUploadStep } from '../common_hooks/uploadStepHook';

const flexCss = css`
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: auto;
    position: relative;
`;

const buttonBarCss = css`
    height: 50px;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    align-items: center;
`;

interface IProps {
    action?: any;
    children: JSX.Element | Array<JSX.Element>;
}

export default function UploadStep({ action, children }: IProps) {
    const [step, setStep] = useUploadStep();

    const steps = ['Upload CSV', 'Select Columns', 'Verify Data'];
    return (
        <div className={flexCss}>
            <div className={flexCss}>{children}</div>
            <div className={buttonBarCss}>
                {step > 0 && (
                    <>
                        <button
                            className={bigButtonCss({ main: '688EFF', secondary: '6186F4' })}
                            onClick={() => setStep(step - 1)}
                        >
                            Back
                        </button>
                        <button
                            className={bigButtonCss({ main: '37509b', secondary: '4460b7' })}
                            onClick={action}
                        >
                            {step < 2 ? 'Next' : 'Upload'}
                        </button>
                    </>
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
