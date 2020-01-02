import { SET_SCREEN_SIZE } from '../actionTypes';

const height = window.innerHeight;
const width = window.innerWidth;

const initialState = {
    height,
    width,
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_SCREEN_SIZE: {
            return {
                ...action.payload.content,
            };
        }
        default:
            return state;
    }
}
