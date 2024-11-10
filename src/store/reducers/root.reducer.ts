import { combineReducers, Reducer } from "redux";
import { UPDATE_CURRENT_PATH } from "../actions/root.actions";
import { IRootStateType, IActionBase, IStateType } from "../models/root.interface";
import notificationReducer from "./notification.reducer";
import accountReducer from "./account.reducer";
import autologoffReducer from "./autologoff.reducer";
import app_envReducer from "./app_env.reducer";
import app_envPagenationReducer from "./app_envPagenation.reducer";
import single_tableReducer from "./single_table.reducer";
import single_tablePagenationReducer from "./single_tablePagenation.reducer";
import related_tableReducer from "./related_table.reducer";
import related_tablePagenationReducer from "./related_tablePagenation.reducer";
import sqlReducer from "./sql.reducer";
import sqlPagenationReducer from "./sqlPagenation.reducer";

const initialState: IRootStateType = {
    page: {area: "home", subArea: ""}
};

function rootReducer(state: IRootStateType = initialState, action: IActionBase): IRootStateType {
    switch (action.type) {
        case UPDATE_CURRENT_PATH:
            return { ...state, page: {area: action.area, subArea: action.subArea}};
        default:
            return state;
    }
}

const rootReducers: Reducer<IStateType> = combineReducers({
    root: rootReducer,
    notifications: notificationReducer,
    account: accountReducer,
    autologoff:autologoffReducer, 
    app_envs: app_envReducer,
    app_envPagenation: app_envPagenationReducer,
    single_tables: single_tableReducer,
    single_tablePagenation: single_tablePagenationReducer,
    related_tables: related_tableReducer,
    related_tablePagenation: related_tablePagenationReducer,
    sqls: sqlReducer,
    sqlPagenation: sqlPagenationReducer,
});

export default rootReducers;