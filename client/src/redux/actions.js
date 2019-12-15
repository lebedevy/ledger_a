import {
    SET_DATE,
    OPEN_DRAWER,
    CLOSE_DRAWER,
    SET_USER,
    LOGOUT,
    SET_PERIOD,
    SET_CATEGORIES,
    SET_STORES,
} from './actionTypes';

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

export const setUser = content => ({
    type: SET_USER,
    payload: {
        content,
    },
});

export const logout = content => ({
    type: LOGOUT,
    payload: {
        content: null,
    },
});

export const setPeriod = content => ({
    type: SET_PERIOD,
    payload: {
        content,
    },
});

export const setCategories = content => ({
    type: SET_CATEGORIES,
    payload: {
        content,
    },
});

export const setStores = content => ({
    type: SET_STORES,
    payload: {
        content,
    },
});
