export type OnChangeModel = {
    value: string | number | boolean,
    error: string,
    touched: boolean,
    field: string
};

export interface IFormStateField<T> {error: string, value: T};

export interface ISingle_tableFormState {
    s_pk: IFormStateField<number>;
    modify_count: IFormStateField<number>;
    natural_key1: IFormStateField<string>;
    natural_key21: IFormStateField<string>;
    natural_key22_33: IFormStateField<string>;
    natural_key31: IFormStateField<string>;
    natural_key32: IFormStateField<string>;
    fullwidth_limited: IFormStateField<string>;
    halfwidth_limited: IFormStateField<string>;
    halfwidth_alphabetical_limited: IFormStateField<string>;
    halfwidth_number_limited: IFormStateField<string>;
    halfwidth_symbol_limited: IFormStateField<string>;
    halfwidth_kana_limited: IFormStateField<string>;
    fullwidth_kana_limited: IFormStateField<string>;
    number_limited: IFormStateField<number>;
    small_number_point: IFormStateField<number>;
    number_real: IFormStateField<number>;
    number_double: IFormStateField<number>;
    normal_string: IFormStateField<string>;
    postal_code: IFormStateField<string>;
    phone_number: IFormStateField<string>;
    date: IFormStateField<Date>;
    datetime: IFormStateField<Date>;
    email_address: IFormStateField<string>;
    url: IFormStateField<string>;
    flg: IFormStateField<boolean>;
    regexp: IFormStateField<string>;
    memo: IFormStateField<string>;
    related_pk: IFormStateField<number>;
    update_u_id: IFormStateField<number>;
    update_date: IFormStateField<Date>;
    delflg: IFormStateField<boolean>;
    //(非DB項目)
    update_user: IFormStateField<string>;
};


export interface IApp_envFormState {
    modify_count: IFormStateField<number>;
    dir_tmp: IFormStateField<string>;
    del_days_tmp: IFormStateField<number>;
    update_u_id: IFormStateField<number>;
    update_date: IFormStateField<Date>;
    delflg: IFormStateField<boolean>;
};

export interface IRelated_tableFormState {
    related_pk: IFormStateField<number>;
    modify_count: IFormStateField<number>;
    related_data: IFormStateField<string>;
    update_u_id: IFormStateField<number>;
    update_date: IFormStateField<Date>;
    delflg: IFormStateField<boolean>;
    //(非DB項目)
    update_user: IFormStateField<string>;
};


export interface ISqlFormState {
    sql_pk: IFormStateField<number>;
    modify_count: IFormStateField<number>;
    sql_name: IFormStateField<string>;
    sql: IFormStateField<string>;
    memo: IFormStateField<string>;
    update_u_id: IFormStateField<number>;
    update_date: IFormStateField<Date>;
    delflg: IFormStateField<boolean>;
    //(非DB項目)
    update_user: IFormStateField<string>;
};
