import React, { Fragment, Dispatch, useState, useEffect, createRef, useRef} from "react";
import { ISingle_table,Single_tableModificationStatus } from "../../store/models/single_table.interface";
import { useDispatch, useSelector } from "react-redux";
import { IStateType,ISingle_tableState,INotificationState } from "../../store/models/root.interface";
import { ClearSingle_table,addSingle_table, editSingle_table,setModificationState,changeSelectedSingle_table, removeSingle_table, 
  clearSelectedSingle_table,setAllCount,
  ClearSingle_tablehistory,addSingle_tableHistory} from "../../store/actions/single_table.action";
 import { updateCurrentPath } from "../../store/actions/root.actions";
import Single_tableForm from "./Single_tableForm";
import Single_tableList from "./Single_tableList";
import Single_tableHistoryList from "./Single_tableHistoryList";
import {API_URL, AUT_NUM_ADMIN} from "../../common/constants";
import { addNotification } from "../../store/actions/notifications.action";
import Swal from 'sweetalert2';
import { IAccount } from "../../store/models/account.interface";
import SearchBar from "../../common/components/SearchBar";
import CustomTable from '../../common/components/CustomTableProps ';
import styles from "./Single_table.module.css";
import { callApi } from "../../common/comUtil";
import UploadModal from "../../common/components/Upload";
import LoadingIndicator from "../../common/components/LoadingIndicator";
import validateExcelFile from "../../common/components/validateExcelFile";

export type single_tablesProps = {
  children?: React.ReactNode;
};

