export interface IAccount {
    user_id: number;
    login_id: string;
    modify_count: number;
    default_g_id: number;
    authority_lv: number;
}

export interface IAccountAutoLogOff {
    IsSetTimer: boolean;
}