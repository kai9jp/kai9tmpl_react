import { IActionBase,IRelated_tablePagenationState } from "../models/root.interface";
import { SET_PAG_RELATED_TABLE_CURRENTPAGE_STATE,SET_PAG_RELATED_TABLE_NUMBEROFDISPLAYSPERPAGE_STATE} from "../actions/related_tablePagenation.action";

const initialState: IRelated_tablePagenationState = {
    CurrentPage: 1,
    numberOfDisplaysPerpage:100
};

function related_tablePagenationReducer(state: IRelated_tablePagenationState = initialState, action: IActionBase): IRelated_tablePagenationState {
    switch (action.type) {
        case SET_PAG_RELATED_TABLE_CURRENTPAGE_STATE: {
            return { ...state, CurrentPage: action.current_page };
        }
        case SET_PAG_RELATED_TABLE_NUMBEROFDISPLAYSPERPAGE_STATE: {
            return { ...state, numberOfDisplaysPerpage: action.numberOfDisplaysPerpage };
        }
        default:
            return state;
    }
};

export default related_tablePagenationReducer;
