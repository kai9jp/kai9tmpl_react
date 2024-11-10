import React from "react";
import { useSelector } from "react-redux";
import { ISql } from "../../store/models/sql.interface";
import { IStateType, ISqlState} from "../../store/models/root.interface";
import moment from 'moment';
import styles from "./SqlList.module.css";

export type sqlListProps = {
  onSelect?: (sql: ISql) => void;
  children?: React.ReactNode;
  height:any;
};

function SqlList(props: sqlListProps): JSX.Element  {
  const sqls: ISqlState = useSelector((state: IStateType) => state.sqls);

  const sqlElements: (JSX.Element | null)[] = sqls.Sqls.map(sql => {
    if (!sql) { return null; }
    return (
      <tr className={`tableRow ${(sqls.selectedSql && sqls.selectedSql.sql_pk === sql.sql_pk) ? `${styles.selected}` : ""} ${sql.delflg === true ? `${styles.deleted}` : ""}`}
        onClick={() => {
          if(props.onSelect) props.onSelect(sql);
        }}
        key={`sql_${sql.sql_pk}`}
      >
        <th scope="row">{sql.sql_pk}</th>
        <td>{sql.sql_pk}</td>
        <td>{sql.sql_name}</td>
        <td>{sql.sql}</td>
        <td>{sql.memo}</td>
        <td>{sql.update_user}</td>
        <td>{moment(sql.update_date).format('YYYY/MM/DD HH:mm:ss')}</td>
        <td>{sql.delflg? "〇":""}</td>
      </tr>
    );
  });

  return (
    <div className="table-responsive portlet"  style={{ maxHeight: props.height }}>
      <table className="table">
        <thead className="thead-light ">
          <tr>
            <th scope="col">#</th>
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

  );
}

export default SqlList;
