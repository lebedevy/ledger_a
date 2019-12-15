import { SET_CATEGORIES } from '../actionTypes';

export default function(state = null, action) {
    switch (action.type) {
        case SET_CATEGORIES: {
            return action.payload.content;
        }
        default:
            return state;
    }
}
