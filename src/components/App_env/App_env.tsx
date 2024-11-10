import React, { Fragment, Dispatch, useState, useEffect} from "react";
import { IApp_env,App_envModificationStatus } from "../../store/models/app_env.interface";
import { useDispatch, useSelector } from "react-redux";
import { IStateType,IApp_envState } from "../../store/models/root.interface";
import { setModificationState,ClearApp_envhistory,addApp_envHistory, setApp_env} from "../../store/actions/app_env.action";
 import { updateCurrentPath } from "../../store/actions/root.actions";
import App_envForm from "./App_envForm";
import App_envHistoryList from "./App_envHistoryList";
import {AUT_NUM_READ_ONLY} from "../../common/constants";
import { IAccount } from "../../store/models/account.interface";
import { callApi } from "../../common/comUtil";
import styles from "./App_env.module.css";

export type App_envsProps = {
  children?: React.ReactNode;
};

function App_envs(props: App_envsProps): JSX.Element  {
  const dispatch: Dispatch<any> = useDispatch();
  const App_envs: IApp_envState = useSelector((state: IStateType) => state.app_envs);
  dispatch(updateCurrentPath("App_env", "list"));
  const account: IAccount = useSelector((state: IStateType) => state.account);

  //フォーム表示用
  const [isContentOpen, setIsContentOpen] = useState(false);
  //履歴表示用
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);


  //検索(ページネーション)
  async function FindApp_env() {

    const response = await callApi('app_env_find', null,'application/x-www-form-urlencoded');
    if (response){
      const App_envArray = JSON.parse(response.data.data);

      if (Array.isArray(App_envArray) && App_envArray.length > 0) {
        const App_env: IApp_env = App_envArray[0]; // 配列の最初の要素を取得
        dispatch(setApp_env(App_env));
      }
    }
  }

  useEffect(() => {
    //一覧検索
    FindApp_env();

    //入力フォームの表示位置までスクロールする
    //https://blog.usize-tech.com/vertical-scroll-by-react/
    if (isContentOpen) {
      const checkElement = () => {
        const headerElement = document.getElementById("App_env_form_header");
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
      if (document.getElementById("App_env_history_header")){
        document.getElementById("App_env_history_header")!.scrollIntoView({behavior:"smooth",block:"center"});
        setIsHistoryOpen(false);
      }

    };
}, [isContentOpen,isHistoryOpen]);


//-----------------------------------------------------------
//履歴
//-----------------------------------------------------------
async function onApp_envHistory() {
  if(App_envs && App_envs.App_env) {
    await FindApp_envHistory();
    setIsHistoryOpen(true);
    dispatch(setModificationState(App_envModificationStatus.History));
  }
}
async function FindApp_envHistory() {
  const response = await callApi('app_env_history_find', null,'application/x-www-form-urlencoded');
  if (response){
    //全履歴を初期化
    dispatch(ClearApp_envhistory());

    const App_env_array: IApp_env[] = JSON.parse(response.data.data);
    if (App_env_array){
      App_env_array.map(value => (dispatch(addApp_envHistory(value))));
    }
  }
}
// 履歴ボタン
const historyButton = (
(account.authority_lv != AUT_NUM_READ_ONLY) && // 権限が参照専用でなければボタンを表示
<button className={`btn btn-sm btn-success ${styles.btnBlack}`} onClick={() => onApp_envHistory()}>
  <span>履歴</span>
  <i className="fas fa-history ml-1" title="履歴"></i>
</button>
);


return (
    <Fragment>
      
      <div className={styles.container}>
        <App_envForm FindApp_env={FindApp_env} historyButton={historyButton}/> 
      </div>

      {(App_envs.modificationState === App_envModificationStatus.History)?
        <App_envHistoryList /> : null
      }

    </Fragment >
  );
};

export default App_envs;
