import React from "react";
import { useSelector } from "react-redux";
import { ISingle_table } from "../../store/models/single_table.interface";
import { IStateType, ISingle_tableState} from "../../store/models/root.interface";
import moment from 'moment';
//【制御:置換】BLOB有無①
import styles from "./Single_tableList.module.css";

export type single_tableListProps = {
  onSelect?: (single_table: ISingle_table) => void;
  children?: React.ReactNode;
  height:any;
};

function Single_tableList(props: single_tableListProps): JSX.Element  {
  const single_tables: ISingle_tableState = useSelector((state: IStateType) => state.single_tables);

  const single_tableElements: (JSX.Element | null)[] = single_tables.Single_tables.map(single_table => {
    //【制御:置換】BLOB有無②
    if (!single_table) { return null; }
    return (
      <tr className={`tableRow ${(single_tables.selectedSingle_table && single_tables.selectedSingle_table.s_pk === single_table.s_pk) ? `${styles.selected}` : ""} ${single_table.delflg === true ? `${styles.deleted}` : ""}`}
        onClick={() => {
          if(props.onSelect) props.onSelect(single_table);
        }}
        key={`single_table_${single_table.s_pk}`}
      >
        <th scope="row">{single_table.s_pk}</th>
        {/* 【制御:開始】対象カラム① */}
        <td>{single_table.s_pk}</td>
        <td>{single_table.natural_key1}</td>
        <td>{single_table.natural_key21}</td>
        <td>{single_table.natural_key22_33}</td>
        <td>{single_table.natural_key31}</td>
        <td>{single_table.natural_key32}</td>
        <td>{single_table.fullwidth_limited}</td>
        <td>{single_table.halfwidth_limited}</td>
        <td>{single_table.halfwidth_alphabetical_limited}</td>
        <td>{single_table.halfwidth_number_limited}</td>
        <td>{single_table.halfwidth_symbol_limited}</td>
        <td>{single_table.halfwidth_kana_limited}</td>
        <td>{single_table.fullwidth_kana_limited}</td>
        <td>{single_table.number_limited}</td>
        <td>{single_table.small_number_point}</td>
        <td>{single_table.number_real}</td>
        <td>{single_table.number_double}</td>
        <td>{single_table.normal_string}</td>
        <td>{single_table.postal_code}</td>
        <td>{single_table.phone_number}</td>
        <td>{moment(single_table.date).format('YYYY/MM/DD')}</td>
        <td>{moment(single_table.datetime).format('YYYY/MM/DD HH:mm:ss')}</td>
        <td>{single_table.email_address}</td>
        <td>{single_table.url}</td>
        <td>{single_table.flg? "〇":""}</td>
        <td>{single_table.regexp}</td>
        <td>{single_table.memo}</td>
        <td>{single_table.related_pk__related_data}</td>
        <td>{single_table.update_user}</td>
        <td>{moment(single_table.update_date).format('YYYY/MM/DD HH:mm:ss')}</td>
        <td>{single_table.delflg? "〇":""}</td>
        {/* 【制御:終了】対象カラム① */}
      </tr>
    );
  });

  return (
    <div className="table-responsive portlet"  style={{ maxHeight: props.height }}>
      <table className="table">
        <thead className="thead-light ">
          <tr>
            <th scope="col">#</th>
            {/* 【制御:開始】対象カラム② */}
            <th scope="col">シングルID</th>
            <th scope="col">ナチュラルキー1</th>
            <th scope="col">ナチュラルキー2-1</th>
            <th scope="col">ナチュラルキー2-2</th>
            <th scope="col">ナチュラルキー3-1</th>
            <th scope="col">ナチュラルキー3-2</th>
            <th scope="col">全角限定</th>
            <th scope="col">半角限定</th>
            <th scope="col">半角英字限定</th>
            <th scope="col">半角数字限定</th>
            <th scope="col">半角記号限定</th>
            <th scope="col">半角カナ限定</th>
            <th scope="col">全角カナ限定</th>
            <th scope="col">数値限定</th>
            <th scope="col">小数点</th>
            <th scope="col">単精度浮動小数点数</th>
            <th scope="col">倍精度浮動小数点数</th>
            <th scope="col">ノーマル文字列</th>
            <th scope="col">郵便番号</th>
            <th scope="col">電話番号</th>
            <th scope="col">日付</th>
            <th scope="col">日時</th>
            <th scope="col">メールアドレス</th>
            <th scope="col">URL</th>
            <th scope="col">フラグ</th>
            <th scope="col">正規表現</th>
            <th scope="col">備考</th>
            <th scope="col">関連ID</th>
            <th scope="col">更新者</th>
            <th scope="col">更新日時</th>
            <th scope="col">削除フラグ</th>
            {/* 【制御:終了】対象カラム② */}
          </tr>
        </thead>
        <tbody>
          {single_tableElements}
        </tbody>
      </table>
    </div>

  );
}

export default Single_tableList;
