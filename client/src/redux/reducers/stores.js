import { SET_STORES } from '../actionTypes';

export default function(state = null, action) {
    switch (action.type) {
        case SET_STORES: {
            return action.payload.content;
        }
        default:
            return state;
    }
}
