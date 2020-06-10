import React, { ChangeEvent } from 'react';
import UploadStep from '../components/expenses_upload/UploadStepper';
import { css } from 'emotion';
import { useUploadStep } from '../components/common_hooks/uploadStepHook';
import { flexCenterCss } from '../components/styling/CommonStyles';
import { setOrignalExpenseUpload } from '../redux/actions';
import { useDispatch } from 'react-redux';
import { originalExpenses } from '../components/typescript/general_interfaces';

const uploadWrapper = css`
    flex: 1;
    ${flexCenterCss}
`;

const uploadInputCss = css`
    ${flexCenterCss}
    border: 1px solid black;
    width: 90%;
    max-width: 800px;
    height: 120px;
    font-size: 1.7em;
    font-weight: 600;
    border-radius: 5px;
    &:hover {
        box-shadow: 0 0 0 2pt lightblue;
    }
`;

const inputCss = css`
    display: none;
`;

export default function UploadCsvExpense() {
    const dispatch = useDispatch();
    const [step, setStep] = useUploadStep();

    async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
        // Get FileList object from the input element
        const { files } = event.target;
        if (files) {
            const rows = await getContent(files);
            const data = {} as originalExpenses;

            for (let row = 0; row < rows.length; row++) {
                if (rows[row] !== '') {
                    const expense = rows[row].split(',');
                    data[row] = expense;
                }
            }

            setStep(step + 1);
            dispatch(setOrignalExpenseUpload(data));
        } else {
            throw new Error('Error uploading file');
        }
    }

    const getContent = async (files: FileList) => {
        // .item(index) gets the file stored at given index in the FileList obj
        // Get file contents and parse csv by splitting on newline and then on commas
        // https://developer.mozilla.org/en-US/docs/Web/API/File
        const file = files.item(0);
        if (file) {
            const contents = await file.text();
            return contents.split('\n');
        }
        return [];
    };

    return (
        <UploadStep>
            <div className={uploadWrapper}>
                <label className={uploadInputCss} htmlFor="fileUpload">
                    Upload File
                </label>
                <input
                    className={inputCss}
                    id="fileUpload"
                    type="file"
                    onChange={handleUpload}
                    accept={'.csv'}
                />
            </div>
        </UploadStep>
    );
}
