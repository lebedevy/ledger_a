import { INVALIDATE_EXPENSES, REQUEST_EXPENSES, RECIEVE_EXPENSES } from '../actionTypes';

function expenses(state = { isFetching: false, didInvalidate: false, items: [] }, action) {
    switch (action.type) {
        case INVALIDATE_EXPENSES:
            return Object.assign({}, state, { didInvalidate: true });
        case REQUEST_EXPENSES:
            return Object.assign({}, state, { isFetching: true, didInvalidate: false });
        case RECIEVE_EXPENSES:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                items: action.items,
                lastUpdated: action.recievedAt,
            });
        default:
            return state;
    }
}

export default function aggregateExpenses(state = {}, action) {
    switch (action.type) {
        case INVALIDATE_EXPENSES:
        case REQUEST_EXPENSES:
        case RECIEVE_EXPENSES:
            return Object.assign({}, state, {
                [action.aggregateType]: expenses(state[action.aggregateType], action),
            });
        default:
            return state;
    }
}
