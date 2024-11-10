import React from "react";
import { useSelector } from "react-redux";
import { IRelated_table } from "../../store/models/related_table.interface";
import { IStateType, IRelated_tableState} from "../../store/models/root.interface";
import moment from 'moment';
import styles from "./Related_tableList.module.css";

export type related_tableListProps = {
  onSelect?: (related_table: IRelated_table) => void;
  children?: React.ReactNode;
  height:any;
};

function Related_tableList(props: related_tableListProps): JSX.Element  {
  const related_tables: IRelated_tableState = useSelector((state: IStateType) => state.related_tables);

  const related_tableElements: (JSX.Element | null)[] = related_tables.Related_tables.map(related_table => {
    if (!related_table) { return null; }
    return (
      <tr className={`tableRow ${(related_tables.selectedRelated_table && related_tables.selectedRelated_table.related_pk === related_table.related_pk) ? `${styles.selected}` : ""} ${related_table.delflg === true ? `${styles.deleted}` : ""}`}
        onClick={() => {
          if(props.onSelect) props.onSelect(related_table);
        }}
        key={`related_table_${related_table.related_pk}`}
      >
        <th scope="row">{related_table.related_pk}</th>
        <td>{related_table.related_pk}</td>
        <td>{related_table.related_data}</td>
        <td>{related_table.update_user}</td>
        <td>{moment(related_table.update_date).format('YYYY/MM/DD HH:mm:ss')}</td>
        <td>{related_table.delflg? "〇":""}</td>
      </tr>
    );
  });

  return (
    <div className="table-responsive portlet"  style={{ maxHeight: props.height }}>
      <table className="table">
        <thead className="thead-light ">
          <tr>
            <th scope="col">#</th>
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

  );
}

export default Related_tableList;
