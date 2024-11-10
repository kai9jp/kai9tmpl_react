import React, { Dispatch, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IStateType, ISqlState } from "../../store/models/root.interface";
import { ISql, SqlModificationStatus } from "../../store/models/sql.interface";
import moment from 'moment';
import { setModificationState } from "../../store/actions/sql.action";
import styles from "./SqlHistoryList.module.css";

export type sqlListProps = {
  children?: React.ReactNode;
};


function SqlHistoryList(props: sqlListProps): JSX.Element  {
  const sqls: ISqlState = useSelector((state: IStateType) => state.sqls);
  const dispatch: Dispatch<any> = useDispatch();

  //行選択用の変数と関数
  const [select_record, setselect_record] = useState<ISql | null>(null);
  function onSelect(record: ISql): void {
    setselect_record(record);
  }

  const sqlElements: (JSX.Element | null)[] = sqls.SqlHistorys.map(sql => {
    if (!sql) { return null; }
    return (
      <tr className={`${styles.tablerow} ${(select_record && select_record.modify_count === sql.modify_count) ? styles.selected : ""} ${sql.delflg ? styles.deleted : ""}`}      
        onClick={() => {
          onSelect(sql);
        }}
        key={`sql_${sql.sql_pk}`}
      >
        <th scope="row">{sql.modify_count}</th>
        <td>{sql.sql_pk}</td>
        <td>{sql.sql_name}</td>
        <td>{sql.sql}</td>
        <td>{sql.memo}</td>
        <td>{sql.update_u_id}</td>
        <td>{moment(sql.update_date).format('YYYY/MM/DD HH:mm:ss')}</td>
        <td>{sql.delflg? "〇":""}</td>
      </tr>);
  });

  function cancelForm(): void {
    dispatch(setModificationState(SqlModificationStatus.None));
  }

  return (
    <div className="row">
      <div className="col-xl-12">
        <div className="card shadow mb-4">
          <div className="card-header" id="sql_history_header">

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h6 className="mt-3 font-weight-bold text-green col-md-5 ">変更履歴</h6>
              <i className={`fas fa fa-history fa-2x ${styles.historyPosition}`} title="履歴"></i>

              <button type="submit" className="btn btn-dark  ml-2" onClick={() => cancelForm()}>
                  ×
              </button>
            </div>  

            <hr></hr>
            <div className="card-body">
              <div className={`table-responsive ${styles.portlet400}`}>
                <table className="table">
                  <thead className="thead-light ">
                    <tr>
                      <th scope="col">更新回数</th>
                      <th scope="col">ID</th>
                      <th scope="col">SQL名</th>
                      <th scope="col">SQL</th>
                      <th scope="col">備考</th>
                      <th scope="col">更新者</th>
                      <th scope="col">更新日時</th>
                      <th scope="col">削除フラグ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sqlElements}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default SqlHistoryList;
