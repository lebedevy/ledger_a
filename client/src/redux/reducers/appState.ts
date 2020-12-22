import { SET_APP_MODE } from '../actionTypes';

const initialState = {
    groupKey: undefined,
};

export default function (state = initialState, action: any) {
    switch (action.type) {
        // All of these actions are repeats
        // If I am not adding custom logic I can just write a generic method to do this...
        case SET_APP_MODE: {
            return {
                ...state,
                groupKey: action.payload.type,
            };
        }
        default:
            return state;
    }
}
