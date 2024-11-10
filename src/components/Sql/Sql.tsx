import React, { Fragment, Dispatch, useState, useEffect, createRef, useRef} from "react";
import { ISql,SqlModificationStatus } from "../../store/models/sql.interface";
import { useDispatch, useSelector } from "react-redux";
import { IStateType,ISqlState,INotificationState } from "../../store/models/root.interface";
import { ClearSql,addSql, editSql,setModificationState,changeSelectedSql, removeSql, 
  clearSelectedSql,setAllCount,
  ClearSqlhistory,addSqlHistory} from "../../store/actions/sql.action";
 import { updateCurrentPath } from "../../store/actions/root.actions";
import SqlForm from "./SqlForm";
import SqlList from "./SqlList";
import SqlHistoryList from "./SqlHistoryList";
import {API_URL, AUT_NUM_ADMIN} from "../../common/constants";
import { addNotification } from "../../store/actions/notifications.action";
import Swal from 'sweetalert2';
import { IAccount } from "../../store/models/account.interface";
import SearchBar from "../../common/components/SearchBar";
import CustomTable from '../../common/components/CustomTableProps ';
import styles from "./Sql.module.css";
import { callApi } from "../../common/comUtil";
import UploadModal from "../../common/components/Upload";
import LoadingIndicator from "../../common/components/LoadingIndicator";
import validateExcelFile from "../../common/components/validateExcelFile";

export type sqlsProps = {
  children?: React.ReactNode;
};

