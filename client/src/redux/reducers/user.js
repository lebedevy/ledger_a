import { SET_USER, LOGOUT } from '../actionTypes';

export default function(state = null, action) {
    switch (action.type) {
        case SET_USER: {
            return {
                ...action.payload.content,
            };
        }
        case LOGOUT:
            return null;
        default:
            return state;
    }
}
