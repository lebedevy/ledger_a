import {
    INVALIDATE_TEMPLATE_LIST,
    REQUEST_TEMPLATE_LIST,
    RECIEVE_TEMPLATE_LIST,
} from '../actionTypes';

function templates(state = { isFetching: false, didInvalidate: false, items: [] }, action) {
    switch (action.type) {
        case INVALIDATE_TEMPLATE_LIST:
            return Object.assign({}, state, { didInvalidate: true });
        case REQUEST_TEMPLATE_LIST:
            return Object.assign({}, state, { isFetching: true, didInvalidate: false });
        case RECIEVE_TEMPLATE_LIST:
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

export default function templateLists(state = {}, action) {
    switch (action.type) {
        case INVALIDATE_TEMPLATE_LIST:
        case REQUEST_TEMPLATE_LIST:
        case RECIEVE_TEMPLATE_LIST:
            return Object.assign({}, state, {
                [action.listType]: templates(state[action.aggregateType], action),
            });
        default:
            return state;
    }
}
