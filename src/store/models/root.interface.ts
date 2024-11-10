import { INotification } from "./notification.interface";
import { IAccount } from "./account.interface";
import { IAutoLogOff } from "./autologoff.interface";
import { IApp_env,App_envModificationStatus } from "./app_env.interface";
import { ISingle_table,Single_tableModificationStatus } from "./single_table.interface";
import { IRelated_table,Related_tableModificationStatus } from "./related_table.interface";
import { ISql,SqlModificationStatus } from "./sql.interface";


export interface IRootPageStateType {
    area: string;
    subArea: string;
}

export interface IRootStateType {
    page: IRootPageStateType;
}

export interface IStateType {
    root: IRootStateType;
    notifications: INotificationState;
    account: IAccount;
    autologoff: IAutoLogOff;
    app_envs: IApp_envState;
    app_envPagenation: IApp_envPagenationState;
    single_tables: ISingle_tableState;
    single_tablePagenation: ISingle_tablePagenationState;
    related_tables: IRelated_tableState;
    related_tablePagenation: IRelated_tablePagenationState;
    sqls: ISqlState;
    sqlPagenation: ISqlPagenationState;
}


export interface InumberOfDisplaysPerpageState {
    value: number;
}

export interface IUserPagenationState {
    CurrentPage: number;
    numberOfDisplaysPerpage: number;
}

export interface IGroupPagenationState {
    CurrentPage: number;
    numberOfDisplaysPerpage: number;
}

export interface IServerPagenationState {
    CurrentPage: number;
    numberOfDisplaysPerpage: number;
}

export interface IJobinfoPagenationState {
    CurrentPage: number;
    numberOfDisplaysPerpage: number;
}

export interface IActionBase {
    type: string;
    [prop: string]: any;
}

export interface INotificationState {
    notifications: INotification[];
}

export interface IApp_envState {
    App_env: IApp_env | null;
    modificationState: App_envModificationStatus;
    IsFirst: boolean;
    all_count: number;
    App_envHistorys: IApp_env[];
}

export interface IApp_envPagenationState {
    CurrentPage: number;
    numberOfDisplaysPerpage: number;
}
export interface ISingle_tableState {
    Single_tables: ISingle_table[];
    selectedSingle_table: ISingle_table | null;
    modificationState: Single_tableModificationStatus;
    IsFirst: boolean;
    all_count: number;
    Single_tableHistorys: ISingle_table[];
}

export interface ISingle_tablePagenationState {
    CurrentPage: number;
    numberOfDisplaysPerpage: number;
}

export interface IRelated_tableState {
    Related_tables: IRelated_table[];
    selectedRelated_table: IRelated_table | null;
    modificationState: Related_tableModificationStatus;
    IsFirst: boolean;
    all_count: number;
    Related_tableHistorys: IRelated_table[];
}

export interface IRelated_tablePagenationState {
    CurrentPage: number;
    numberOfDisplaysPerpage: number;
}


export interface ISqlState {
    Sqls: ISql[];
    selectedSql: ISql | null;
    modificationState: SqlModificationStatus;
    IsFirst: boolean;
    all_count: number;
    SqlHistorys: ISql[];
}

export interface ISqlPagenationState {
    CurrentPage: number;
    numberOfDisplaysPerpage: number;
}
