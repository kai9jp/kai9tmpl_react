export interface ISingle_table {
    //【制御:開始】対象カラム
    s_pk: number;
    modify_count: number;
    natural_key1: string;
    natural_key21: string;
    natural_key22_33: string;
    natural_key31: string;
    natural_key32: string;
    fullwidth_limited: string;
    halfwidth_limited: string;
    halfwidth_alphabetical_limited: string;
    halfwidth_number_limited: string;
    halfwidth_symbol_limited: string;
    halfwidth_kana_limited: string;
    fullwidth_kana_limited: string;
    number_limited: number;
    small_number_point: number;
    number_real: number;
    number_double: number;
    normal_string: string;
    postal_code: string;
    phone_number: string;
    date: Date;
    datetime: Date;
    email_address: string;
    url: string;
    flg: boolean;
    regexp: string;
    memo: string;
    related_pk: number;
    update_u_id: number;
    update_date: Date;
    delflg: boolean;
    //【制御:終了】対象カラム
    //【制御:開始】relation
    related_pk__related_data?: string;
    //【制御:終了】relation
    //(非DB項目)
    update_user: string;
}
             
export enum Single_tableModificationStatus {
    None = 0,
    Create = 1,
    Edit = 2,
    History = 3
}
