import {
    SET_DATE,
    OPEN_DRAWER,
    CLOSE_DRAWER,
    SET_USER,
    LOGOUT,
    SET_PERIOD,
    SET_CATEGORIES,
    SET_STORES,
    SET_SCREEN_SIZE,
    SET_SCREEN,
    SET_SETTINGS_SCREEN,
    INVALIDATE_EXPENSES,
    REQUEST_EXPENSES,
    RECIEVE_EXPENSES,
} from './actionTypes';

const requestExpenses = aggregateType => ({
    type: REQUEST_EXPENSES,
    aggregateType,
});

const invalidateExpenses = aggregateType => ({
    type: INVALIDATE_EXPENSES,
    aggregateType,
});

const recieveExpenses = (aggregateType, data) => ({
    type: RECIEVE_EXPENSES,
    items: data,
    aggregateType,
    recievedAt: Date.now(),
});

const fetchAggregateExpenses = (aggregateType, params) => dispatch => {
    dispatch(requestExpenses(aggregateType));
    fetch(`/api/users/expenses/summary/${aggregateType}${params}`)
        .then(data => data.json())
        .then(data => {
            console.log(data);
            dispatch(recieveExpenses(aggregateType, data));
        });
};

function shouldFetchAggregateExpenses(state, aggregateType) {
    console.log(state, aggregateType);
    const expenses = state.aggregateExpenses[aggregateType];
    if (!expenses) {
        return true;
    } else if (expenses.isFetching) {
        return false;
    } else {
        return expenses.didInvalidate;
    }
}

export function fetchAggregateExpensesIfNeeded([aggregateType, params]) {
    return (dispatch, getState) => {
        if (shouldFetchAggregateExpenses(getState(), aggregateType)) {
            return dispatch(fetchAggregateExpenses(aggregateType, params));
        } else {
            return Promise.resolve();
        }
    };
}

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

export const setScreenDimensions = content => ({
    type: SET_SCREEN_SIZE,
    payload: {
        content,
    },
});

export const setScreen = content => ({
    type: SET_SCREEN,
    payload: {
        content,
    },
});

export const setSettingsScreen = content => ({
    type: SET_SETTINGS_SCREEN,
    payload: {
        content,
    },
});
