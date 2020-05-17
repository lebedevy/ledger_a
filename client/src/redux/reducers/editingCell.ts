import { SET_EDITING_CELL } from '../actionTypes';

interface iAction {
    type: string;
    payload: { cell: string | null };
}

export default function (state = null, action: iAction) {
    switch (action.type) {
        case SET_EDITING_CELL: {
            return action.payload.cell;
        }
        default:
            return state;
    }
}
