import {
    SET_ORIGINAL_UPLOAD_EXP,
    SET_UPLOAD_STEP,
    SET_UPLOAD_PREDICTIONS,
    SET_UPLOAD_CLEANED_EXPENSES,
    SET_UPLOAD_TYPES,
} from '../actionTypes';
import { originalExpenses } from '../../components/typescript/general_interfaces';

const initialState = {
    baseExpenses: {} as originalExpenses,
    expenses: {} as any,
    types: {} as { [id: number]: number },
    step: 0,
};

export default function (state = initialState, action: any) {
    switch (action.type) {
        // All of these actions are repeats
        // If I am not adding custom logic I can just write a generic method to do this...
        case SET_UPLOAD_STEP: {
            return {
                ...state,
                step: action.payload.step,
            };
        }
        case SET_ORIGINAL_UPLOAD_EXP: {
            return {
                ...state,
                baseExpenses: action.payload.expenses,
            };
        }
        case SET_UPLOAD_PREDICTIONS: {
            return {
                ...state,
                predictions: action.payload.predictions,
            };
        }
        case SET_UPLOAD_CLEANED_EXPENSES: {
            return {
                ...state,
                expenses: action.payload.expenses,
            };
        }
        case SET_UPLOAD_TYPES: {
            return {
                ...state,
                types: action.payload.types,
            };
        }
        default:
            return state;
    }
}
