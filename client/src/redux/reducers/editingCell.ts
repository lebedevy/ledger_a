import {
    SET_EDITING_CELL,
    SET_DELETING_MODE,
    RESET_DELETING_IDS,
    ADD_DELETE_ID,
    REMOVE_DELETE_ID,
} from '../actionTypes';

interface iAction {
    type: string;
    payload: { cell?: string | null; deleting?: boolean; id?: number };
}

const initialState = {
    cellEdit: null,
    deletingMode: { deleting: false, deleteIds: [], inProgress: false },
};

export default function (state = initialState, action: iAction) {
    switch (action.type) {
        case SET_EDITING_CELL: {
            return { ...state, cellEdit: action.payload.cell };
        }
        case SET_DELETING_MODE: {
            return {
                ...state,
                deletingMode: { ...state.deletingMode, deleting: action.payload.deleting },
            };
        }
        case RESET_DELETING_IDS: {
            return {
                ...state,
                deletingMode: { ...state.deletingMode, deleteIds: [] },
            };
        }
        case ADD_DELETE_ID: {
            return {
                ...state,
                deletingMode: {
                    ...state.deletingMode,
                    deleteIds: [...state.deletingMode.deleteIds, action.payload.id],
                },
            };
        }
        case REMOVE_DELETE_ID: {
            return {
                ...state,
                deletingMode: {
                    ...state.deletingMode,
                    deleteIds: [
                        ...state.deletingMode.deleteIds.filter((id) => action.payload.id !== id),
                    ],
                },
            };
        }
        default:
            return state;
    }
}
