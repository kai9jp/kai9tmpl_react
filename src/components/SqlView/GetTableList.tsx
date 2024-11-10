import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from 'moment';
import styles from "./GetTableList.module.css";
import { callApi } from "../../common/comUtil";

export type GetTableListProps = {
  sql:string;
  setSql:any;
  isFindTableData:boolean;
  setIsFindTableData:any;
  children?: React.ReactNode;
};

function GetTableList(props: GetTableListProps): JSX.Element {
  const [data, setData] = useState([]); // データを保持するstate
  const [columns, setColumns] = useState<string[]>([]); // カラム名を保持するstate
  
  // API呼び出し
  const findTableData = async () => {
    props.setIsFindTableData(false);
    setData([]); 
    if (!props.sql) return;

    const response = await callApi('get_table_list', {sql: props.sql},'application/json');
    if (response && response.data && response.data.data) {
      const result = JSON.parse(response.data.data);  // 元のコードでJSON.parseしていた部分
    
      if (Array.isArray(result) && result.length > 0) {
        setColumns(Object.keys(result[0])); // カラム名を設定
      }
      setData(result); // データを設定
    }
  };

  // 検索フォームの入力変更処理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.setSql(e.target.value);
  };

  useEffect(() => {
    if (props.isFindTableData){
      findTableData();
    }
  }, [props.isFindTableData]); 

  return (
    <div>

      {/* SQLクエリを入力するフォーム */}
      <div className="input-group mb-3">
        <input
          type="text"
          value={props.sql}
          onChange={handleInputChange}
          className="form-control"
          placeholder="SQLを入力してください"
        />
        <button className="btn btn-primary" onClick={findTableData}>
          データを取得
        </button>
      </div>

      {/* データが存在する場合にテーブルを表示 */}
      {data.length > 0 ? (
         <div className={`table-responsive ${styles["table-responsive"]}`}>
          <table className={`table ${styles.table}`}>
          <thead className={`thead-light ${styles.theadLight}`}>
              <tr>
                <th scope="col">#</th>
                {/* カラムヘッダーの動的生成 */}
                {columns.map((col) => (
                  <th scope="col" key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* 各行のデータを動的に生成 */}
              {data.map((row, rowIndex) => (
                <tr key={rowIndex} className={styles.tableRow}>
                  <th scope="row">{rowIndex + 1}</th>
                  {columns.map((col) => (
                    <td key={col}>
                      {/* 日付や日時のフォーマット処理 */}
                      {col === "date" || col === "datetime" ? moment(row[col]).format(col === "date" ? 'YYYY/MM/DD' : 'YYYY/MM/DD HH:mm:ss') : row[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>データがありません。</p>
      )}
    </div>
  );
}

export default GetTableList;
