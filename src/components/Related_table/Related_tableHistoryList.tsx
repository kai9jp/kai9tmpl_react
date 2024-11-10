import React, { Dispatch, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IStateType, IRelated_tableState } from "../../store/models/root.interface";
import { IRelated_table, Related_tableModificationStatus } from "../../store/models/related_table.interface";
import moment from 'moment';
import { setModificationState } from "../../store/actions/related_table.action";
import styles from "./Related_tableHistoryList.module.css";

export type related_tableListProps = {
  children?: React.ReactNode;
};


function Related_tableHistoryList(props: related_tableListProps): JSX.Element  {
  const related_tables: IRelated_tableState = useSelector((state: IStateType) => state.related_tables);
  const dispatch: Dispatch<any> = useDispatch();

  //行選択用の変数と関数
  const [select_record, setselect_record] = useState<IRelated_table | null>(null);
  function onSelect(record: IRelated_table): void {
    setselect_record(record);
  }

  const related_tableElements: (JSX.Element | null)[] = related_tables.Related_tableHistorys.map(related_table => {
    if (!related_table) { return null; }
    return (
      <tr className={`${styles.tablerow} ${(select_record && select_record.modify_count === related_table.modify_count) ? styles.selected : ""} ${related_table.delflg ? styles.deleted : ""}`}
        onClick={() => {
          onSelect(related_table);
        }}
        key={`related_table_${related_table.related_pk}`}
      >
        <th scope="row">{related_table.modify_count}</th>
        <td>{related_table.related_pk}</td>
        <td>{related_table.related_data}</td>
        <td>{related_table.update_u_id}</td>
        <td>{moment(related_table.update_date).format('YYYY/MM/DD HH:mm:ss')}</td>
        <td>{related_table.delflg? "〇":""}</td>
      </tr>);
  });

  function cancelForm(): void {
    dispatch(setModificationState(Related_tableModificationStatus.None));
  }

  return (
    <div className="row">
      <div className="col-xl-12">
        <div className="card shadow mb-4">
          <div className="card-header" id="related_table_history_header">

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
                      <th scope="col">関連ID</th>
                      <th scope="col">関連データ</th>
                      <th scope="col">更新者</th>
                      <th scope="col">更新日時</th>
                      <th scope="col">削除フラグ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {related_tableElements}
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

export default Related_tableHistoryList;
