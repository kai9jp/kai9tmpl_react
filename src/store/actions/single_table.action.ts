import { ISingle_table, Single_tableModificationStatus} from "../models/single_table.interface";

export const SET_SINGLE_TABLE_MODIFICATION_STATE: string = "SET_SINGLE_TABLE_MODIFICATION_STATE";
export const ADD_SINGLE_TABLE: string = "ADD_SINGLE_TABLE";
export const EDIT_SINGLE_TABLE: string = "EDIT_SINGLE_TABLE";
export const REMOVE_SINGLE_TABLE: string = "REMOVE_SINGLE_TABLE";
export const CHANGE_SINGLE_TABLE_PENDING_EDIT: string = "CHANGE_SINGLE_TABLE_PENDING_EDIT";
export const CLEAR_SINGLE_TABLE_PENDING_EDIT: string = "CLEAR_SINGLE_TABLE_PENDING_EDIT";
export const SET_SINGLE_TABLE_ALL_COUNT: string = "SET_SINGLE_TABLE_ALL_COUNT";
export const CLEAR_SINGLE_TABLE: string = "CLEAR_SINGLE_TABLE";
export const ADD_SINGLE_TABLE_HISTORY: string = "ADD_SINGLE_TABLE_HISTORY";
export const CLEAR_SINGLE_TABLE_HISTORY: string = "CLEAR_SINGLE_TABLE_HISTORY";

export function ClearSingle_table(): IClearSingle_tableActionType {
    return { type: CLEAR_SINGLE_TABLE };
}

export function addSingle_table(single_table: ISingle_table): IAddSingle_tableActionType {
    return { type: ADD_SINGLE_TABLE, single_table: single_table };
}

export function editSingle_table(single_table: ISingle_table): IEditSingle_tableActionType {
    return { type: EDIT_SINGLE_TABLE, single_table: single_table };
}

export function removeSingle_table(s_pk: number): IRemoveSingle_tableActionType {
    return { type: REMOVE_SINGLE_TABLE, s_pk: s_pk };
}

export function changeSelectedSingle_table(single_table: ISingle_table): IChangeSelectedSingle_tableActionType {
    return { type: CHANGE_SINGLE_TABLE_PENDING_EDIT, single_table: single_table };
}

export function clearSelectedSingle_table(): IClearSelectedSingle_tableActionType {
    return { type: CLEAR_SINGLE_TABLE_PENDING_EDIT };
}

export function setModificationState(value: Single_tableModificationStatus): ISetModificationStateActionType {
    return { type: SET_SINGLE_TABLE_MODIFICATION_STATE, value: value };
}

export function setAllCount(count: number): ISetAllCountActionType {
    return { type: SET_SINGLE_TABLE_ALL_COUNT, count: count };
}


export function ClearSingle_tablehistory(): IClearSingle_tableHistoryActionType {
    return { type: CLEAR_SINGLE_TABLE_HISTORY };
}

export function addSingle_tableHistory(single_table: ISingle_table): IAddSingle_tableHistoryActionType {
    return { type: ADD_SINGLE_TABLE_HISTORY, single_table: single_table };
}


interface ISetModificationStateActionType { type: string, value:  Single_tableModificationStatus};

interface IClearSingle_tableActionType { type: string };
interface IAddSingle_tableActionType { type: string, single_table: ISingle_table };
interface IEditSingle_tableActionType { type: string, single_table: ISingle_table };
interface IRemoveSingle_tableActionType { type: string, s_pk: number };
interface IChangeSelectedSingle_tableActionType { type: string, single_table: ISingle_table };
interface IClearSelectedSingle_tableActionType { type: string };
interface ISetModificationStateActionType { type: string, value:  Single_tableModificationStatus};
interface ISetAllCountActionType { type: string, count: number };
interface IClearSingle_tableHistoryActionType { type: string };
interface IAddSingle_tableHistoryActionType { type: string, single_table: ISingle_table };
