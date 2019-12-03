import { SET_DATE } from '../actionTypes';

const today = new Date();

const initialState = {
    today,
    current: today,
};

export default function(state = initialState, action) {
    switch (action.type) {
        default:
            return state;
    }
}
