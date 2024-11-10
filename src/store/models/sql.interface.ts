export interface ISql {
    sql_pk: number;
    modify_count: number;
    sql_name: string;
    sql: string;
    memo: string;
    update_u_id: number;
    update_date: Date;
    delflg: boolean;
    //(非DB項目)
    update_user: string;
}
             
export enum SqlModificationStatus {
    None = 0,
    Create = 1,
    Edit = 2,
    History = 3
}
