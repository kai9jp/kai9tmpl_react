//メモ
import React, { useState, FormEvent, Dispatch, Fragment, useEffect} from "react";
import { IStateType, IRelated_tableState,INotificationState } from "../../store/models/root.interface";
import { useSelector, useDispatch } from "react-redux";
import { IRelated_table, Related_tableModificationStatus } from "../../store/models/related_table.interface";
import TextInput from "../../common/components/TextInput";
import TextArea from "../../common/components/TextArea";
import NumberInput from "../../common/components/NumberInput";
import { editRelated_table, clearSelectedRelated_table, setModificationState, addRelated_table } from "../../store/actions/related_table.action";
import { addNotification } from "../../store/actions/notifications.action";
import Checkbox from "../../common/components/Checkbox";
import { OnChangeModel, IRelated_tableFormState } from "../../non_common/types/Form.types";
import {AUT_NUM_ADMIN, AUT_NUM_NORMAL, AUT_NUM_READ_ONLY} from "../../common/constants";
import { IAccount } from "../../store/models/account.interface";
import * as comUtil  from "../../common/comUtil";
import styles from "./Related_tableForm.module.css";
import { callApi } from "../../common/comUtil";
import moment from 'moment-timezone';


export type Related_tableFormProps = {
  setisNeedFind: any;
};

const Related_tableForm: React.FC<Related_tableFormProps> = (props) => {
  //useDispatchとuseSelectorでstate内のrelated_tablesを宣言し簡易的に割当
  const dispatch: Dispatch<any> = useDispatch();
  const related_tables: IRelated_tableState | null = useSelector((state: IStateType) => state.related_tables);
  const notifications: INotificationState | null = useSelector((state: IStateType) => state.notifications);
  const account: IAccount = useSelector((state: IStateType) => state.account);
  

  //letで再代入が可能な変数を宣言
  //パイプ記号(|)でユニオン型(何れかの型)を宣言
  //デフォルト値にrelated_tables.selectedRelated_tableの値を設定
  let related_table: IRelated_table | null = related_tables.selectedRelated_table;

  //constで再代入NGの変数を宣言
  const isCreate: boolean = (related_tables.modificationState === Related_tableModificationStatus.Create);


  //nullでなく、新規作成の場合、各項目に初期値を設定
  if (!related_table || isCreate) {
    related_table = {
            related_pk:0,
            modify_count:0,
            related_data:"",
            update_u_id:0,
            update_date:new Date,
            delflg:false,
            update_user:"",//非DB項目
           };
  }


  //フォーム変数に値を設定するuseStateを定義
  const [formState, setFormState] = useState({
    related_pk: { error: "", value: related_table.related_pk },
    modify_count: { error: "", value: related_table.modify_count },
    related_data: { error: "", value: related_table.related_data },
    update_u_id: { error: "", value: related_table.update_u_id },
    update_date: { error: "", value: related_table.update_date },
    delflg: { error: "", value: related_table.delflg },
    update_user: { error: "", value: related_table.update_user },//非DB項目
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

  async function saveRelated_table(e: FormEvent<HTMLFormElement>) {
  // async function saveRelated_table() {
    //https://qiita.com/yokoto/items/27c56ebc4b818167ef9e
    //event.preventDefaultメソッドは、submitイベントの発生元であるフォームが持つデフォルトの動作をキャンセルするメソッド
    //デフォルトの動作では、現在のURLに対してフォームの送信を行うため、結果的にページがリロードされてしまう。それを防ぐための黒魔術。
    e.preventDefault();

  //入力チェックでNGの場合は何もしない
    if (isFormInvalid()) {
      return;
    }

    //変数へ記憶
    let formData: IRelated_table = {
      related_pk: formState.related_pk.value,
      modify_count: formState.modify_count.value,
      related_data: formState.related_data.value,
      update_u_id: formState.update_u_id.value,
      update_date: formState.update_date.value,
      delflg: formState.delflg.value,
      update_user: ConvValueStr(formState.update_user.value.toString()),//非DB項目
    };
    //APIに登録を発行
    const url =  isCreate? 'related_table_create': 'related_table_update';
    //明示的にpayload(application/json)を指定しないとUTF-8フォーマットになり受信側で失敗する
    const response = await comUtil.callApi(url, formData,'application/json');

    if (related_tables){
      if (response){
        // 送信成功時の処理

        //登録で自動採番された番号を取得する
        formState.related_pk.value = Number(response.data.related_pk);
        formState.modify_count.value = Number(response.data.modify_count);

        //登録・更新処理に応じ「IAddRelated_tableActionType」型の関数を準備
        let saveRelated_tableFn: Function = (isCreate) ? addRelated_table : editRelated_table;

        //stateへの反映
        saveForm(formState, saveRelated_tableFn);

        //親画面に検索を指示
        props.setisNeedFind(true);
      }
    }
  }
  
  //レデュース側に反映(addRelated_table 又は editRelated_table がコールされる)
  function saveForm(formState: IRelated_tableFormState, saveFn: Function): void {
    if (related_table) {
      dispatch(saveFn({
        ...related_table,
        related_pk: formState.related_pk.value,
        modify_count: formState.modify_count.value,
        related_data: formState.related_data.value,
        update_u_id: formState.update_u_id.value,
        update_date: formState.update_date.value,
        delflg: formState.delflg.value,
        update_user: ConvValueStr(formState.update_user.value.toString()),//非DB項目
      }));

      //Notification表示
      dispatch(addNotification("関連表", `【関連ID=${formState.related_pk.value}】登録しました`));  

      //フォームを初期化
      dispatch(clearSelectedRelated_table());
      //フォームを閉じる
      dispatch(setModificationState(Related_tableModificationStatus.None));
    }
  }

  //キャンセル(又は、閉じる)ボタン押下処理
  function cancelForm(): void {
    dispatch(setModificationState(Related_tableModificationStatus.None));
  }

  //登録ボタン押下処理
  function getDisabledClass(): string {
    let isError: boolean = isFormInvalid();
    return isError ? "disabled" : "";
  }

  //入力チェック
  function isFormInvalid(): boolean {
    return (
           formState.related_pk.error 
        || formState.modify_count.error
        || formState.related_data.error
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
              <h6 id="related_table_form_header" className="m-0 font-weight-bold text-green">関連表 {(isCreate ? "[新規登録]" : "更新["+"関連ID:"+formState.related_pk.value+"]")}</h6>

              <button type="submit" className="btn btn-dark  ml-2" id="close_btn" onClick={() => cancelForm()}>
                  ×
              </button>
            </div>  
          </div>

          <div className="card-body">
            <form onSubmit={saveRelated_table} id="related_table_form">
              

              
              <div className="form-row form-group">
                <div className="col-md-12">
                  <TextInput id="related_data"
                    value={formState.related_data.value}
                    type="text"
                    field="related_data"
                    onChange={hasFormValueChanged}
                    required={false}
                    maxLength={50}
                    label="関連データ"
                    placeholder="related_data"
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

export default Related_tableForm;
function validateField(field: string, value: any): string {
  throw new Error("Function not implemented.");
}
