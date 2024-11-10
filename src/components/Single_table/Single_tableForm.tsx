//メモ
import React, { useState, FormEvent, Dispatch, Fragment, useEffect} from "react";
import { IStateType, ISingle_tableState,INotificationState } from "../../store/models/root.interface";
import { useSelector, useDispatch } from "react-redux";
import { ISingle_table, Single_tableModificationStatus } from "../../store/models/single_table.interface";
import TextInput from "../../common/components/TextInput";
import TextArea from "../../common/components/TextArea";
import NumberInput from "../../common/components/NumberInput";
import { editSingle_table, clearSelectedSingle_table, setModificationState, addSingle_table } from "../../store/actions/single_table.action";
import { addNotification } from "../../store/actions/notifications.action";
import Checkbox from "../../common/components/Checkbox";
import { OnChangeModel, ISingle_tableFormState } from "../../non_common/types/Form.types";
import {AUT_NUM_ADMIN, AUT_NUM_NORMAL, AUT_NUM_READ_ONLY} from "../../common/constants";
import { IAccount } from "../../store/models/account.interface";
import * as comUtil  from "../../common/comUtil";
import styles from "./Single_tableForm.module.css";
import { callApi } from "../../common/comUtil";
import SelectInput from "../../common/components/Select";
import moment from 'moment-timezone';

export type Single_tableFormProps = {
  setisNeedFind: any;
};

