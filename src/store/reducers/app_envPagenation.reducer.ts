import { IActionBase,IApp_envPagenationState } from "../models/root.interface";
import { SET_PAG_SINGLE_RECORD_CURRENTPAGE_STATE,SET_PAG_SINGLE_RECORD_NUMBEROFDISPLAYSPERPAGE_STATE} from "../actions/app_envPagenation.action";

const initialState: IApp_envPagenationState = {
    CurrentPage: 1,
    numberOfDisplaysPerpage:100
};

function app_envPagenationReducer(state: IApp_envPagenationState = initialState, action: IActionBase): IApp_envPagenationState {
    switch (action.type) {
        case SET_PAG_SINGLE_RECORD_CURRENTPAGE_STATE: {
            return { ...state, CurrentPage: action.current_page };
        }
        case SET_PAG_SINGLE_RECORD_NUMBEROFDISPLAYSPERPAGE_STATE: {
            return { ...state, numberOfDisplaysPerpage: action.numberOfDisplaysPerpage };
        }
        default:
            return state;
    }
};

export default app_envPagenationReducer;
