import React, { useState, FormEvent, Dispatch, Fragment,useEffect } from "react";
import { IStateType, IApp_envState,INotificationState } from "../../store/models/root.interface";
import { useSelector, useDispatch } from "react-redux";
import { IApp_env, App_envModificationStatus } from "../../store/models/app_env.interface";
import TextInput from "../../common/components/TextInput";
import TextArea from "../../common/components/TextArea";
import NumberInput from "../../common/components/NumberInput";
import { addNotification } from "../../store/actions/notifications.action";
import { OnChangeModel } from "../../non_common/types/Form.types";
import {AUT_NUM_ADMIN,REMOVE_NOTIFICATION_SECONDS} from "../../common/constants";
import { IAccount } from "../../store/models/account.interface";
import { callApi } from "../../common/comUtil";

export type App_envFormProps = {
  FindApp_env:any
  historyButton:any
}
const App_envForm = (props:App_envFormProps) =>  {
  //useDispatchとuseSelectorでstate内のApp_envsを宣言し簡易的に割当
  const dispatch: Dispatch<any> = useDispatch();
  const App_envs: IApp_envState | null = useSelector((state: IStateType) => state.app_envs);
  const notifications: INotificationState | null = useSelector((state: IStateType) => state.notifications);
  const account: IAccount = useSelector((state: IStateType) => state.account);
  

  //letで再代入が可能な変数を宣言
  //パイプ記号(|)でユニオン型(何れかの型)を宣言
  //デフォルト値にApp_envs.selectedApp_envの値を設定
  let App_env: IApp_env | null = App_envs.App_env;

  //constで再代入NGの変数を宣言
  const isCreate: boolean = (App_envs.modificationState === App_envModificationStatus.Create);


  //nullでなく、新規作成の場合、各項目に初期値を設定
  if (!App_env || isCreate) {
    App_env = {
      modify_count:0,
      dir_tmp:"",
      del_days_tmp:0,
      update_u_id:0,
      update_date:new Date
     };
  }


  //フォーム変数に値を設定するuseStateを定義
  const [formState, setFormState] = useState({
    modify_count: { error: "", value: App_env.modify_count },
    dir_tmp: { error: "", value: App_env.dir_tmp },
    del_days_tmp: { error: "", value: App_env.del_days_tmp },
    update_u_id: { error: "", value: App_env.update_u_id },
    update_date: { error: "", value: App_env.update_date },
  });

  //入力フォームの各項目に対するChangedイベント
  function hasFormValueChanged(model: OnChangeModel): void {
    //各フォーム変数に値やエラー値を格納する
    //...はスプレッド構文(配列の[]を外し分解した状態で渡す)を用い、変更が発生した箇所のstateだけ更新している
    setFormState({ ...formState, [model.field]: { error: model.error, value: model.value } });
  }

  //セレクトボックスの数値箇所だけを取り出す
  function ConvValueNum(str:String):number{
    if (str.indexOf(':') === -1){
      return Number(str);
    }else{
      var cut1 =str.substr(0, str.indexOf(':'));
      return Number(cut1);
    }
  }

  async function saveApp_env(e: FormEvent<HTMLFormElement>) {
    //デフォルトの動作では、現在のURLに対してフォームの送信を行うため、結果的にページがリロードされてしまう。それを防ぐための黒魔術。
    e.preventDefault();
    
    //入力チェックでNGの場合は何もしない
    if (isFormInvalid()) {
      return;
    }

    //変数へ記憶
    let post_App_env: IApp_env = {
      modify_count: formState.modify_count.value,
      dir_tmp: formState.dir_tmp.value,
      del_days_tmp: formState.del_days_tmp.value,
      update_u_id: formState.update_u_id.value,
      update_date: formState.update_date.value,
    };
    //APIに登録を発行
    if (App_envs){
      const response = await callApi('app_env_update', post_App_env,'application/json');
      if (response){
        // 送信成功時の処理

        dispatch(addNotification("環境マスタ", "登録しました"));
  
        //親画面の検索をコール
        props.FindApp_env();
      }
    }

  }
  
    function getDisabledClass(): string {
      let isError: boolean = isFormInvalid();
      return isError ? "disabled" : "";
    }

    //入力チェック
    function isFormInvalid(): boolean {
      return (
        formState.modify_count.error 
        || formState.dir_tmp.error
        || formState.del_days_tmp.error
        || formState.update_u_id.error
        || formState.update_date.error
        //入力必須
        || !formState.dir_tmp.value
      ) as unknown as boolean;
  }

  function makeTextArea(label:string,value:string,id:string) :JSX.Element {
    return(
      <TextArea
        id={id}
        field = {id}
        value={value}
        onChange={hasFormValueChanged}
        required={false}
        maxLength={300}
        label={label}
        rows = {1}
        cols = {120}
        placeholder={id}
        disabled={account.authority_lv != AUT_NUM_ADMIN}//参照専用の場合は編集不可
      />
    )
  }
  
  function makeTextInput(label:string,value:string,id:string,maxLength:number) :JSX.Element {
    return(
      <TextInput id={id}
        value={value}
        field={id}
        onChange={hasFormValueChanged}
        required={false}
        maxLength={maxLength}
        label={label}
        placeholder={id}
        disabled={account.authority_lv != AUT_NUM_ADMIN}//参照専用の場合は編集不可
      />
    )
  }

  function makeNumberInput(label:string,value:number,id:string) :JSX.Element {
    return(
      <div style={{ display: 'flex', alignItems: 'center'}}>
        <div style={{ flexBasis: '30%', textAlign: 'left' }}>
          <label htmlFor={id}>{label}</label>
        </div>
        <div style={{ flexBasis: '30%' }}>
          <NumberInput
            id={id}
            field={id}
            value={value}
            onChange={hasFormValueChanged}
            disabled={account.authority_lv != AUT_NUM_ADMIN} //参照専用の場合は編集不可
          />
        </div>
    </div>                
    )
  }

  //------------------------------------------------------------------
  //DB取得データの画面反映
  //------------------------------------------------------------------
  // FormField型は、オブジェクトの各キーに対応する値とエラーメッセージを持つオブジェクトです。
  type FormField<T> = {
    [key in keyof T]: { error: string; value: T[key] };
  };
  // IApp_env型を、formstate型に変換
  const transformApp_env = (App_env: IApp_env): FormField<IApp_env> => {
    const result: any = {};
    // App_envオブジェクトの各キーに対してループ処理
    for (const key of Object.keys(App_env) as (keyof IApp_env)[]) {
      // resultオブジェクトに、エラーメッセージと値を持つオブジェクトを追加
      result[key] = { error: "", value: App_env[key] };
    }
    // 変換されたresultオブジェクトを返す
    return result;
  };
  //App_envs.App_envをformStateに反映
  useEffect(() => {
    if (App_envs.App_env) {
      setFormState(transformApp_env(App_envs.App_env));
    }
  }, [App_envs.App_env]); 

  return (
    <Fragment>
      <div className="col-xl-7 col-lg-7">
        <div className="card shadow mb-4">
          <div className="card-header py-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h6 id="App_env_form_header" className="m-0 font-weight-bold text-green">環境マスタ {(isCreate ? "新規登録" : "更新[更新回数:"+formState.modify_count.value)+"]"}</h6>
            {props.historyButton}
          </div>
          <div className="card-body">
            <form onSubmit={saveApp_env} id="App_env_form">

              <div className="form-group" style={{width:"100%"}}>

                {makeTextArea("tmpフォルダ",formState.dir_tmp.value,"dir_tmp")}

                <br /> 
                <hr /> 

                {makeNumberInput("[経過日数]tmpフォルダ削除",formState.del_days_tmp.value,"del_days_tmp")}

                <br /> 
                <hr /> 

                <br /> 
              </div>

              {account.authority_lv != AUT_NUM_ADMIN? null:
                // アドミン権限の場合だけ登録ボタンが押せる
                <button type="submit" className={`btn btn-success left-margin ${getDisabledClass()}` }  >登録</button>  
              }
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  )
};

export default App_envForm;
