import { IActionBase } from "../models/root.interface";
import { IAutoLogOff } from "../models/autologoff.interface";
import { SET_AUTO_LOGOFF_TIMER,SET_IS_AUTO_LOGOFF } from "../actions/autologoff.actions";

const initialState: IAutoLogOff = {
    IsSetTimer: false,
    IsAutoLogoff: false
};

function accountReducer(state: IAutoLogOff = initialState, action: IActionBase): IAutoLogOff {
    switch (action.type) {
        case SET_AUTO_LOGOFF_TIMER: {
            return { ...state, IsSetTimer: action.IsSetTimer};
        }
        case SET_IS_AUTO_LOGOFF: {
            return { ...state, IsAutoLogoff: action.IsAutoLogoff};
        }
        default:
            return state;
    }
}


export default accountReducer;