import { IRelated_table, Related_tableModificationStatus} from "../models/related_table.interface";

export const SET_RELATED_TABLE_MODIFICATION_STATE: string = "SET_RELATED_TABLE_MODIFICATION_STATE";
export const ADD_RELATED_TABLE: string = "ADD_RELATED_TABLE";
export const EDIT_RELATED_TABLE: string = "EDIT_RELATED_TABLE";
export const REMOVE_RELATED_TABLE: string = "REMOVE_RELATED_TABLE";
export const CHANGE_RELATED_TABLE_PENDING_EDIT: string = "CHANGE_RELATED_TABLE_PENDING_EDIT";
export const CLEAR_RELATED_TABLE_PENDING_EDIT: string = "CLEAR_RELATED_TABLE_PENDING_EDIT";
export const SET_RELATED_TABLE_ALL_COUNT: string = "SET_RELATED_TABLE_ALL_COUNT";
export const CLEAR_RELATED_TABLE: string = "CLEAR_RELATED_TABLE";
export const ADD_RELATED_TABLE_HISTORY: string = "ADD_RELATED_TABLE_HISTORY";
export const CLEAR_RELATED_TABLE_HISTORY: string = "CLEAR_RELATED_TABLE_HISTORY";

export function ClearRelated_table(): IClearRelated_tableActionType {
    return { type: CLEAR_RELATED_TABLE };
}

export function addRelated_table(related_table: IRelated_table): IAddRelated_tableActionType {
    return { type: ADD_RELATED_TABLE, related_table: related_table };
}

export function editRelated_table(related_table: IRelated_table): IEditRelated_tableActionType {
    return { type: EDIT_RELATED_TABLE, related_table: related_table };
}

export function removeRelated_table(related_pk: number): IRemoveRelated_tableActionType {
    return { type: REMOVE_RELATED_TABLE, related_pk: related_pk };
}

export function changeSelectedRelated_table(related_table: IRelated_table): IChangeSelectedRelated_tableActionType {
    return { type: CHANGE_RELATED_TABLE_PENDING_EDIT, related_table: related_table };
}

export function clearSelectedRelated_table(): IClearSelectedRelated_tableActionType {
    return { type: CLEAR_RELATED_TABLE_PENDING_EDIT };
}

export function setModificationState(value: Related_tableModificationStatus): ISetModificationStateActionType {
    return { type: SET_RELATED_TABLE_MODIFICATION_STATE, value: value };
}

export function setAllCount(count: number): ISetAllCountActionType {
    return { type: SET_RELATED_TABLE_ALL_COUNT, count: count };
}


export function ClearRelated_tablehistory(): IClearRelated_tableHistoryActionType {
    return { type: CLEAR_RELATED_TABLE_HISTORY };
}

export function addRelated_tableHistory(related_table: IRelated_table): IAddRelated_tableHistoryActionType {
    return { type: ADD_RELATED_TABLE_HISTORY, related_table: related_table };
}


interface ISetModificationStateActionType { type: string, value:  Related_tableModificationStatus};

interface IClearRelated_tableActionType { type: string };
interface IAddRelated_tableActionType { type: string, related_table: IRelated_table };
interface IEditRelated_tableActionType { type: string, related_table: IRelated_table };
interface IRemoveRelated_tableActionType { type: string, related_pk: number };
interface IChangeSelectedRelated_tableActionType { type: string, related_table: IRelated_table };
interface IClearSelectedRelated_tableActionType { type: string };
interface ISetModificationStateActionType { type: string, value:  Related_tableModificationStatus};
interface ISetAllCountActionType { type: string, count: number };
interface IClearRelated_tableHistoryActionType { type: string };
interface IAddRelated_tableHistoryActionType { type: string, related_table: IRelated_table };
