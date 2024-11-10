import { IActionBase,ISingle_tablePagenationState } from "../models/root.interface";
import { SET_PAG_SINGLE_TABLE_CURRENTPAGE_STATE,SET_PAG_SINGLE_TABLE_NUMBEROFDISPLAYSPERPAGE_STATE} from "../actions/single_tablePagenation.action";

const initialState: ISingle_tablePagenationState = {
    CurrentPage: 1,
    numberOfDisplaysPerpage:100
};

function single_tablePagenationReducer(state: ISingle_tablePagenationState = initialState, action: IActionBase): ISingle_tablePagenationState {
    switch (action.type) {
        case SET_PAG_SINGLE_TABLE_CURRENTPAGE_STATE: {
            return { ...state, CurrentPage: action.current_page };
        }
        case SET_PAG_SINGLE_TABLE_NUMBEROFDISPLAYSPERPAGE_STATE: {
            return { ...state, numberOfDisplaysPerpage: action.numberOfDisplaysPerpage };
        }
        default:
            return state;
    }
};

export default single_tablePagenationReducer;
