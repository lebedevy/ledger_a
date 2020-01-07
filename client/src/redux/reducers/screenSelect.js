import { SET_SETTINGS_SCREEN, SET_SCREEN } from '../actionTypes';

const initialState = {
    screen: 0,
    settings: 0,
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_SCREEN: {
            return {
                ...state,
                screen: action.payload.content,
            };
        }
        case SET_SETTINGS_SCREEN: {
            return {
                ...state,
                settings: action.payload.content,
            };
        }
        default:
            return state;
    }
}
