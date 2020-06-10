import React from 'react';
import { setStep } from '../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../typescript/general_interfaces';

export function useUploadStep(): [number, (n: number) => void] {
    const { step } = useSelector((state: RootState) => state.uploadExpenses);
    const dispatch = useDispatch();

    const updateStep = (step: number) => {
        dispatch(setStep(step));
    };

    return [step, updateStep];
}
