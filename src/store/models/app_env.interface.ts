export interface IApp_env {
    //[制御:開始]対象カラム
    modify_count: number;
    dir_tmp: string;
    del_days_tmp: number;
    update_u_id: number;
    update_date: Date;
    //[制御:終了]対象カラム
}    

export enum App_envModificationStatus {
    None = 0,
    Create = 1,
    Edit = 2,
    History = 3
}
