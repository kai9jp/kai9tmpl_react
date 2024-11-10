import { IApp_env, App_envModificationStatus} from "../models/app_env.interface";

export const SET_SINGLE_RECORD_MODIFICATION_STATE: string = "SET_SINGLE_RECORD_MODIFICATION_STATE";
export const SET_SINGLE_RECORD: string = "EDIT_SINGLE_RECORD";
export const REMOVE_SINGLE_RECORD: string = "REMOVE_SINGLE_RECORD";
export const CHANGE_SINGLE_RECORD_PENDING_EDIT: string = "CHANGE_SINGLE_RECORD_PENDING_EDIT";
export const CLEAR_SINGLE_RECORD_PENDING_EDIT: string = "CLEAR_SINGLE_RECORD_PENDING_EDIT";
export const SET_SINGLE_RECORD_ALL_COUNT: string = "SET_SINGLE_RECORD_ALL_COUNT";
export const CLEAR_SINGLE_RECORD: string = "CLEAR_SINGLE_RECORD";
export const ADD_SINGLE_RECORD_HISTORY: string = "ADD_SINGLE_RECORD_HISTORY";
export const CLEAR_SINGLE_RECORD_HISTORY: string = "CLEAR_SINGLE_RECORD_HISTORY";

export function ClearApp_env(): IClearApp_envActionType {
    return { type: CLEAR_SINGLE_RECORD };
}

export function setApp_env(app_env: IApp_env): ISetApp_envActionType {
    return { type: SET_SINGLE_RECORD, app_env: app_env };
}

export function removeApp_env(dir_tmp: string): IRemoveApp_envActionType {
    return { type: REMOVE_SINGLE_RECORD, dir_tmp: dir_tmp };
}

export function changeSelectedApp_env(app_env: IApp_env): IChangeSelectedApp_envActionType {
    return { type: CHANGE_SINGLE_RECORD_PENDING_EDIT, app_env: app_env };
}

export function clearSelectedApp_env(): IClearSelectedApp_envActionType {
    return { type: CLEAR_SINGLE_RECORD_PENDING_EDIT };
}

export function setModificationState(value: App_envModificationStatus): ISetModificationStateActionType {
    return { type: SET_SINGLE_RECORD_MODIFICATION_STATE, value: value };
}

export function setAllCount(count: number): ISetAllCountActionType {
    return { type: SET_SINGLE_RECORD_ALL_COUNT, count: count };
}


export function ClearApp_envhistory(): IClearApp_envHistoryActionType {
    return { type: CLEAR_SINGLE_RECORD_HISTORY };
}

export function addApp_envHistory(app_env: IApp_env): IAddApp_envHistoryActionType {
    return { type: ADD_SINGLE_RECORD_HISTORY, app_env: app_env };
}


interface ISetModificationStateActionType { type: string, value:  App_envModificationStatus};

interface IClearApp_envActionType { type: string };
interface ISetApp_envActionType { type: string, app_env: IApp_env };
interface IRemoveApp_envActionType { type: string, dir_tmp: string };
interface IChangeSelectedApp_envActionType { type: string, app_env: IApp_env };
interface IClearSelectedApp_envActionType { type: string };
interface ISetModificationStateActionType { type: string, value:  App_envModificationStatus};
interface ISetAllCountActionType { type: string, count: number };
interface IClearApp_envHistoryActionType { type: string };
interface IAddApp_envHistoryActionType { type: string, app_env: IApp_env };
