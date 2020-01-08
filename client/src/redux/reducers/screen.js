import { SET_SCREEN_SIZE } from '../actionTypes';

const height = window.innerHeight;
const width = window.innerWidth;
const mobile = width <= 600;

const initialState = {
    height,
    width,
    mobile,
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_SCREEN_SIZE: {
            return {
                ...action.payload.content,
                mobile: action.payload.content.width <= 600,
            };
        }
        default:
            return state;
    }
}
