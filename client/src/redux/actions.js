import {
    SET_DATE,
    SET_USER,
    LOGOUT,
    SET_PERIOD,
    SET_SCREEN_SIZE,
    SET_SCREEN,
    SET_SETTINGS_SCREEN,
    INVALIDATE_EXPENSES,
    REQUEST_EXPENSES,
    RECIEVE_EXPENSES,
    INVALIDATE_TEMPLATE_LIST,
    REQUEST_TEMPLATE_LIST,
    RECIEVE_TEMPLATE_LIST,
    SET_EDITING_CELL,
    SET_DELETING_MODE,
    ADD_DELETE_ID,
    REMOVE_DELETE_ID,
    SET_UPLOAD_STEP,
    SET_ORIGINAL_UPLOAD_EXP,
    SET_UPLOAD_PREDICTIONS,
    SET_UPLOAD_CLEANED_EXPENSES,
    SET_UPLOAD_TYPES,
    SET_APP_MODE,
} from './actionTypes';

const requestExpenses = (aggregateType) => ({
    type: REQUEST_EXPENSES,
    aggregateType,
});

export const invalidateExpenses = (aggregateType) => ({
    type: INVALIDATE_EXPENSES,
    aggregateType,
});

const recieveExpenses = (aggregateType, data) => ({
    type: RECIEVE_EXPENSES,
    items: data,
    aggregateType,
    recievedAt: Date.now(),
});

const fetchAggregateExpenses = (aggregateType, params) => (dispatch) => {
    dispatch(requestExpenses(aggregateType));
    fetch(`/api/users/expenses/summary/${aggregateType}${params}`)
        .then((data) => data.json())
        .then((data) => {
            dispatch(recieveExpenses(aggregateType, data));
        });
};

function shouldFetchAggregateExpenses(state, aggregateType) {
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

const requestTemplateList = (listType) => ({
    type: REQUEST_TEMPLATE_LIST,
    listType,
});

export const invalidateTemplateList = (listType) => ({
    type: INVALIDATE_TEMPLATE_LIST,
    listType,
});

const recieveTemplateList = (listType, data) => ({
    type: RECIEVE_TEMPLATE_LIST,
    items: data,
    listType,
    recievedAt: Date.now(),
});

const fetchTemplateList = (listType) => (dispatch) => {
    dispatch(requestTemplateList(listType));
    fetch(`/api/users/expenses/${listType}`)
        .then((data) => data.json())
        .then((data) => {
            console.log(data);
            dispatch(recieveTemplateList(listType, data[listType]));
        });
};

function shouldFetchTemplateList(state, listType) {
    const list = state.templateLists[listType];
    if (!list) {
        return true;
    } else if (list.isFetching) {
        return false;
    } else {
        return list.didInvalidate;
    }
}

export function fetchTemplateListIfNeeded(listType) {
    return (dispatch, getState) => {
        if (shouldFetchTemplateList(getState(), listType)) {
            return dispatch(fetchTemplateList(listType));
        } else {
            return Promise.resolve();
        }
    };
}

export const setDate = (content) => ({
    type: SET_DATE,
    payload: {
        content,
    },
});

export const setUser = (content) => ({
    type: SET_USER,
    payload: {
        content,
    },
});

export const logout = (content) => ({
    type: LOGOUT,
    payload: {
        content: null,
    },
});

export const setPeriod = (content) => ({
    type: SET_PERIOD,
    payload: {
        content,
    },
});

export const setScreenDimensions = (content) => ({
    type: SET_SCREEN_SIZE,
    payload: {
        content,
    },
});

export const setScreen = (content) => ({
    type: SET_SCREEN,
    payload: {
        content,
    },
});

export const setSettingsScreen = (content) => ({
    type: SET_SETTINGS_SCREEN,
    payload: {
        content,
    },
});

export const setEditingExpense = (cell) => ({
    type: SET_EDITING_CELL,
    payload: {
        cell,
    },
});

export const setDeletingMode = (deleting) => ({
    type: SET_DELETING_MODE,
    payload: {
        deleting,
    },
});

export const addDeleteId = (id) => ({
    type: ADD_DELETE_ID,
    payload: {
        id,
    },
});

export const removeDeleteId = (id) => ({
    type: REMOVE_DELETE_ID,
    payload: {
        id,
    },
});

export const setStep = (step) => ({
    type: SET_UPLOAD_STEP,
    payload: {
        step,
    },
});

export const setOrignalExpenseUpload = (expenses) => ({
    type: SET_ORIGINAL_UPLOAD_EXP,
    payload: {
        expenses,
    },
});

export const setUploadPredictions = (predictions) => ({
    type: SET_UPLOAD_PREDICTIONS,
    payload: {
        predictions,
    },
});

export const setUploadCleanedExpenses = (expenses) => ({
    type: SET_UPLOAD_CLEANED_EXPENSES,
    payload: {
        expenses,
    },
});

export const setUploadTypes = (types) => ({
    type: SET_UPLOAD_TYPES,
    payload: {
        types,
    },
});

export const setAppMode = (type) => ({ type: SET_APP_MODE, payload: { type } });