function Sqls(props: sqlsProps): JSX.Element  {
  const dispatch: Dispatch<any> = useDispatch();
  const sqls: ISqlState = useSelector((state: IStateType) => state.sqls);
  const SqlPagenationState = useSelector((state: IStateType) => state.sqlPagenation);
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
  async function SqlRemove() {
    const response = await callApi('sql_delete', sqls.selectedSql,'application/json');
    if (response){
      //お知らせを出す
      if(sqls.selectedSql) {
        let msg = sqls.selectedSql.delflg ? 'の削除を取り消しました' : 'を削除しました';

        dispatch(addNotification("SQL 削除", `【ID=${sqls.selectedSql.sql_pk}】`+msg));

        //反転した後、削除になる場合、表示対象から除外する
        if (!sqls.selectedSql.delflg　&& !isDelDataShow){
          dispatch(removeSql(sqls.selectedSql.sql_pk));
        }

        //登録後の各値をリデュースへ反映
        sqls.selectedSql.modify_count = response.data.modify_count;
        sqls.selectedSql.delflg = !sqls.selectedSql.delflg;
        dispatch(editSql(sqls.selectedSql));

      }
      dispatch(clearSelectedSql());
    }
  }

  //検索(ページネーション)
  async function FindSql() {
    const data = { limit: numberOfDisplaysPerpage,
                  offset: (CurrentPage-1)*numberOfDisplaysPerpage,
                  findstr:findStr,
                  isDelDataShow:isDelDataShow
                 };
    //「application/x-www-form-urlencoded」はURLエンコードした平文での送信
    const response = await callApi('sql_find', data,'application/x-www-form-urlencoded');//「application/x-www-form-urlencoded」はURLエンコードした平文での送信
    if (response){
      //全ユーザを初期化
      dispatch(ClearSql());

      //ノーヒット時はnullが返るので抜ける
      if (!response.data){return}
      
      //Ractのjson形式に変換(JavaのJsonが届くので)
      const str = JSON.stringify(response.data);
      //jsonを変換
      let sql_array: Array<ISql> = JSON.parse(str);
      
      if (sql_array){
        //map関数は、指定したコールバック関数を配列の要素数分繰り返す(valueは引数であり、配列の各要素が入ってくる)
        //ここでは、配列の要素数だけaddしている
        if (sql_array){
          sql_array.map(value => (dispatch(addSql(value))));
        }
      }
    }
  }

  //検索(履歴)
  async function FindSqlHistory(sql_pk:number) {
    const data = {sql_pk: sql_pk};
    //「application/x-www-form-urlencoded」はURLエンコードした平文での送信
    const response = await callApi('sql_history_find', data,'application/x-www-form-urlencoded');
    if (response){

      //全履歴を初期化
      dispatch(ClearSqlhistory());
      
      //Ractのjson形式に変換(JavaのJsonが届くので)
      const str = JSON.stringify(response.data);
      //jsonを変換
      let sql_array: Array<ISql> = JSON.parse(str);
      
      //map関数は、指定したコールバック関数を配列の要素数分繰り返す(valueは引数であり、配列の各要素が入ってくる)
      //ここでは、配列の要素数だけaddしている
      if (sql_array){
        sql_array.map(value => (dispatch(addSqlHistory(value))));
      }
    }
  }


  //検索(件数)
  async function sql_count() {
    const data = {findstr: findStr,isDelDataShow:isDelDataShow};
    const response = await callApi('sql_count', data,'application/x-www-form-urlencoded');
    if (response){
      //Ractのjson形式に変換(JavaのJsonが届くので)
      const str = JSON.stringify(response.data);
      const data = JSON.parse(str);
      dispatch(setAllCount(data.count));
      FindSql();
    }
  }

  //-------------------------------------------------------------
  //エクセルダウンロード
  //-------------------------------------------------------------
  const excelDownloadButton = async ()  => {

    // API(進捗管理用)
    setProgress_status_id(0);
    const progressStatusRequest = {
      processName: "sql_ExportExcel"
    };
    const response1 = await callApi('progress_status_create', progressStatusRequest, 'application/json', false, handleErrorExport);
    let progress_status_id_tmp = 0;
    if (response1) {
      setProgress_status_id(response1.data.id);
      progress_status_id_tmp = response1.data.id;
    }else{
      return;
    }

    const data = { tableName: "sql_a" , progress_status_id: progress_status_id_tmp.toString()};
    const response = await callApi('sql_ExportExcel', data,'application/x-www-form-urlencoded',true, handleErrorExport);

    if (response && response.data){
      //進捗画面を非表示
      setProgress_status_id(0);

      //ダウンロードコンテンツ表示
      const blob = new Blob([response.data], { type: "application/octet-stream" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "SQL.xlsx";
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
    dispatch(updateCurrentPath("sql", "list"));

    //一覧検索
    if (isNeedFind || MyCurrentPage !=CurrentPage || MynumberOfDisplaysPerpage != numberOfDisplaysPerpage || isContentOpen==false){
      sql_count();

      setisNeedFind(false);
      setMyCurrentPage(CurrentPage);
      setMynumberOfDisplaysPerpage(numberOfDisplaysPerpage);
    }

    //入力フォームの表示位置までスクロールする
    //https://blog.usize-tech.com/vertical-scroll-by-react/
    if (isContentOpen) {
      const checkElement = () => {
        const headerElement = document.getElementById("sql_form_header");
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
      if (document.getElementById("sql_history_header")){
        document.getElementById("sql_history_header")!.scrollIntoView({behavior:"smooth",block:"center"});
        setIsHistoryOpen(false);
      }

    };
  }, [isContentOpen,SqlPagenationState,numberOfDisplaysPerpage,findStr,isDelDataShow,sqls.selectedSql,isHistoryOpen,,isNeedFind,CurrentPage]);



  //-------------------------------------------------------------
  //レンダリングパーツ
  //-------------------------------------------------------------

  // 追加ボタン
  async function onAdd() {
    setIsContentOpen(true);
    dispatch(setModificationState(SqlModificationStatus.Create));
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
    dispatch(setModificationState(SqlModificationStatus.Edit));
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
    if(sqls.selectedSql) {
      let msg = sqls.selectedSql.delflg ? '削除を取り消しますか？' : '削除しますか？';
      Swal.fire({
        title: msg,
        icon: 'warning',
        showDenyButton: true,
        confirmButtonText: 'はい',
        denyButtonText: 'いいえ',
      }).then((result) => {
        if (result.isConfirmed) {
          // 削除処理
          SqlRemove();
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
    if(sqls.selectedSql) {
      await FindSqlHistory(sqls.selectedSql.sql_pk);
      setIsHistoryOpen(true);
      dispatch(setModificationState(SqlModificationStatus.History));
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
    
    // エクセルファイルの入力チェックを実行
    if (blob) {
      const tableName = "sql_a"; 
      if (!await validateExcelFile(blob, customChecks, tableName,values)) {
        return;
      }
    }

    // API(進捗管理用)
    setProgress_status_id(0);
    const progressStatusRequest = {
      processName: "sql_ImportExcel"
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
    formData.append('tableName', "sql_a");
    formData.append('progress_status_id', progress_status_id_tmp.toString());
    const url = 'sql_ImportExcel';
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
      FindSql();

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
    if (columnIndex !== -1) {
      const value = row[columnIndex];
      const values = validValues.map(item => item.split(':')[0]); // 有効な値のリストを生成
      if (!values.includes(value)) {
        errors.push(`行 ${rowIndex + 1} 列 ${columnName}: ${errorMessage}（値: ${row[columnIndex]}）。`);
      }
    }
    return errors;
  }


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
    //--------------------------------------------------------------
    //コード値チェック
    //--------------------------------------------------------------

    // 関連ID

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
  function onSqlSelect(Sql: ISql): void {
    dispatch(changeSelectedSql(Sql));
    dispatch(setModificationState(SqlModificationStatus.None));
    setIsContentOpen(false);
  }
  const tableContent = (
    <>
      <SqlList onSelect={onSqlSelect}  height={TableHeight}/>
    </>
  );

  //タイトルの表示箇所
  const title = (
    <>
      <h6 className="font-weight-bold text-green">SQL 一覧({sqls.all_count}件)</h6>
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
            ComponentPositionsID="Sql"
            delDataShowCkeckboxContent={delDataShowCkeckboxContent}
            //ページネーション用
            SetCurrentPage={setCurrentPage}
            setnumberOfDisplaysPerpage={setnumberOfDisplaysPerpage}
            numberOfDisplaysPerpage={numberOfDisplaysPerpage} //1ページの表示件数
            dataCounts={sqls.all_count} //総件数数
            currentPage={MyCurrentPage} //現在の表示ページ
          />
          </div>


          {((sqls.modificationState === SqlModificationStatus.Create)
            || (sqls.modificationState === SqlModificationStatus.Edit && sqls.selectedSql)) ?
            <div style={{position: "absolute", top: CardFooterBottom+20+"px",width:"calc(100% - 10px)",left:"5px"}}>
              <SqlForm /> 
            </div>
          : 
            null
          }

          {(sqls.modificationState === SqlModificationStatus.History)?
            <div style={{position: "absolute", top: CardFooterBottom+20+"px",width:"calc(100% - 10px)",left:"5px"}}>
              <SqlHistoryList /> 
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

export default Sqls;
