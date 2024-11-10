import React, { Dispatch, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IStateType, IApp_envState } from "../../store/models/root.interface";
import { IApp_env, App_envModificationStatus } from "../../store/models/app_env.interface";
import moment from 'moment';
import { setModificationState } from "../../store/actions/app_env.action";
import styles from "./App_envHistoryList.module.css";


export type App_envListProps = {
  children?: React.ReactNode;
};


function App_envHistoryList(props: App_envListProps): JSX.Element  {
  const App_envs: IApp_envState = useSelector((state: IStateType) => state.app_envs);
  const dispatch: Dispatch<any> = useDispatch();

  //行選択用の変数と関数
  const [select_record, setselect_record] = useState<IApp_env | null>(null);
  function onSelect(record: IApp_env): void {
    setselect_record(record);
  }

  const App_envElements: (JSX.Element | null)[] = App_envs.App_envHistorys.map(App_env => {
    if (!App_env) { return null; }
    return (<tr className={`${styles.tablerow} ${(select_record && select_record.modify_count === App_env.modify_count) ? styles.selected : ""}`}
      onClick={() => {
        onSelect(App_env);
      }}
      key={`App_env_${App_env.modify_count}`}
      >
      <th scope="row">{App_env.modify_count}</th>
      <td>{App_env.dir_tmp}</td>
      <td>{App_env.del_days_tmp}</td>
      <td>{App_env.update_u_id}</td>
      <td>{moment(App_env.update_date).format('YYYY/MM/DD HH:mm:ss')}</td>
    </tr>);
  });

  return (
    <div className="row">
      <div className="col-xl-12">
        <div className="card shadow mb-4">

          <div className="card-header" id="App_env_history_header">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h6 className="mt-3 font-weight-bold text-green col-md-5 ">変更履歴</h6>
              <i className={`fas fa fa-history fa-2x ${styles.historyposition}`} title="履歴"></i>
              <button type="submit" className={`btn btn-success ml-2 ${styles.btnBlack}`} onClick={() => {dispatch(setModificationState(App_envModificationStatus.None));}}>
                      ×
              </button>
            </div>
          </div>

          <div className="card-body">
            <div className={`table-responsive ${styles.portlet400}`}>
              <table className="table">
                <thead className="thead-light ">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">tmpフォルダ</th>
                    <th scope="col">[経過日数]tmpフォルダ削除</th>
                    <th scope="col">更新者</th>
                    <th scope="col">更新日時</th>
                  </tr>
                </thead>
                <tbody>
                  {App_envElements}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default App_envHistoryList;
