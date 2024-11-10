//メモ
import React, { useState, FormEvent, Dispatch, Fragment, useEffect} from "react";
import { IStateType, ISqlState,INotificationState } from "../../store/models/root.interface";
import { useSelector, useDispatch } from "react-redux";
import { ISql, SqlModificationStatus } from "../../store/models/sql.interface";
import TextInput from "../../common/components/TextInput";
import TextArea from "../../common/components/TextArea";
import NumberInput from "../../common/components/NumberInput";
import { editSql, clearSelectedSql, setModificationState, addSql } from "../../store/actions/sql.action";
import { addNotification } from "../../store/actions/notifications.action";
import Checkbox from "../../common/components/Checkbox";
import { OnChangeModel, ISqlFormState } from "../../non_common/types/Form.types";
import {AUT_NUM_ADMIN, AUT_NUM_NORMAL, AUT_NUM_READ_ONLY} from "../../common/constants";
import { IAccount } from "../../store/models/account.interface";
import * as comUtil  from "../../common/comUtil";
import styles from "./SqlForm.module.css";
import { callApi } from "../../common/comUtil";
import moment from 'moment-timezone';

const SqlForm: React.FC = () => {
  //useDispatchとuseSelectorでstate内のsqlsを宣言し簡易的に割当
  const dispatch: Dispatch<any> = useDispatch();
  const sqls: ISqlState | null = useSelector((state: IStateType) => state.sqls);
  const notifications: INotificationState | null = useSelector((state: IStateType) => state.notifications);
  const account: IAccount = useSelector((state: IStateType) => state.account);
  

  //letで再代入が可能な変数を宣言
  //パイプ記号(|)でユニオン型(何れかの型)を宣言
  //デフォルト値にsqls.selectedSqlの値を設定
  let sql: ISql | null = sqls.selectedSql;

  //constで再代入NGの変数を宣言
  const isCreate: boolean = (sqls.modificationState === SqlModificationStatus.Create);


  //nullでなく、新規作成の場合、各項目に初期値を設定
  if (!sql || isCreate) {
    sql = {
            sql_pk:0,
            modify_count:0,
            sql_name:"",
            sql:"",
            memo:"",
            update_u_id:0,
            update_date:new Date,
            delflg:false,
            update_user:"",//非DB項目
           };
  }


  //フォーム変数に値を設定するuseStateを定義
  const [formState, setFormState] = useState({
    sql_pk: { error: "", value: sql.sql_pk },
    modify_count: { error: "", value: sql.modify_count },
    sql_name: { error: "", value: sql.sql_name },
    sql: { error: "", value: sql.sql },
    memo: { error: "", value: sql.memo },
    update_u_id: { error: "", value: sql.update_u_id },
    update_date: { error: "", value: sql.update_date },
    delflg: { error: "", value: sql.delflg },
    update_user: { error: "", value: sql.update_user },//非DB項目
  });

  //入力フォームの各項目に対するChangedイベント
  function hasFormValueChanged(model: OnChangeModel): void {
    //各フォーム変数に値やエラー値を格納する
    //...はスプレッド構文(配列の[]を外し分解した状態で渡す)を用い、変更が発生した箇所のstateだけ更新している
    setFormState(prevState => ({
      ...prevState,
      [model.field as keyof typeof prevState]: {
          ...prevState[model.field as keyof typeof prevState],
          error: model.error,
          value: model.value
      }
  }));    

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
  //セレクトボックスの先頭文字箇所だけを取り出す
  function ConvValueStr(str:string):string{
    if (str.indexOf(':') === -1){
      return str;
    }else{
      return  str.substr(0, str.indexOf(':'));
    }
  }

  async function saveSql(e: FormEvent<HTMLFormElement>) {
  // async function saveSql() {
    //https://qiita.com/yokoto/items/27c56ebc4b818167ef9e
    //event.preventDefaultメソッドは、submitイベントの発生元であるフォームが持つデフォルトの動作をキャンセルするメソッド
    //デフォルトの動作では、現在のURLに対してフォームの送信を行うため、結果的にページがリロードされてしまう。それを防ぐための黒魔術。
    e.preventDefault();

  //入力チェックでNGの場合は何もしない
    if (isFormInvalid()) {
      return;
    }

    //変数へ記憶
    let formData: ISql = {
      sql_pk: formState.sql_pk.value,
      modify_count: formState.modify_count.value,
      sql_name: formState.sql_name.value,
      sql: formState.sql.value,
      memo: formState.memo.value,
      update_u_id: formState.update_u_id.value,
      update_date: formState.update_date.value,
      delflg: formState.delflg.value,
      update_user: ConvValueStr(formState.update_user.value.toString()),//非DB項目
    };
    //APIに登録を発行
    const url =  isCreate? 'sql_create': 'sql_update';
    //明示的にpayload(application/json)を指定しないとUTF-8フォーマットになり受信側で失敗する
    const response = await comUtil.callApi(url, formData,'application/json');

    if (sqls){
      if (response){
        // 送信成功時の処理

        //登録で自動採番された番号を取得する
        formState.sql_pk.value = Number(response.data.sql_pk);
        formState.modify_count.value = Number(response.data.modify_count);

        //登録・更新処理に応じ「IAddSqlActionType」型の関数を準備
        let saveSqlFn: Function = (isCreate) ? addSql : editSql;

        //stateへの反映
        saveForm(formState, saveSqlFn);
      }
    }
  }
  
  //レデュース側に反映(addSql 又は editSql がコールされる)
  function saveForm(formState: ISqlFormState, saveFn: Function): void {
    if (sql) {
      dispatch(saveFn({
        ...sql,
        sql_pk: formState.sql_pk.value,
        modify_count: formState.modify_count.value,
        sql_name: formState.sql_name.value,
        sql: formState.sql.value,
        memo: formState.memo.value,
        update_u_id: formState.update_u_id.value,
        update_date: formState.update_date.value,
        delflg: formState.delflg.value,
        update_user: ConvValueStr(formState.update_user.value.toString()),//非DB項目
      }));

      //Notification表示
      dispatch(addNotification("SQL", `【ID=${formState.sql_pk.value}】登録しました`));  

      //フォームを初期化
      dispatch(clearSelectedSql());
      //フォームを閉じる
      dispatch(setModificationState(SqlModificationStatus.None));
    }
  }

  //キャンセル(又は、閉じる)ボタン押下処理
  function cancelForm(): void {
    dispatch(setModificationState(SqlModificationStatus.None));
  }

  //登録ボタン押下処理
  function getDisabledClass(): string {
    let isError: boolean = isFormInvalid();
    return isError ? "disabled" : "";
  }

  //入力チェック
  function isFormInvalid(): boolean {
    return (
           formState.sql_pk.error 
        || formState.modify_count.error
        || formState.sql_name.error
        || formState.sql.error
        || formState.memo.error
        || formState.update_u_id.error
        || formState.update_date.error
        || formState.delflg.error
    ) as unknown as boolean;
  }



  //-------------------------------------------------------------
  //レンダリング
  //-------------------------------------------------------------
  return (
    <Fragment>
      <div className="col-xl-7 col-lg-7">
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h6 id="sql_form_header" className="m-0 font-weight-bold text-green">SQL {(isCreate ? "[新規登録]" : "更新["+"ID:"+formState.sql_pk.value+"]")}</h6>

              <button type="submit" className="btn btn-dark  ml-2" id="close_btn" onClick={() => cancelForm()}>
                  ×
              </button>
            </div>  
          </div>

          <div className="card-body">
            <form onSubmit={saveSql} id="sql_form">
              

              
              <div className="form-row form-group">
                <div className="col-md-12">
                  <TextInput id="sql_name"
                    value={formState.sql_name.value}
                    type="text"
                    field="sql_name"
                    onChange={hasFormValueChanged}
                    required={false}
                    maxLength={50}
                    label="SQL名"
                    placeholder="sql_name"
                    disabled={[AUT_NUM_READ_ONLY].includes(account.authority_lv)}//[参照専用]の場合は編集不可
                  />
                </div>
              </div>
              
              
              <div className="form-row form-group">
                <div className="col-md-12">
                  <TextArea id="sql"
                    value={formState.sql.value}
                    field="sql"
                    onChange={hasFormValueChanged}
                    required={false}
                    label="SQL"
                    placeholder="sql"
                    rows = {4}
                    disabled={[AUT_NUM_READ_ONLY].includes(account.authority_lv)}//[参照専用]の場合は編集不可
                  />
                </div>
              </div>
              
              
              <div className="form-row form-group">
                <div className="col-md-12">
                  <TextArea id="memo"
                    value={formState.memo.value}
                    field="memo"
                    onChange={hasFormValueChanged}
                    required={false}
                    label="備考"
                    placeholder="memo"
                    rows = {4}
                    disabled={[AUT_NUM_READ_ONLY].includes(account.authority_lv)}//[参照専用]の場合は編集不可
                  />
                </div>
              </div>
              
              
              <div className="form-row form-group">
                <div className="col-md-12">
                  <Checkbox
                    id="delflg"
                    field="delflg"
                    value={formState.delflg.value}
                    label="削除フラグ"
                    onChange={hasFormValueChanged}
                    disabled={[AUT_NUM_READ_ONLY].includes(account.authority_lv)}//[参照専用]の場合は編集不可
                    />
                </div>
              </div>
              
              <button type="button" className="btn btn-danger" onClick={() => cancelForm()}>キャンセル</button>
              <button type="submit" className={`btn btn-success left-margin ${getDisabledClass()}` } id="commit_btn" >登録</button>  
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default SqlForm;
function validateField(field: string, value: any): string {
  throw new Error("Function not implemented.");
}
