import { SET_DATE, OPEN_DRAWER, CLOSE_DRAWER, SET_USER } from './actionTypes';

export const setDate = content => ({
    type: SET_DATE,
    payload: {
        content,
    },
});

export const openDrawer = content => ({
    type: OPEN_DRAWER,
    payload: {
        content,
    },
});

export const closeDrawer = content => ({
    type: CLOSE_DRAWER,
    payload: {
        content,
    },
});

export const setUser = content => {
    console.log(content);
    return {
        type: SET_USER,
        payload: {
            content,
        },
    };
};
