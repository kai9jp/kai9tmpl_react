import { ISql, SqlModificationStatus} from "../models/sql.interface";

export const SET_SQL_MODIFICATION_STATE: string = "SET_SQL_MODIFICATION_STATE";
export const ADD_SQL: string = "ADD_SQL";
export const EDIT_SQL: string = "EDIT_SQL";
export const REMOVE_SQL: string = "REMOVE_SQL";
export const CHANGE_SQL_PENDING_EDIT: string = "CHANGE_SQL_PENDING_EDIT";
export const CLEAR_SQL_PENDING_EDIT: string = "CLEAR_SQL_PENDING_EDIT";
export const SET_SQL_ALL_COUNT: string = "SET_SQL_ALL_COUNT";
export const CLEAR_SQL: string = "CLEAR_SQL";
export const ADD_SQL_HISTORY: string = "ADD_SQL_HISTORY";
export const CLEAR_SQL_HISTORY: string = "CLEAR_SQL_HISTORY";

export function ClearSql(): IClearSqlActionType {
    return { type: CLEAR_SQL };
}

export function addSql(sql: ISql): IAddSqlActionType {
    return { type: ADD_SQL, sql: sql };
}

export function editSql(sql: ISql): IEditSqlActionType {
    return { type: EDIT_SQL, sql: sql };
}

export function removeSql(sql_pk: number): IRemoveSqlActionType {
    return { type: REMOVE_SQL, sql_pk: sql_pk };
}

export function changeSelectedSql(sql: ISql): IChangeSelectedSqlActionType {
    return { type: CHANGE_SQL_PENDING_EDIT, sql: sql };
}

export function clearSelectedSql(): IClearSelectedSqlActionType {
    return { type: CLEAR_SQL_PENDING_EDIT };
}

export function setModificationState(value: SqlModificationStatus): ISetModificationStateActionType {
    return { type: SET_SQL_MODIFICATION_STATE, value: value };
}

export function setAllCount(count: number): ISetAllCountActionType {
    return { type: SET_SQL_ALL_COUNT, count: count };
}


export function ClearSqlhistory(): IClearSqlHistoryActionType {
    return { type: CLEAR_SQL_HISTORY };
}

export function addSqlHistory(sql: ISql): IAddSqlHistoryActionType {
    return { type: ADD_SQL_HISTORY, sql: sql };
}


interface ISetModificationStateActionType { type: string, value:  SqlModificationStatus};

interface IClearSqlActionType { type: string };
interface IAddSqlActionType { type: string, sql: ISql };
interface IEditSqlActionType { type: string, sql: ISql };
interface IRemoveSqlActionType { type: string, sql_pk: number };
interface IChangeSelectedSqlActionType { type: string, sql: ISql };
interface IClearSelectedSqlActionType { type: string };
interface ISetModificationStateActionType { type: string, value:  SqlModificationStatus};
interface ISetAllCountActionType { type: string, count: number };
interface IClearSqlHistoryActionType { type: string };
interface IAddSqlHistoryActionType { type: string, sql: ISql };
