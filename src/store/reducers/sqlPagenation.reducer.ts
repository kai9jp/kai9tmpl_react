import { IActionBase,ISqlPagenationState } from "../models/root.interface";
import { SET_PAG_SQL_CURRENTPAGE_STATE,SET_PAG_SQL_NUMBEROFDISPLAYSPERPAGE_STATE} from "../actions/sqlPagenation.action";

const initialState: ISqlPagenationState = {
    CurrentPage: 1,
    numberOfDisplaysPerpage:100
};

function sqlPagenationReducer(state: ISqlPagenationState = initialState, action: IActionBase): ISqlPagenationState {
    switch (action.type) {
        case SET_PAG_SQL_CURRENTPAGE_STATE: {
            return { ...state, CurrentPage: action.current_page };
        }
        case SET_PAG_SQL_NUMBEROFDISPLAYSPERPAGE_STATE: {
            return { ...state, numberOfDisplaysPerpage: action.numberOfDisplaysPerpage };
        }
        default:
            return state;
    }
};

export default sqlPagenationReducer;
