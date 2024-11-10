import { IActionBase } from "../models/root.interface";
import { IAccount } from "../models/account.interface";
import { LOG_IN, LOG_OUT } from "../actions/account.actions";

const initialState: IAccount = {
    user_id: 0,
    modify_count: 0,
    login_id: "",
    default_g_id: 0,
    authority_lv: 0,
};

function accountReducer(state: IAccount = initialState, action: IActionBase): IAccount {
    switch (action.type) {
        case LOG_IN: {
            return { ...state, user_id: action.user_id,
                               modify_count: action.modify_count,
                               login_id: action.login_id,
                               default_g_id: action.default_g_id,
                               authority_lv: action.authority_lv,};
        }
        case LOG_OUT: {
            return { ...state, user_id: 0,
                        modify_count: 0,
                        login_id: "",
                        default_g_id: 0,
                        authority_lv: 0,};
}
        default:
            return state;
    }
}


export default accountReducer;