const Single_tableForm: React.FC<Single_tableFormProps> = (props) => {
  //useDispatchとuseSelectorでstate内のsingle_tablesを宣言し簡易的に割当
  const dispatch: Dispatch<any> = useDispatch();
  const single_tables: ISingle_tableState | null = useSelector((state: IStateType) => state.single_tables);
  const notifications: INotificationState | null = useSelector((state: IStateType) => state.notifications);
  const account: IAccount = useSelector((state: IStateType) => state.account);
  //【制御:開始】relation①
  const [SelectInput_related_table_related_pk_related_data_s, setSelectInput_related_table_related_pk_related_data_s] = useState([""]);
  const [SelectInput_related_table_related_pk_related_data_loading, setSelectInput_related_table_related_pk_related_data_loading] = useState(true);
  //【制御:終了】relation①
  

  //letで再代入が可能な変数を宣言
  //パイプ記号(|)でユニオン型(何れかの型)を宣言
  //デフォルト値にsingle_tables.selectedSingle_tableの値を設定
  let single_table: ISingle_table | null = single_tables.selectedSingle_table;

  //constで再代入NGの変数を宣言
  const isCreate: boolean = (single_tables.modificationState === Single_tableModificationStatus.Create);


  //nullでなく、新規作成の場合、各項目に初期値を設定
  if (!single_table || isCreate) {
    single_table = {
            //【制御:開始】対象カラム①
            s_pk:0,
            modify_count:0,
            natural_key1:"",
            natural_key21:"",
            natural_key22_33:"",
            natural_key31:"",
            natural_key32:"",
            fullwidth_limited:"",
            halfwidth_limited:"",
            halfwidth_alphabetical_limited:"",
            halfwidth_number_limited:"",
            halfwidth_symbol_limited:"",
            halfwidth_kana_limited:"",
            fullwidth_kana_limited:"",
            number_limited:0,
            small_number_point:0,
            number_real:0,
            number_double:0,
            normal_string:"",
            postal_code:"",
            phone_number:"",
            date:new Date,
            datetime:new Date,
            email_address:"",
            url:"",
            flg:false,
            regexp:"",
            memo:"",
            related_pk:0,
            update_u_id:0,
            update_date:new Date,
            delflg:false,
            update_user:"",//非DB項目
            //【制御:終了】対象カラム①
           };
  }


  //フォーム変数に値を設定するuseStateを定義
  const [formState, setFormState] = useState({
    //【制御:開始】対象カラム②
    s_pk: { error: "", value: single_table.s_pk },
    modify_count: { error: "", value: single_table.modify_count },
    natural_key1: { error: "", value: single_table.natural_key1 },
    natural_key21: { error: "", value: single_table.natural_key21 },
    natural_key22_33: { error: "", value: single_table.natural_key22_33 },
    natural_key31: { error: "", value: single_table.natural_key31 },
    natural_key32: { error: "", value: single_table.natural_key32 },
    fullwidth_limited: { error: "", value: single_table.fullwidth_limited },
    halfwidth_limited: { error: "", value: single_table.halfwidth_limited },
    halfwidth_alphabetical_limited: { error: "", value: single_table.halfwidth_alphabetical_limited },
    halfwidth_number_limited: { error: "", value: single_table.halfwidth_number_limited },
    halfwidth_symbol_limited: { error: "", value: single_table.halfwidth_symbol_limited },
    halfwidth_kana_limited: { error: "", value: single_table.halfwidth_kana_limited },
    fullwidth_kana_limited: { error: "", value: single_table.fullwidth_kana_limited },
    number_limited: { error: "", value: single_table.number_limited },
    small_number_point: { error: "", value: single_table.small_number_point },
    number_real: { error: "", value: single_table.number_real },
    number_double: { error: "", value: single_table.number_double },
    normal_string: { error: "", value: single_table.normal_string },
    postal_code: { error: "", value: single_table.postal_code },
    phone_number: { error: "", value: single_table.phone_number },
    date: { error: "", value: single_table.date },
    datetime: { error: "", value: single_table.datetime },
    email_address: { error: "", value: single_table.email_address },
    url: { error: "", value: single_table.url },
    flg: { error: "", value: single_table.flg },
    regexp: { error: "", value: single_table.regexp },
    memo: { error: "", value: single_table.memo },
    related_pk: { error: "", value: single_table.related_pk },
    update_u_id: { error: "", value: single_table.update_u_id },
    update_date: { error: "", value: single_table.update_date },
    delflg: { error: "", value: single_table.delflg },
    update_user: { error: "", value: single_table.update_user },//非DB項目
    //【制御:終了】対象カラム②
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

  async function saveSingle_table(e: FormEvent<HTMLFormElement>) {
  // async function saveSingle_table() {
    //https://qiita.com/yokoto/items/27c56ebc4b818167ef9e
    //event.preventDefaultメソッドは、submitイベントの発生元であるフォームが持つデフォルトの動作をキャンセルするメソッド
    //デフォルトの動作では、現在のURLに対してフォームの送信を行うため、結果的にページがリロードされてしまう。それを防ぐための黒魔術。
    e.preventDefault();

  //入力チェックでNGの場合は何もしない
    if (isFormInvalid()) {
      return;
    }

    //変数へ記憶
    let formData: ISingle_table = {
      //【制御:開始】対象カラム③
      s_pk: formState.s_pk.value,
      modify_count: formState.modify_count.value,
      natural_key1: formState.natural_key1.value,
      natural_key21: formState.natural_key21.value,
      natural_key22_33: formState.natural_key22_33.value,
      natural_key31: formState.natural_key31.value,
      natural_key32: formState.natural_key32.value,
      fullwidth_limited: formState.fullwidth_limited.value,
      halfwidth_limited: formState.halfwidth_limited.value,
      halfwidth_alphabetical_limited: formState.halfwidth_alphabetical_limited.value,
      halfwidth_number_limited: formState.halfwidth_number_limited.value,
      halfwidth_symbol_limited: formState.halfwidth_symbol_limited.value,
      halfwidth_kana_limited: formState.halfwidth_kana_limited.value,
      fullwidth_kana_limited: formState.fullwidth_kana_limited.value,
      number_limited: formState.number_limited.value,
      small_number_point: formState.small_number_point.value,
      number_real: formState.number_real.value,
      number_double: formState.number_double.value,
      normal_string: formState.normal_string.value,
      postal_code: formState.postal_code.value.replace(/-/g, ''),//-を取り除く
      phone_number: formState.phone_number.value,
      date: moment(formState.date.value).toDate(),//API連携時のタイムゾーン誤差を防ぐため、UTCからローカルタイムゾーンへの変換を行う
      datetime: moment(formState.datetime.value).toDate(),//API連携時のタイムゾーン誤差を防ぐため、UTCからローカルタイムゾーンへの変換を行う
      email_address: formState.email_address.value,
      url: formState.url.value,
      flg: formState.flg.value,
      regexp: formState.regexp.value,
      memo: formState.memo.value,
      related_pk: ConvValueNum(formState.related_pk.value.toString()),
      update_u_id: formState.update_u_id.value,
      update_date: formState.update_date.value,
      delflg: formState.delflg.value,
      update_user: ConvValueStr(formState.update_user.value.toString()),//非DB項目
      //【制御:終了】対象カラム③
    };
    //APIに登録を発行
    const url =  isCreate? 'single_table_create': 'single_table_update';
    //明示的にpayload(application/json)を指定しないとUTF-8フォーマットになり受信側で失敗する
    const response = await comUtil.callApi(url, formData,'application/json');

    if (single_tables){
      if (response){
        // 送信成功時の処理

        //登録で自動採番された番号を取得する
        //【制御:開始】対象カラム④
        formState.s_pk.value = Number(response.data.s_pk);
        formState.modify_count.value = Number(response.data.modify_count);
        //【制御:終了】対象カラム④

        //登録・更新処理に応じ「IAddSingle_tableActionType」型の関数を準備
        let saveSingle_tableFn: Function = (isCreate) ? addSingle_table : editSingle_table;

        //stateへの反映
        saveForm(formState, saveSingle_tableFn);

        //親画面に検索を指示
        props.setisNeedFind(true);
      }
    }
  }
  
  //レデュース側に反映(addSingle_table 又は editSingle_table がコールされる)
  function saveForm(formState: ISingle_tableFormState, saveFn: Function): void {
    if (single_table) {
      dispatch(saveFn({
        ...single_table,
        //【制御:開始】対象カラム⑤
        s_pk: formState.s_pk.value,
        modify_count: formState.modify_count.value,
        natural_key1: formState.natural_key1.value,
        natural_key21: formState.natural_key21.value,
        natural_key22_33: formState.natural_key22_33.value,
        natural_key31: formState.natural_key31.value,
        natural_key32: formState.natural_key32.value,
        fullwidth_limited: formState.fullwidth_limited.value,
        halfwidth_limited: formState.halfwidth_limited.value,
        halfwidth_alphabetical_limited: formState.halfwidth_alphabetical_limited.value,
        halfwidth_number_limited: formState.halfwidth_number_limited.value,
        halfwidth_symbol_limited: formState.halfwidth_symbol_limited.value,
        halfwidth_kana_limited: formState.halfwidth_kana_limited.value,
        fullwidth_kana_limited: formState.fullwidth_kana_limited.value,
        number_limited: formState.number_limited.value,
        small_number_point: formState.small_number_point.value,
        number_real: formState.number_real.value,
        number_double: formState.number_double.value,
        normal_string: formState.normal_string.value,
        postal_code: formState.postal_code.value,
        phone_number: formState.phone_number.value,
        date: formState.date.value,
        datetime: formState.datetime.value,
        email_address: formState.email_address.value,
        url: formState.url.value,
        flg: formState.flg.value,
        regexp: formState.regexp.value,
        memo: formState.memo.value,
        related_pk: ConvValueNum(formState.related_pk.value.toString()),
        update_u_id: formState.update_u_id.value,
        update_date: formState.update_date.value,
        delflg: formState.delflg.value,
        update_user: ConvValueStr(formState.update_user.value.toString()),//非DB項目
        //【制御:終了】対象カラム⑤
      }));

      //Notification表示
      dispatch(addNotification("シングル表", `【シングルID=${formState.s_pk.value}】登録しました`));  

      //フォームを初期化
      dispatch(clearSelectedSingle_table());
      //フォームを閉じる
      dispatch(setModificationState(Single_tableModificationStatus.None));
    }
  }

  //キャンセル(又は、閉じる)ボタン押下処理
  function cancelForm(): void {
    dispatch(setModificationState(Single_tableModificationStatus.None));
  }

  //登録ボタン押下処理
  function getDisabledClass(): string {
    let isError: boolean = isFormInvalid();
    return isError ? "disabled" : "";
  }

  //入力チェック
  function isFormInvalid(): boolean {
    return (
      //【制御:開始】対象カラム⑥
           formState.s_pk.error 
        || formState.modify_count.error
        || formState.natural_key1.error
        || formState.natural_key21.error
        || formState.natural_key22_33.error
        || formState.natural_key31.error
        || formState.natural_key32.error
        || formState.fullwidth_limited.error
        || formState.halfwidth_limited.error
        || formState.halfwidth_alphabetical_limited.error
        || formState.halfwidth_number_limited.error
        || formState.halfwidth_symbol_limited.error
        || formState.halfwidth_kana_limited.error
        || formState.fullwidth_kana_limited.error
        || formState.number_limited.error
        || formState.small_number_point.error
        || formState.number_real.error
        || formState.number_double.error
        || formState.normal_string.error
        || formState.postal_code.error
        || formState.phone_number.error
        || formState.date.error
        || formState.datetime.error
        || formState.email_address.error
        || formState.url.error
        || formState.flg.error
        || formState.regexp.error
        || formState.memo.error
        || formState.related_pk.error
        || formState.update_u_id.error
        || formState.update_date.error
        || formState.delflg.error
      //【制御:終了】対象カラム⑥
    ) as unknown as boolean;
  }

  //【制御:開始】relation②
  //selectInputに表示させるアイテムの検索
  async function single_table_related_table_related_pk_related_data_find_all_selectInput() {
    const response = await callApi('single_table_related_table_related_pk_related_data_find_all_selectInput', null,'application/x-www-form-urlencoded');
    if (response){
      const str = JSON.stringify(response.data.results);
      const data = JSON.parse(str);
      setSelectInput_related_table_related_pk_related_data_s(data);
    }
  }
  //selectInputに表示させるアイテムを返す
  function get_related_pk_value(related_pk: any): string {
    if (typeof related_pk == 'string' && related_pk.includes(':')) {
      //既にコンバート済の場合はそのまま返す
      return related_pk;
    }
    for (const str of SelectInput_related_table_related_pk_related_data_s) {
      let value = str.substr(0, str.indexOf(':'));
        if (related_pk == value) {
        return str;
      }
    }
    return "";
  }
  //初回ロード時にAPI検索
  useEffect(() => {
    const fetchData = async () => {
      try {
        await single_table_related_table_related_pk_related_data_find_all_selectInput();
      } finally {
        setSelectInput_related_table_related_pk_related_data_loading(false);
      }
    };
    fetchData();
  }, []); 
  //【制御:終了】relation②

  //【制御:開始】relation③
  if (SelectInput_related_table_related_pk_related_data_loading) {
    return <div>Loading...</div>;
  }
  //【制御:終了】relation③

  //-------------------------------------------------------------
  //レンダリング
  //-------------------------------------------------------------
  return (
    <Fragment>
      <div className="col-xl-7 col-lg-7">
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h6 id="single_table_form_header" className="m-0 font-weight-bold text-green">シングル表 {(isCreate ? "[新規登録]" : "更新["+"シングルID:"+formState.s_pk.value+"]")}</h6>

              <button type="submit" className="btn btn-dark  ml-2" id="close_btn" onClick={() => cancelForm()}>
                  ×
              </button>
            </div>  
          </div>

          <div className="card-body">
            <form onSubmit={saveSingle_table} id="single_table_form">
              {/* 【制御:挿入行]対象カラム⑦ */}

              {/* 【制御:開始】対象カラム⑦[TextInput] */}
              <div className="form-row form-group">
                <div className="col-md-12">
                  <TextInput id="natural_key1"
                    value={formState.natural_key1.value}
                    type="text"
                    field="natural_key1"
                    onChange={hasFormValueChanged}
                    required={true}
                    maxLength={10}
                    minLength={5}
                    label="ナチュラルキー1"
                    placeholder="natural_key1"
                    disabled={[AUT_NUM_READ_ONLY].includes(account.authority_lv)}//[参照専用]の場合は編集不可
                    Pattern_regexp= ""
                    Pattern_message= ""
                  />
                </div>
              </div>
              {/* 【制御:終了】対象カラム⑦[TextInput] */}

              {/* 【制御:開始】対象カラム⑦[TextInput] */}
              <div className="form-row form-group">
                <div className="col-md-12">
                  <TextInput id="natural_key21"
                    value={formState.natural_key21.value}
                    type="text"
                    field="natural_key21"
                    onChange={hasFormValueChanged}
                    required={true}
                    maxLength={10}
                    minLength={1}
                    label="ナチュラルキー2-1"
                    placeholder="natural_key21"
                    disabled={[AUT_NUM_READ_ONLY].includes(account.authority_lv)}//[参照専用]の場合は編集不可
                  />
                </div>
              </div>
              {/* 【制御:終了】対象カラム⑦[TextInput] */}

              {/* 【制御:開始】対象カラム⑦[TextInput] */}
              <div className="form-row form-group">
                <div className="col-md-12">
                  <TextInput id="natural_key22_33"
                    value={formState.natural_key22_33.value}
                    type="text"
                    field="natural_key22_33"
                    onChange={hasFormValueChanged}
                    required={true}
                    maxLength={10}
                    minLength={1}
                    label="ナチュラルキー2-2"
                    placeholder="natural_key22_33"
                    disabled={[AUT_NUM_READ_ONLY].includes(account.authority_lv)}//[参照専用]の場合は編集不可
                  />
                </div>
              </div>
              {/* 【制御:終了】対象カラム⑦[TextInput] */}

              {/* 【制御:開始】対象カラム⑦[TextInput] */}
              <div className="form-row form-group">
                <div className="col-md-12">
                  <TextInput id="natural_key31"
                    value={formState.natural_key31.value}
                    type="text"
                    field="natural_key31"
                    onChange={hasFormValueChanged}
                    required={true}
                    maxLength={10}
                    minLength={1}
                    label="ナチュラルキー3-1"
                    placeholder="natural_key31"
                    disabled={[AUT_NUM_READ_ONLY].includes(account.authority_lv)}//[参照専用]の場合は編集不可
                  />
                </div>
              </div>
              {/* 【制御:終了】対象カラム⑦[TextInput] */}

              {/* 【制御:開始】対象カラム⑦[TextInput] */}
              <div className="form-row form-group">
                <div className="col-md-12">
                  <TextInput id="natural_key32"
                    value={formState.natural_key32.value}
                    type="text"
                    field="natural_key32"
                    onChange={hasFormValueChanged}
                    required={true}
                    maxLength={10}
                    minLength={1}
                    label="ナチュラルキー3-2"
                    placeholder="natural_key32"
                    disabled={[AUT_NUM_READ_ONLY].includes(account.authority_lv)}//[参照専用]の場合は編集不可
                  />
                </div>
              </div>
              {/* 【制御:終了】対象カラム⑦[TextInput] */}

              {/* 【制御:開始】対象カラム⑦[TextInput] */}
              <div className="form-row form-group">
                <div className="col-md-12">
                  <TextInput id="fullwidth_limited"
                    value={formState.fullwidth_limited.value}
                    type="text"
                    field="fullwidth_limited"
                    onChange={hasFormValueChanged}
                    required={false}
                    maxLength={10}
                    minLength={2}
                    label="全角限定"
                    placeholder="fullwidth_limited"
                    disabled={[AUT_NUM_ADMIN, AUT_NUM_NORMAL, AUT_NUM_READ_ONLY].includes(account.authority_lv)}//[管理者], [一般], [参照専用]の場合は編集不可
                    Pattern_regexp= "^[^ -~｡-ﾟ]*$"
                    Pattern_message= "全角で入力して下さい"
                  />
                </div>
              </div>
              {/* 【制御:終了】対象カラム⑦[TextInput] */}

              {/* 【制御:開始】対象カラム⑦[TextInput] */}
              <div className="form-row form-group">
                <div className="col-md-12">
                  <TextInput id="halfwidth_limited"
                    value={formState.halfwidth_limited.value}
                    type="text"
                    field="halfwidth_limited"
                    onChange={hasFormValueChanged}
                    required={false}
                    maxLength={10}
                    minLength={3}
                    label="半角限定"
                    placeholder="halfwidth_limited"
                    disabled={[AUT_NUM_NORMAL, AUT_NUM_READ_ONLY].includes(account.authority_lv)}//[一般], [参照専用]の場合は編集不可
                    Pattern_regexp= "^[ -~｡-ﾟ]*$"
                    Pattern_message= "半角で入力して下さい"
                  />
                </div>
              </div>
              {/* 【制御:終了】対象カラム⑦[TextInput] */}

              {/* 【制御:開始】対象カラム⑦[TextInput] */}
              <div className="form-row form-group">
                <div className="col-md-12">
                  <TextInput id="halfwidth_alphabetical_limited"
                    value={formState.halfwidth_alphabetical_limited.value}
                    type="text"
                    field="halfwidth_alphabetical_limited"
                    onChange={hasFormValueChanged}
                    required={false}
                    maxLength={10}
                    label="半角英字限定"
                    placeholder="halfwidth_alphabetical_limited"
                    disabled={[AUT_NUM_NORMAL, AUT_NUM_READ_ONLY].includes(account.authority_lv)}//[一般], [参照専用]の場合は編集不可
                    Pattern_regexp= "^[a-zA-Z]*$"
                    Pattern_message= "半角英字で入力して下さい"
                  />
                </div>
              </div>
              {/* 【制御:終了】対象カラム⑦[TextInput] */}

              {/* 【制御:開始】対象カラム⑦[TextInput] */}
              <div className="form-row form-group">
                <div className="col-md-12">
                  <TextInput id="halfwidth_number_limited"
                    value={formState.halfwidth_number_limited.value}
                    type="text"
                    field="halfwidth_number_limited"
                    onChange={hasFormValueChanged}
                    required={false}
                    maxLength={10}
                    label="半角数字限定"
                    placeholder="halfwidth_number_limited"
                    disabled={[AUT_NUM_NORMAL, AUT_NUM_READ_ONLY].includes(account.authority_lv)}//[一般], [参照専用]の場合は編集不可
                    Pattern_regexp= "^[0-9]*$"
                    Pattern_message= "半角数字で入力して下さい"
                  />
                </div>
              </div>
              {/* 【制御:終了】対象カラム⑦[TextInput] */}

              {/* 【制御:開始】対象カラム⑦[TextInput] */}
              <div className="form-row form-group">
                <div className="col-md-12">
                  <TextInput id="halfwidth_symbol_limited"
                    value={formState.halfwidth_symbol_limited.value}
                    type="text"
                    field="halfwidth_symbol_limited"
                    onChange={hasFormValueChanged}
                    required={false}
                    maxLength={10}
                    label="半角記号限定"
                    placeholder="halfwidth_symbol_limited"
                    disabled={[AUT_NUM_NORMAL, AUT_NUM_READ_ONLY].includes(account.authority_lv)}//[一般], [参照専用]の場合は編集不可
                    Pattern_regexp = {"^([!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~\\\\]+)?$"}
                    Pattern_message= "半角記号で入力して下さい"
                  />
                </div>
              </div>
              {/* 【制御:終了】対象カラム⑦[TextInput] */}

              {/* 【制御:開始】対象カラム⑦[TextInput] */}
              <div className="form-row form-group">
                <div className="col-md-12">
                  <TextInput id="halfwidth_kana_limited"
                    value={formState.halfwidth_kana_limited.value}
                    type="text"
                    field="halfwidth_kana_limited"
                    onChange={hasFormValueChanged}
                    required={false}
                    maxLength={10}
                    label="半角カナ限定"
                    placeholder="halfwidth_kana_limited"
                    disabled={[AUT_NUM_ADMIN, AUT_NUM_READ_ONLY].includes(account.authority_lv)}//[管理者], [参照専用]の場合は編集不可
                    Pattern_regexp= "^([ｦ-ﾝﾞﾟ]|ﾞ|ﾟ)*$"
                    Pattern_message= "半角で入力して下さい"
                  />
                </div>
              </div>
              {/* 【制御:終了】対象カラム⑦[TextInput] */}

              {/* 【制御:開始】対象カラム⑦[TextInput] */}
              <div className="form-row form-group">
                <div className="col-md-12">
                  <TextInput id="fullwidth_kana_limited"
                    value={formState.fullwidth_kana_limited.value}
                    type="text"
                    field="fullwidth_kana_limited"
                    onChange={hasFormValueChanged}
                    required={false}
                    maxLength={10}
                    label="全角カナ限定"
                    placeholder="fullwidth_kana_limited"
                    disabled={[AUT_NUM_ADMIN, AUT_NUM_READ_ONLY].includes(account.authority_lv)}//[管理者], [参照専用]の場合は編集不可
                    Pattern_regexp= "^[ァ-ヶ]*$"
                    Pattern_message= "全角カナで入力して下さい"
                  />
                </div>
              </div>
              {/* 【制御:終了】対象カラム⑦[TextInput] */}
              {/* 【制御:開始】対象カラム⑦[NumberInput] */}
              <div className="form-row form-group">
                <div className="col-md-12">
                  <NumberInput
                    id="number_limited"
                    field = "number_limited"
                    value={formState.number_limited.value}
                    onChange={hasFormValueChanged}
                    label="数値限定"
                    max={10.0}
                    min={2.0}
                    disabled={[AUT_NUM_READ_ONLY].includes(account.authority_lv)}//[参照専用]の場合は編集不可
                  />
                </div>
              </div>
              {/* 【制御:終了】対象カラム⑦[NumberInput] */}
              {/* 【制御:開始】対象カラム⑦[NumberInput] */}
              <div className="form-row form-group">
                <div className="col-md-12">
                  <NumberInput
                    id="small_number_point"
                    field = "small_number_point"
                    value={formState.small_number_point.value}
                    onChange={hasFormValueChanged}
                    label="小数点"
                    max={555.55}
                    min={0.55}
                    disabled={[AUT_NUM_READ_ONLY].includes(account.authority_lv)}//[参照専用]の場合は編集不可
                  />
                </div>
              </div>
              {/* 【制御:終了】対象カラム⑦[NumberInput] */}
              {/* 【制御:開始】対象カラム⑦[NumberInput] */}
              <div className="form-row form-group">
                <div className="col-md-12">
                  <NumberInput
                    id="number_real"
                    field = "number_real"
                    value={formState.number_real.value}
                    onChange={hasFormValueChanged}
                    label="単精度浮動小数点数"
                    max={3.402823e+38}
                    min={-3.402823e+38}
                    disabled={[AUT_NUM_READ_ONLY].includes(account.authority_lv)}//[参照専用]の場合は編集不可
                  />
                </div>
              </div>
              {/* 【制御:終了】対象カラム⑦[NumberInput] */}
              {/* 【制御:開始】対象カラム⑦[NumberInput] */}
              <div className="form-row form-group">
                <div className="col-md-12">
                  <NumberInput
                    id="number_double"
                    field = "number_double"
                    value={formState.number_double.value}
                    onChange={hasFormValueChanged}
                    label="倍精度浮動小数点数"
                    max={1.797693e+308}
                    min={-1.797693e+308}
                    disabled={[AUT_NUM_READ_ONLY].includes(account.authority_lv)}//[参照専用]の場合は編集不可
                  />
                </div>
              </div>
              {/* 【制御:終了】対象カラム⑦[NumberInput] */}

              {/* 【制御:開始】対象カラム⑦[TextInput] */}
              <div className="form-row form-group">
                <div className="col-md-12">
                  <TextInput id="normal_string"
                    value={formState.normal_string.value}
                    type="text"
                    field="normal_string"
                    onChange={hasFormValueChanged}
                    required={false}
                    maxLength={10}
                    label="ノーマル文字列"
                    placeholder="normal_string"
                    
                  />
                </div>
              </div>
              {/* 【制御:終了】対象カラム⑦[TextInput] */}

              {/* 【制御:開始】対象カラム⑦[TextInput] */}
              <div className="form-row form-group">
                <div className="col-md-12">
                  <TextInput id="postal_code"
                    value={formState.postal_code.value}
                    type="text"
                    field="postal_code"
                    onChange={hasFormValueChanged}
                    required={false}
                    maxLength={8}
                    label="郵便番号"
                    placeholder="postal_code"
                    disabled={[AUT_NUM_READ_ONLY].includes(account.authority_lv)}//[参照専用]の場合は編集不可
                    Pattern_regexp = "^(\d{3}-?\d{4})?$"
                    Pattern_message= "郵便番号の入力形式が不正です"
                  />
                </div>
              </div>
              {/* 【制御:終了】対象カラム⑦[TextInput] */}

              {/* 【制御:開始】対象カラム⑦[TextInput] */}
              <div className="form-row form-group">
                <div className="col-md-12">
                  <TextInput id="phone_number"
                    value={formState.phone_number.value}
                    type="text"
                    field="phone_number"
                    onChange={hasFormValueChanged}
                    required={false}
                    maxLength={20}
                    label="電話番号"
                    placeholder="phone_number"
                    disabled={[AUT_NUM_READ_ONLY].includes(account.authority_lv)}//[参照専用]の場合は編集不可
                    Pattern_regexp = "^(\d{2,4}-?\d{2,4}-?\d{3,4})?$"
                    Pattern_message= "電話番号の入力形式が不正です"
                  />
                </div>
              </div>
              {/* 【制御:終了】対象カラム⑦[TextInput] */}

              {/* 【制御:開始】対象カラム⑦[TextInput] */}
              <div className="form-row form-group">
                <div className="col-md-12">
                  <TextInput id="date"
                    value={moment(formState.date.value).format('YYYY-MM-DD')}
                    type="date"
                    field="date"
                    onChange={hasFormValueChanged}
                    required={false}
                    label="日付"
                    placeholder="date"
                    disabled={[AUT_NUM_READ_ONLY].includes(account.authority_lv)}//[参照専用]の場合は編集不可
                  />
                </div>
              </div>
              {/* 【制御:終了】対象カラム⑦[TextInput] */}

              {/* 【制御:開始】対象カラム⑦[TextInput] */}
              <div className="form-row form-group">
                <div className="col-md-12">
                  <TextInput id="datetime"
                    value={moment(formState.datetime.value).format('YYYY-MM-DD HH:mm:ss')}
                    type="datetime-local"
                    field="datetime"
                    onChange={hasFormValueChanged}
                    required={false}
                    label="日時"
                    placeholder="datetime"
                    disabled={[AUT_NUM_READ_ONLY].includes(account.authority_lv)}//[参照専用]の場合は編集不可
                  />
                </div>
              </div>
              {/* 【制御:終了】対象カラム⑦[TextInput] */}
              {/* 【制御:開始】対象カラム⑦[TextArea] */}
              <div className="form-row form-group">
                <div className="col-md-12">
                  <TextArea id="email_address"
                    value={formState.email_address.value}
                    field="email_address"
                    onChange={hasFormValueChanged}
                    required={false}
                    label="メールアドレス"
                    placeholder="email_address"
                    rows = {4}
                    disabled={[AUT_NUM_READ_ONLY].includes(account.authority_lv)}//[参照専用]の場合は編集不可
                    maxLength={320}
                    Pattern_regexp = "^([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,})?$"
                    Pattern_message= "メールアドレスの入力形式が不正です"
                  />
                </div>
              </div>
              {/* 【制御:終了】対象カラム⑦[TextArea] */}
              {/* 【制御:開始】対象カラム⑦[TextArea] */}
              <div className="form-row form-group">
                <div className="col-md-12">
                  <TextArea id="url"
                    value={formState.url.value}
                    field="url"
                    onChange={hasFormValueChanged}
                    required={false}
                    label="URL"
                    placeholder="url"
                    rows = {4}
                    disabled={[AUT_NUM_READ_ONLY].includes(account.authority_lv)}//[参照専用]の場合は編集不可
                    Pattern_regexp = "^((https?|ftp):\/\/[^\s/$.?#].[^\s]*)?$"
                    Pattern_message= "URLの入力形式が不正です"
                  />
                </div>
              </div>
              {/* 【制御:終了】対象カラム⑦[TextArea] */}
              {/* 【制御:開始】対象カラム⑦[Checkbox] */}
              <div className="form-row form-group">
                <div className="col-md-12">
                  <Checkbox
                    id="flg"
                    field="flg"
                    value={formState.flg.value}
                    label="フラグ"
                    onChange={hasFormValueChanged}
                    disabled={[AUT_NUM_READ_ONLY].includes(account.authority_lv)}//[参照専用]の場合は編集不可
                    />
                </div>
              </div>
              {/* 【制御:終了】対象カラム⑦[Checkbox] */}
              {/* 【制御:開始】対象カラム⑦[TextArea] */}
              <div className="form-row form-group">
                <div className="col-md-12">
                  <TextArea id="regexp"
                    value={formState.regexp.value}
                    field="regexp"
                    onChange={hasFormValueChanged}
                    required={false}
                    label="正規表現"
                    placeholder="regexp"
                    rows = {4}
                    disabled={[AUT_NUM_READ_ONLY].includes(account.authority_lv)}//[参照専用]の場合は編集不可
                    Pattern_regexp= {"^[^0-9]+$"}
                    Pattern_message= "正規表現の入力形式が不正です"
                  />
                </div>
              </div>
              {/* 【制御:終了】対象カラム⑦[TextArea] */}
              {/* 【制御:開始】対象カラム⑦[TextArea] */}
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
              {/* 【制御:終了】対象カラム⑦[TextArea] */}
              {/* 【制御:開始】対象カラム⑦[SelectInput] */}
              <div className="form-row form-group">
                <div className="col-md-12">
                  <SelectInput
                      id="related_pk"
                      field="related_pk"
                      label="関連ID"
                      options={SelectInput_related_table_related_pk_related_data_s}
                      required={false}
                      onChange={hasFormValueChanged}
                      value={get_related_pk_value(formState.related_pk.value)}
                      disabled={[AUT_NUM_READ_ONLY].includes(account.authority_lv)}//[参照専用]の場合は編集不可
                      />
                </div>
              </div>
              {/* 【制御:終了】対象カラム⑦[SelectInput] */}
              {/* 【制御:開始】対象カラム⑦[Checkbox] */}
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
              {/* 【制御:終了】対象カラム⑦[Checkbox] */}
              <button type="button" className="btn btn-danger" onClick={() => cancelForm()}>キャンセル</button>
              <button type="submit" className={`btn btn-success left-margin ${getDisabledClass()}` } id="commit_btn" >登録</button>  
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Single_tableForm;
function validateField(field: string, value: any): string {
  throw new Error("Function not implemented.");
}
