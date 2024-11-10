import axios from 'axios';
import {API_URL} from "../../common/constants";

export const LOG_IN: string = "LOG_IN";
export const LOG_OUT: string = "LOG_OUT";

export function login(user_id: number,modify_count:number,login_id: string,default_g_id:number,authority_lv:number): ILogInActionType {
    return { type: LOG_IN, user_id: user_id,modify_count: modify_count,login_id: login_id,default_g_id: default_g_id,authority_lv: authority_lv };
}

export function logout(): ILogOutActionType {
    //ログオフのAPIを実行する事でブラウザのトークンが削除されるAPI仕様
    const utl1 = API_URL+'/api/signout';
    axios.post(utl1, {}, {withCredentials: true})
   return { type: LOG_OUT};
}

interface ILogInActionType { type: string, user_id: number,modify_count:number,login_id: string,default_g_id:number,authority_lv:number };
interface ILogOutActionType { type: string };
