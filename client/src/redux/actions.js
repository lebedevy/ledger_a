import { SET_DATE } from './actionTypes';

export const setDate = content => ({
    type: SET_DATE,
    payload: {
        content,
    },
});
