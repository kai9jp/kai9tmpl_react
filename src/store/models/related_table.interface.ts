export interface IRelated_table {
    related_pk: number;
    modify_count: number;
    related_data: string;
    update_u_id: number;
    update_date: Date;
    delflg: boolean;
    //(非DB項目)
    update_user: string;
}
             
export enum Related_tableModificationStatus {
    None = 0,
    Create = 1,
    Edit = 2,
    History = 3
}
