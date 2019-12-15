import { SET_DATE, SET_PERIOD } from '../actionTypes';
import { getFormatedDate } from '../../utility/utility';

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();

const initialState = {
    today,
    current: today,
    period: {
        start: getFormatedDate(new Date(year, month, 1)),
        end: getFormatedDate(new Date(year, month + 1, 0)),
    },
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_PERIOD: {
            return {
                ...state,
                period: {
                    start: action.payload.content.start,
                    end: action.payload.content.end,
                },
            };
        }
        default:
            return state;
    }
}
