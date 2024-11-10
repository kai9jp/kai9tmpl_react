import axios, { AxiosRequestConfig } from "axios";
import Swal from "sweetalert2";
import { logout } from "../store/actions/account.actions";
import { API_URL } from "./constants";
import store from '../store/store';

//数値以外の場合、デフォルトを返す
export function toNumberDef(value: any,def: number): number {
  const num = Number(value);
  return isNaN(num) ? def : num;
}

//APIをコール
export async function callApi(url: string, data: any, c_type: string, IsBlob?: boolean, errorCallback?: () => void): Promise<any> {
  const URL = API_URL+'/api/'+url;
  const options: AxiosRequestConfig = {
    withCredentials: true,
    headers: { 'content-type': c_type },
  };
  if (IsBlob){
    options.responseType = 'blob';
  }
  return await axios.post(URL, data, options)
  .then(function (response) {
    if (response.data.return_code!==200){
      if (response.data.return_code==2){
        //トークンが無い状態の場合、ログイン画面に遷移させる
        store.dispatch(logout());
        return;
      }
    }

    if (response.data.return_code && response.data.return_code != 200) {
      // 同期エラーコールバックの呼び出し
      if (errorCallback) {
        errorCallback();
      }
      Swal.fire({
        title: 'Error!',
        html: response.data.msg.replace(/\n/g, '<br><br>'), // 改行コードを<br>に置換
        icon: 'error',
        confirmButtonText: 'OK'
    });
    }

    return response;
  })
  .catch(function (error: { msg: string;message: any; response?: { data: { msg: string,message: string } } }) {
    let errorMessage = "";
    
    errorMessage += error.message + '<BR>';
    if (error.response && error.response.data && error.response.data.msg) {
        errorMessage += error.response.data.msg + '<BR>';
    }    
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage += error.response.data.message + '<BR>';
    }    

    // BLOBの場合、エラーを変換して取り出す
    const extractBlobError = new Promise<void>((resolve) => {
      if (IsBlob && error.response && error.response.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = function(event) {
          if (event.target && typeof event.target.result === 'string') {
            try {
              const parsedError = JSON.parse(event.target.result);
              errorMessage += parsedError.msg + '<BR>';  
              Swal.fire({
                title: 'Error!',
                html: `<div style="text-align: left;">${decodeURIComponent(errorMessage).replace(/\n/g, '<br>')}</div>`,
                icon: 'error',
                confirmButtonText: 'OK'
            });              
            } catch (e) {
              errorMessage += e + '<BR>';
            }
          }
          resolve();
        };
        reader.readAsText(error.response.data);
      } else {
        resolve();
      }
    });
    
    extractBlobError.then(() => {
      // 同期エラーコールバックの呼び出し
      if (errorCallback) {
        errorCallback();
      }
    });

    //// 改行コードを<br>に置換
    const msg = errorMessage.replace(/\n/g, '<br><br>').replace('<br>','');
    Swal.fire({
      title: 'Error!',
      html: `<div style="text-align: left;">${decodeURIComponent(msg).replace(/\n/g, '<br>')}</div>`,
      icon: 'error',
      confirmButtonText: 'OK'
    });
        
    return null;
  })
}

// APIをコールしてユーザを認証するための関数
export async function authenticateUser(API_URL: any, formState: { login_id: { value: any; }; password: { value: any; }; }) {
  try {
    // 認証APIのURLを組み立てる
    const utl = `${API_URL}/api/auth`;
    // APIリクエストを送信する
    const response = await axios.get(utl, {
      // リクエストボディに認証情報を設定する
      auth: {
        username: formState.login_id.value,
        password: formState.password.value,
      },
      // クッキーを送信するためにwithCredentialsをtrueに設定する
      withCredentials: true,
    });
    // レスポンスのreturn_codeが存在して、200以外の場合はエラーをスローする
    if (response.data.return_code && response.data.return_code != 200) {
      throw new Error(response.data.msg);
    }
    // レスポンスを返す
    return response;
  } catch (err: any) {
    let errorMessage = err.message;
    // レスポンスのmsgが存在する場合は、エラーメッセージに追加する
    if (err.response && err.response.data && err.response.data.msg) {
        errorMessage += '<BR>' + err.response.data.msg;
    }    

    if (err.response && err.response.status && err.response.status === 401){
      // 401認証エラーの場合、エラーダイアログを表示する
      throw new Error('認証エラー');
    }

    // エラーダイアログを表示する(その他エラー)
    Swal.fire({
      title: 'Error!',
      html: errorMessage,
      icon: 'error',
      confirmButtonText: 'OK'
    });
    // nullを返す
    return null;
  }
}
