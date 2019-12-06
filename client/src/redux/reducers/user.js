import { SET_USER } from '../actionTypes';

export default function(state = null, action) {
    console.log(state, action);
    switch (action.type) {
        case SET_USER: {
            return {
                ...state,
                drawerState: true,
            };
        }
        default:
            return state;
    }
}
