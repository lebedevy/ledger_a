import { OPEN_DRAWER, CLOSE_DRAWER } from '../actionTypes';

const initialState = {
    drawerState: false,
};

export default function(state = initialState, action) {
    switch (action.type) {
        case OPEN_DRAWER: {
            return {
                ...state,
                drawerState: true,
            };
        }
        case CLOSE_DRAWER: {
            return {
                ...state,
                drawerState: false,
            };
        }
        default:
            return state;
    }
}