function Single_tables(props: single_tablesProps): JSX.Element  {
  const dispatch: Dispatch<any> = useDispatch();
  const single_tables: ISingle_tableState = useSelector((state: IStateType) => state.single_tables);
  const Single_tablePagenationState = useSelector((state: IStateType) => state.single_tablePagenation);
  const account: IAccount = useSelector((state: IStateType) => state.account);
  const notifications: INotificationState | null = useSelector((state: IStateType) => state.notifications);
  
  //-------------------------------------------------------------
  //state(これらstateの初期化はページが遷移する度に行われる)
  //-------------------------------------------------------------
  //検索用
  const [findStr, setfindStr] = useState("");
  const [isDelDataShow, setisDelDataShow] = useState(false);
  const [isNeedFind, setisNeedFind] = useState(true);
  //フォーム表示用
  const [isContentOpen, setIsContentOpen] = useState(false);
  //履歴表示用
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  //ページネーション用
  const [CurrentPage, setCurrentPage] = useState(0);
  const [numberOfDisplaysPerpage, setnumberOfDisplaysPerpage] = useState(0);
  const [MyCurrentPage, setMyCurrentPage] = useState(0);
  const [MynumberOfDisplaysPerpage, setMynumberOfDisplaysPerpage] = useState(100);
  //取込ボタン用
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState<string | undefined>(undefined);
  const [progress_status_id, setProgress_status_id] = useState(0);
  const [progress_status_progress1, setProgress_status_progress1] = useState(0);
  const [progress_status_progress2, setProgress_status_progress2] = useState(0);


  //削除API発行
  async function Single_tableRemove() {
    const response = await callApi('single_table_delete', single_tables.selectedSingle_table,'application/json');
    if (response){
      //お知らせを出す
      if(single_tables.selectedSingle_table) {
        let msg = single_tables.selectedSingle_table.delflg ? 'の削除を取り消しました' : 'を削除しました';

        dispatch(addNotification("シングル表 削除", `【シングルID=${single_tables.selectedSingle_table.s_pk}】`+msg));

        //反転した後、削除になる場合、表示対象から除外する
        if (!single_tables.selectedSingle_table.delflg　&& !isDelDataShow){
          dispatch(removeSingle_table(single_tables.selectedSingle_table.s_pk));
        }

        //登録後の各値をリデュースへ反映
        single_tables.selectedSingle_table.modify_count = response.data.modify_count;
        single_tables.selectedSingle_table.delflg = !single_tables.selectedSingle_table.delflg;
        dispatch(editSingle_table(single_tables.selectedSingle_table));

      }
      dispatch(clearSelectedSingle_table());
    }
  }

  //検索(ページネーション)
  async function FindSingle_table() {
    const data = { limit: numberOfDisplaysPerpage,
                  offset: (CurrentPage-1)*numberOfDisplaysPerpage,
                  findstr:findStr,
                  isDelDataShow:isDelDataShow
                 };
    //「application/x-www-form-urlencoded」はURLエンコードした平文での送信
    const response = await callApi('single_table_find', data,'application/x-www-form-urlencoded');//「application/x-www-form-urlencoded」はURLエンコードした平文での送信
    if (response){
      //全ユーザを初期化
      dispatch(ClearSingle_table());

      //ノーヒット時はnullが返るので抜ける
      if (!response.data){return}
      
      //Ractのjson形式に変換(JavaのJsonが届くので)
      const str = JSON.stringify(response.data);
      //jsonを変換
      let single_table_array: Array<ISingle_table> = JSON.parse(str);
      
      if (single_table_array){
        //map関数は、指定したコールバック関数を配列の要素数分繰り返す(valueは引数であり、配列の各要素が入ってくる)
        //ここでは、配列の要素数だけaddしている
        if (single_table_array){
          single_table_array.map(value => (dispatch(addSingle_table(value))));
        }
      }
    }
  }

  //検索(履歴)
  async function FindSingle_tableHistory(s_pk:number) {
    const data = {s_pk: s_pk};
    //「application/x-www-form-urlencoded」はURLエンコードした平文での送信
    const response = await callApi('single_table_history_find', data,'application/x-www-form-urlencoded');
    if (response){

      //全履歴を初期化
      dispatch(ClearSingle_tablehistory());
      
      //Ractのjson形式に変換(JavaのJsonが届くので)
      const str = JSON.stringify(response.data);
      //jsonを変換
      let single_table_array: Array<ISingle_table> = JSON.parse(str);
      
      //map関数は、指定したコールバック関数を配列の要素数分繰り返す(valueは引数であり、配列の各要素が入ってくる)
      //ここでは、配列の要素数だけaddしている
      if (single_table_array){
        single_table_array.map(value => (dispatch(addSingle_tableHistory(value))));
      }
    }
  }


  //検索(件数)
  async function single_table_count() {
    const data = {findstr: findStr,isDelDataShow:isDelDataShow};
    const response = await callApi('single_table_count', data,'application/x-www-form-urlencoded');
    if (response){
      //Ractのjson形式に変換(JavaのJsonが届くので)
      const str = JSON.stringify(response.data);
      const data = JSON.parse(str);
      dispatch(setAllCount(data.count));
      FindSingle_table();
    }
  }

  //-------------------------------------------------------------
  //エクセルダウンロード
  //-------------------------------------------------------------
  const excelDownloadButton = async ()  => {

    // API(進捗管理用)
    setProgress_status_id(0);
    const progressStatusRequest = {
      processName: "single_table_ExportExcel"
    };
    const response1 = await callApi('progress_status_create', progressStatusRequest, 'application/json', false, handleErrorExport);
    let progress_status_id_tmp = 0;
    if (response1) {
      setProgress_status_id(response1.data.id);
      progress_status_id_tmp = response1.data.id;
    }else{
      return;
    }

    const relations: string[] = [
    //【制御:開始】relation④
    "related_pk=related_table_a.related_pk:related_table_a.related_data",
    //【制御:終了】relation④
    ];

    //パラメータ生成
    const data = { tableName: "single_table_a" , progress_status_id: progress_status_id_tmp.toString(),relations: relations};
    //API実行
    const response = await callApi('single_table_ExportExcel', JSON.stringify(data),'application/json',true, handleErrorExport);

    if (response && response.data){
      //進捗画面を非表示
      setProgress_status_id(0);

      //ダウンロードコンテンツ表示
      const blob = new Blob([response.data], { type: "application/octet-stream" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "シングル表.xlsx";
      a.click();
      a.remove();
      URL.revokeObjectURL(url); 
    }
  };
  // エラーコールバック関数
  function handleErrorExport() {
    //エクセルドラッグ画面を非表示
    //進捗状況の画面を非表示
    setProgress_status_id(0);
  }


  //-------------------------------------------------------------
  //レンダリング後に実行する処理
  //-------------------------------------------------------------
  useEffect(() => {
    //トップバーに表示するパスを反映
    dispatch(updateCurrentPath("single_table", "list"));

    //一覧検索
    if (isNeedFind || MyCurrentPage !=CurrentPage || MynumberOfDisplaysPerpage != numberOfDisplaysPerpage || isContentOpen==false){
      single_table_count();

      setisNeedFind(false);
      setMyCurrentPage(CurrentPage);
      setMynumberOfDisplaysPerpage(numberOfDisplaysPerpage);
    }

    //入力フォームの表示位置までスクロールする
    //https://blog.usize-tech.com/vertical-scroll-by-react/
    if (isContentOpen) {
      const checkElement = () => {
        const headerElement = document.getElementById("single_table_form_header");
        if (headerElement) {
          headerElement.scrollIntoView({ behavior: "smooth", block: "center" });
          setIsContentOpen(false);
        } else {
          //非同期処理により画面表示が遅れるので、最大2秒待つ
          setTimeout(checkElement, 100); // 100ms後に再試行
        }
      };
      setTimeout(checkElement, 100); // 初回実行
      setTimeout(() => setIsContentOpen(false), 2000); // 2秒後に強制終了
    }    

    //履歴の表示位置までスクロールする
    if (isHistoryOpen) {
      if (document.getElementById("single_table_history_header")){
        document.getElementById("single_table_history_header")!.scrollIntoView({behavior:"smooth",block:"center"});
        setIsHistoryOpen(false);
      }

    };
  }, [isContentOpen,Single_tablePagenationState,numberOfDisplaysPerpage,findStr,isDelDataShow,single_tables.selectedSingle_table,isHistoryOpen,,isNeedFind,CurrentPage]);



  //-------------------------------------------------------------
  //レンダリングパーツ
  //-------------------------------------------------------------

  // 追加ボタン
  async function onAdd() {
    setIsContentOpen(true);
    dispatch(setModificationState(Single_tableModificationStatus.Create));
  }
  const addButton = (
    (account.authority_lv == AUT_NUM_ADMIN) && // 権限が管理者の場合にボタンを表示
    <button className={`btn btn-sm btn-success ${styles.btnBlue}`} id="add_button" onClick={() => onAdd()}>
      <span>追加</span>
      <i className="fas fa-plus ml-1" title="追加"></i>
    </button>
  );

  // 変更ボタン
  async function onEdit() {
    setIsContentOpen(true);
    dispatch(setModificationState(Single_tableModificationStatus.Edit));
  }
  const editButton = (
    (account.authority_lv == AUT_NUM_ADMIN) && // 権限が管理者の場合にボタンを表示
    <button className={`btn btn-sm btn-success ${styles.btnGreen}`} id="edit_button" onClick={() => onEdit()}>
      <span>変更</span>
      <i className="fas fa-edit ml-1" title="変更"></i>
    </button>
  );

  // 削除ボタン
  async function onDel() {
    if(single_tables.selectedSingle_table) {
      let msg = single_tables.selectedSingle_table.delflg ? '削除を取り消しますか？' : '削除しますか？';
      Swal.fire({
        title: msg,
        icon: 'warning',
        showDenyButton: true,
        confirmButtonText: 'はい',
        denyButtonText: 'いいえ',
      }).then((result) => {
        if (result.isConfirmed) {
          // 削除処理
          Single_tableRemove();
        } else if (result.isDenied) {
          Swal.fire('削除を取り消しました', '', 'info')
        }
      })  
    }
  }
  const delButton = (
    (account.authority_lv == AUT_NUM_ADMIN) && // 権限が管理者の場合にボタンを表示
    <button className={`btn btn-sm btn-success ${styles.btnRed}`} id="del_button" onClick={() => onDel()}>
      <span>削除</span>
      <i className="fas fa-minus ml-1" title="削除"></i>
    </button>
  );

  // 履歴ボタン
  async function onHistory() {
    if(single_tables.selectedSingle_table) {
      await FindSingle_tableHistory(single_tables.selectedSingle_table.s_pk);
      setIsHistoryOpen(true);
      dispatch(setModificationState(Single_tableModificationStatus.History));
    }
  }
  const historyButton = (
    (account.authority_lv == AUT_NUM_ADMIN) && // 権限が管理者の場合にボタンを表示
    <button className={`btn btn-sm btn-success ${styles.btnBlack}`} id="history_button" onClick={() => onHistory()}>
      <span>履歴</span>
      <i className="fas fa-history ml-1" title="履歴"></i>
    </button>
  );

  // エクスポートボタン
  const exportButton = (
    <button className={`btn btn-sm btn-success ${styles.btnGray}`}  onClick={() => excelDownloadButton()}>
      <span>排出</span>
      <i className="fas fa-file-export ml-1" title="エクスポート"></i>
    </button>
  );

  // インポートボタン
  const importButton = (
    <button className={`btn btn-sm btn-success ${styles.btnGray}`}  onClick={() => excelImportHandleOpenModal()}>
      <span>取込</span>
      <i className="fas fa-file-import ml-1" title="インポート"></i>
    </button>
  );


  //-------------------------------------------------------------
  //エクセルインポート
  //-------------------------------------------------------------
  // エラーコールバック関数
  function excelImportHandleError() {
    //エクセルドラッグ画面を非表示
    setIsModalOpen(false);
    setModalMessage(undefined);
    //進捗状況の画面を非表示
    setProgress_status_id(0);
  }
  // インポートボタン用
  const excelImportHandleExcelDrop = async (blob: Blob, filename: string) => {
    if (!blob) {
      Swal.fire('ファイルが正しくドロップされませんでした', '', 'error');
      return;
    }

    const values = {};
    //【制御:開始】relation①
    //コード値チェック用
    const apivalues_single_table_related_table_related_pk_related_data_find_all_selectInput = await single_table_related_table_related_pk_related_data_find_all_selectInput();
    Object.assign(values, { apivalues_single_table_related_table_related_pk_related_data_find_all_selectInput: apivalues_single_table_related_table_related_pk_related_data_find_all_selectInput });
    //【制御:終了】relation①
    
    // エクセルファイルの入力チェックを実行
    if (blob) {
      const tableName = "single_table_a"; 
      if (!await validateExcelFile(blob, customChecks, tableName,values)) {
        return;
      }
    }

    // API(進捗管理用)
    setProgress_status_id(0);
    const progressStatusRequest = {
      processName: "single_table_ImportExcel"
    };
    const response1 = await callApi('progress_status_create', progressStatusRequest, 'application/json', false, excelImportHandleError);
    let progress_status_id_tmp = 0;
    if (response1) {
      setProgress_status_id(response1.data.id);
      progress_status_id_tmp = response1.data.id;
    }

    // API(登録用)
    const formData = new FormData();
    formData.append('file_excel', blob, filename);
    formData.append('tableName', "single_table_a");
    formData.append('progress_status_id', progress_status_id_tmp.toString());
    //リレーション
    const relations : string[] = [
      //【制御:開始】relation⑤
      "related_pk=related_table_a.related_pk:related_table_a.related_data",
      //【制御:終了】relation⑤
    ];
    formData.append('relations', JSON.stringify(relations));

    const url = 'single_table_ImportExcel';
    const response = await callApi(url, formData, 'multipart/form-data', true,excelImportHandleError);
    if (response && response.data){
      if (response.status == 200) {//正常時のみ
        //結果(エクセルファイル)をダウンロード
        const blob = new Blob([response.data], { type: "application/octet-stream" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        // a.download = filename;でも良い
        a.download = decodeURIComponent(response.headers.originalfilename);
        a.click();
        a.remove();
        URL.revokeObjectURL(url); 
      }

      //進捗ゲージを非表示
      setProgress_status_id(0);

      //ドラッグ画面を非表示
      setIsModalOpen(false);
      setModalMessage(undefined);
    
      // 登録が成功したので再検索
      FindSingle_table();

      if (response.status == 200) {//正常時のみ
        //登録結果の件数を表示
        Swal.fire({
          title: '登録結果', 
          html: `<div style="text-align: left;">${decodeURIComponent(response.headers.msg).replace(/\n/g, '<br>')}</div>`,
          icon: 'info',
          confirmButtonText: 'OK'
        });    
      }
    
    }
  };
  // インポートボタン用
  const excelImportHandleCloseModal = () => {
    setIsModalOpen(false);
    setModalMessage(undefined);
  };
  const excelImportHandleOpenModal = () => {
    setIsModalOpen(true);
  };
  // 中止処理
  const setProgress_status_stop = async () => {
    // API(中止用)
    const data = { id: progress_status_id };
    const response = await callApi('progress_status_stop', data, 'application/x-www-form-urlencoded', false);
    if (response) {
    }
  }
  //ポーリングによる進捗状況表示
  useEffect(() => {
    // 進行状況の開始
    if (progress_status_id !== 0) {
      const fetchData = async () => { // 非同期関数を定義
        const data = { id: progress_status_id };
        const response = await callApi('progress_status_check', data, 'application/x-www-form-urlencoded',false,excelImportHandleError);
        if (response) {
          setProgress_status_progress1(response.data.progress1);
          setProgress_status_progress2(response.data.progress2);
        }else{
          return;
        }
      };
      const interval = setInterval(() => {
        fetchData(); // fetchData関数を呼び出す
      }, 100); // 0.1秒ごとにポーリング

      return () => clearInterval(interval);
    }
  }, [progress_status_id]);

  //正規表現チェック関数
  function validateColumnFormat(row: any[], rowIndex: number, headers: string[], columnName: string, pattern: RegExp, errorMessage: string): string[] {
    const errors: string[] = []; // エラーメッセージを格納する配列
    const columnIndex = headers.indexOf(columnName); // カラム名からカラムのインデックスを取得
    if (columnIndex !== -1) { // カラムが存在する場合
      const value = row[columnIndex]; // 対象カラムの値を取得
      if (!pattern.test(value)) { // 値が正規表現パターンに一致しない場合
        errors.push(`行 ${rowIndex + 1} 列 ${columnName}: ${errorMessage}（値: ${row[columnIndex]}）。`); // エラーメッセージを追加
      }
    }
    return errors; // エラーメッセージの配列を返す
  }  

// 指定された値がAPIから取得したデータに存在するかをチェックする関数
function validateValueExists(row: any[], rowIndex: number, headers: string[], columnName: string, validValues: string[], errorMessage: string): string[] {
  const errors: string[] = [];
  const columnIndex = headers.indexOf(columnName);

  // リレーション
  let relations: string[] = [
    //【制御:開始】relation⑥
    "related_pk=related_table_a.related_pk:related_table_a.related_data",
    //【制御:終了】relation⑥
  ];

  if (columnIndex !== -1) {
    const value = row[columnIndex];
    
    // relationsに対象のカラムが含まれているか確認
    const isRelationColumn = relations.some(relation => relation.startsWith(`${columnName}=`));
    
    let checkValue = value;
    if (isRelationColumn) {
      // ":"で区切られた値の左側を抽出
      checkValue = value.split(':')[0];
    }

    const values = validValues.map(item => item.split(':')[0]); // 有効な値のリストを生成（":"の左側の数字）
    if (!values.includes(checkValue)) {
      errors.push(`行 ${rowIndex + 1} 列 ${columnName}: ${errorMessage}（値: ${row[columnIndex]}）。`);
    }
  }
  return errors;
}

  //【制御:開始】relation②
  //APIから有効なコード値のリストを取得する関数
  async function single_table_related_table_related_pk_related_data_find_all_selectInput(): Promise<string[]> {
    const response = await callApi('single_table_related_table_related_pk_related_data_find_all_selectInput', null, 'application/x-www-form-urlencoded');
    if (response) {
      const str = JSON.stringify(response.data.results);
      const data = JSON.parse(str);
      return data;
    }
    return [];
  }
    //【制御:終了】relation②

  // カスタムチェック関数
  async function customChecks(row: any[], rowIndex: number, headers: string[], types: string[], values: any): Promise<string[]> {
    const errors: string[] = [];

    //--------------------------------------------------------------
    //業務ロジックチェック
    //--------------------------------------------------------------
    // 例: 異常値チェック
    // const ageIndex = headers.indexOf('Age');
    // if (ageIndex !== -1 && row[ageIndex] < 0) {
    //   errors.push(`行 ${rowIndex + 3} 列 Age: 年齢は0以上でなければなりません。`);
    // }

    // 例: 整合性チェック
    // const startDateIndex = headers.indexOf('StartDate');
    // const endDateIndex = headers.indexOf('EndDate');
    // if (startDateIndex !== -1 && endDateIndex !== -1 && new Date(row[startDateIndex]) > new Date(row[endDateIndex])) {
    //   errors.push(`行 ${rowIndex + 3} 列 StartDate/EndDate: 開始日は終了日より前でなければなりません。`);
    // }

    //--------------------------------------------------------------
    //正規表現チェック
    //--------------------------------------------------------------
    {/* 【制御:開始】共通型宣言 */}
    let columnName = '';
    let errorMessage = '';
    {/* 【制御:終了】共通型宣言 */}
    {/* 【制御:開始】正規表現型宣言 */}
    let pattern: RegExp | null = null;
    {/* 【制御:終了】正規表現型宣言 */}
    {/* 【制御:開始】コード値型宣言 */}
    let validValues = [];
    {/* 【制御:終了】コード値型宣言 */}
    
    {/* 【制御:挿入行]正規表現チェック */}
    {/* 【制御:開始】正規表現チェック */}
    // 全角限定
    columnName = 'fullwidth_limited';
    pattern = /^[^\x20-\x7E｡-ﾟ]*$/;
    errorMessage = '全角で入力して下さい';
    errors.push(...validateColumnFormat(row, rowIndex, headers, columnName, pattern, errorMessage));
    {/* 【制御:終了】正規表現チェック */}

    {/* 【制御:開始】正規表現チェック */}
    // 半角限定
    columnName = 'halfwidth_limited';
    pattern = /^[\x20-\x7E｡-ﾟ]*$/;
    errorMessage = '半角で入力して下さい';
    errors.push(...validateColumnFormat(row, rowIndex, headers, columnName, pattern, errorMessage));
    {/* 【制御:終了】正規表現チェック */}

    {/* 【制御:開始】正規表現チェック */}
    // 半角英字限定
    columnName = 'halfwidth_alphabetical_limited';
    pattern = /^[a-zA-Z]*$/;
    errorMessage = '半角英字で入力して下さい';
    errors.push(...validateColumnFormat(row, rowIndex, headers, columnName, pattern, errorMessage));
    {/* 【制御:終了】正規表現チェック */}

    {/* 【制御:開始】正規表現チェック */}
    // 半角数字限定
    columnName = 'halfwidth_number_limited';
    pattern = /^[0-9]*$/;
    errorMessage = '半角数字で入力して下さい';
    errors.push(...validateColumnFormat(row, rowIndex, headers, columnName, pattern, errorMessage));
    {/* 【制御:終了】正規表現チェック */}

    {/* 【制御:開始】正規表現チェック */}
    // 半角記号限定
    columnName = 'halfwidth_symbol_limited';
    pattern = /^[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]*$/;
    errorMessage = '半角記号で入力して下さい';
    errors.push(...validateColumnFormat(row, rowIndex, headers, columnName, pattern, errorMessage));
    {/* 【制御:終了】正規表現チェック */}

    {/* 【制御:開始】正規表現チェック */}
    // 半角カナ限定
    columnName = 'halfwidth_kana_limited';
    pattern = /^[ｦ-ﾝﾞﾟ]*$/;
    errorMessage = '半角カナで入力して下さい';
    errors.push(...validateColumnFormat(row, rowIndex, headers, columnName, pattern, errorMessage));
    {/* 【制御:終了】正規表現チェック */}

    {/* 【制御:開始】正規表現チェック */}
    // 全角カナ限定
    columnName = 'fullwidth_kana_limited';
    pattern = /^[ァ-ヶ]*$/;
    errorMessage = '全角カナで入力して下さい';
    errors.push(...validateColumnFormat(row, rowIndex, headers, columnName, pattern, errorMessage));
    {/* 【制御:終了】正規表現チェック */}

    {/* 【制御:開始】正規表現チェック */}
    // 郵便番号
    columnName = 'postal_code';
    pattern = /^\d{3}-?\d{4}$/;
    errorMessage = '郵便番号の入力形式が不正です';
    errors.push(...validateColumnFormat(row, rowIndex, headers, columnName, pattern, errorMessage));
    {/* 【制御:終了】正規表現チェック */}

    {/* 【制御:開始】正規表現チェック */}
    // 電話番号
    columnName = 'phone_number';
    pattern = /^\d{2,4}-?\d{2,4}-?\d{3,4}$/;
    errorMessage = '電話番号の入力形式が不正です';
    errors.push(...validateColumnFormat(row, rowIndex, headers, columnName, pattern, errorMessage));
    {/* 【制御:終了】正規表現チェック */}

    {/* 【制御:開始】正規表現チェック */}
    // メールアドレス
    columnName = 'email_address';
    pattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    errorMessage = 'メールアドレスの形式が不正です';
    errors.push(...validateColumnFormat(row, rowIndex, headers, columnName, pattern, errorMessage));
    {/* 【制御:終了】正規表現チェック */}

    {/* 【制御:開始】正規表現チェック */}
    // URL
    columnName = 'url';
    pattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
    errorMessage = 'URLの入力形式が不正です';
    errors.push(...validateColumnFormat(row, rowIndex, headers, columnName, pattern, errorMessage));
    {/* 【制御:終了】正規表現チェック */}

    {/* 【制御:開始】正規表現チェック */}
    // 正規表現
    columnName = 'regexp';
    pattern = /^[^0-9]+$/;
    errorMessage = '入力形式が不正です';
    errors.push(...validateColumnFormat(row, rowIndex, headers, columnName, pattern, errorMessage));
    {/* 【制御:終了】正規表現チェック */}

    //--------------------------------------------------------------
    //コード値チェック
    //--------------------------------------------------------------

    // 関連ID
    //【制御:開始】relation③
    columnName = 'related_pk';
    errorMessage = '無効な値が入力されています';
    validValues = values['apivalues_single_table_related_table_related_pk_related_data_find_all_selectInput'];
    errors.push(...validateValueExists(row, rowIndex, headers, columnName, validValues, errorMessage));
    //【制御:終了】relation③

    return errors;
  }


  //-------------------------------------------------------------
  //その他
  //-------------------------------------------------------------

  //ヘッダーボタン各種の表示箇所
  const headerButtons = (
    <>
      <div className={styles.headerButtons}>
        {addButton}     {/* 追加ボタン */}
        {editButton}    {/* 変更ボタン */}
        {delButton}     {/* 削除ボタン */}
        {historyButton} {/* 履歴ボタン */}                      
        {exportButton}  {/* 排出ボタン */}                      
        {importButton}  {/* 取込ボタン */}                      
      </div>
    </>
  );

  //サーチバーの表示箇所
  const searchBar = (
    <>
      { (account.authority_lv == AUT_NUM_ADMIN)?// 権限が管理者の場合だけ表示する
        <div className="input-group">
          <SearchBar
            setFindStr={setfindStr}
            setIsNeedFind={setisNeedFind}
            // rendドラッグ機能で移動されてしまう事象を回避
            onMouseDown={(event: { stopPropagation: () => void; }) => {
              event.stopPropagation();
            }}            

/>                        
        </div>
      :""
      }
    </>
  );

  // テーブルの高さを管理するためのステート
  const [TableHeight, setTableHeight] = useState('auto');

  //テーブルの表示箇所
  function onSingle_tableSelect(Single_table: ISingle_table): void {
    dispatch(changeSelectedSingle_table(Single_table));
    dispatch(setModificationState(Single_tableModificationStatus.None));
    setIsContentOpen(false);
  }
  const tableContent = (
    <>
      <Single_tableList onSelect={onSingle_tableSelect}  height={TableHeight}/>
    </>
  );

  //タイトルの表示箇所
  const title = (
    <>
      <h6 className="font-weight-bold text-green">シングル表 一覧({single_tables.all_count}件)</h6>
    </>
  );

  //削除表示用チェックボックス
  const isDelDataShowHint = () => {
    Swal.fire({
      title: '「削除」スイッチについて',
      text: "ONにする事で削除済データも表示します。",
      icon: 'info',
      confirmButtonText: 'OK'
    })
  }
  const delDataShowCkeckboxContent = (
    <>
      <div className="form-check form-switch">
      {isDelDataShow ? 
        <input className="form-check-input" type="checkbox" id="flexSwitchCheckDelRecord" checked onClick={() => {setisNeedFind(true); setisDelDataShow(false)}}/>
      :<input className="form-check-input" type="checkbox" id="flexSwitchCheckDelRecord" onClick={() => {setisNeedFind(true); setisDelDataShow(true)}} /> 
      }
        <label className="form-check-label" >削除</label>
        <i className={`fa fa-question-circle ${styles.isDelDataShowHint}`} onClick={isDelDataShowHint}></i>
      </div>
      
    </>
  );

  const [CardFooterBottom, setCardFooterBottom] = useState(0);
  const contentRef = createRef<HTMLDivElement>();

  const getTotalHeight = (element: HTMLElement): number => {
    let totalHeight = element.clientHeight;
    element.childNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const childElement = node as HTMLElement;
        totalHeight += getTotalHeight(childElement);
      }
    });
    return totalHeight;
  };


  //-------------------------------------------------------------
  //レンダリング
  //-------------------------------------------------------------
  const CustomTableParentRef = useRef(null);

  return (
      <Fragment>
        
        {/* CustomTableの起点となるDOM要素 */}
        {/* borderをtransparentで指定する事で、中のコンテンツを覆うエレメントが出来る。borderが無い場合、覆わなくなる(原因不明) */}
        <div style={{border:"1px solid transparent",position: "relative",height: "100%"}} ref={CustomTableParentRef}>

          {/* カード */}
          <div ref={contentRef}>
          <CustomTable 
            title={title} 
            searchBar={searchBar}
            headerButtons={headerButtons} 
            tableContent={tableContent} 
            setTableHeight={setTableHeight}
            setCardFooterBottom={setCardFooterBottom}
            ParentRef={CustomTableParentRef}
            ComponentPositionsID="Single_table"
            delDataShowCkeckboxContent={delDataShowCkeckboxContent}
            //ページネーション用
            SetCurrentPage={setCurrentPage}
            setnumberOfDisplaysPerpage={setnumberOfDisplaysPerpage}
            numberOfDisplaysPerpage={numberOfDisplaysPerpage} //1ページの表示件数
            dataCounts={single_tables.all_count} //総件数数
            currentPage={MyCurrentPage} //現在の表示ページ
          />
          </div>


          {((single_tables.modificationState === Single_tableModificationStatus.Create)
            || (single_tables.modificationState === Single_tableModificationStatus.Edit && single_tables.selectedSingle_table)) ?
            <div style={{position: "absolute", top: CardFooterBottom+20+"px",width:"calc(100% - 10px)",left:"5px"}}>
              <Single_tableForm setisNeedFind={setisNeedFind}/> 
            </div>
          : 
            null
          }

          {(single_tables.modificationState === Single_tableModificationStatus.History)?
            <div style={{position: "absolute", top: CardFooterBottom+20+"px",width:"calc(100% - 10px)",left:"5px"}}>
              <Single_tableHistoryList /> 
            </div>
          : 
            null
          }

          {/* 取込ボタン用 */}
          <UploadModal
            title="Excelファイルのアップロード"
            msg={modalMessage}
            isOpen={isModalOpen}
            onClose={excelImportHandleCloseModal}
            handleExcelDrop={excelImportHandleExcelDrop}
          />          

          {progress_status_id != 0 && <LoadingIndicator progress1={progress_status_progress1} progress2={progress_status_progress2} setProgress_status_stop={setProgress_status_stop}/>}
    
        </div>

      </Fragment >
    );
  };

export default Single_tables;
