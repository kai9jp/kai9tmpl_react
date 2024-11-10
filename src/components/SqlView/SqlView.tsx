import React, { Fragment, Dispatch,useState,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentPath } from "../../store/actions/root.actions";
import GetTableList from "./GetTableList"
import SelectInput from "../../common/components/Select";
import { AUT_NUM_READ_ONLY } from "../../common/constants";
import { IStateType } from "../../store/models/root.interface";
import { IAccount } from "../../store/models/account.interface";
import { callApi } from "../../common/comUtil";
import { OnChangeModel } from "../../non_common/types/Form.types";

const SqlView: React.FC = () => {

  const dispatch: Dispatch<any> = useDispatch();
  dispatch(updateCurrentPath("SqlView", ""));
  const account: IAccount = useSelector((state: IStateType) => state.account);
  const [selectSqlLists, setSelectSqlLists] = useState([""]);
  const [selectSqlLists_loading, setSelectSqlLists_loading] = useState(true);
  const [selectSql, setSelectSql] = useState("");
  const [sql, setSql] = useState("");
  const [isFindTableData, setIsFindTableData] = useState(false);
  
  //Changedイベント
  async function sqlListSelectChanged(model: OnChangeModel): Promise<void> {
  // 未選択の場合、処理を抜ける
   if (!model.value) {
    setSql("");
    setIsFindTableData(true);
    return;
   }
    
    const response = await callApi('get_sql', {sql_name:String(model.value)},'application/x-www-form-urlencoded');
    if (response){
      setSql(response.data.result);
      setIsFindTableData(true);
    }
  };    
  
  //selectInputに表示させるアイテムの検索
  async function getSqlLists() {
    const response = await callApi('get_sqllists', null,'application/x-www-form-urlencoded');
    if (response){
      const str = JSON.stringify(response.data.results);
      const data = JSON.parse(str);
      setSelectSqlLists(data);
      setSelectSqlLists_loading(false);
    }
  }

  //初回ロード時にAPI検索
  useEffect(() => {
    getSqlLists();
  }, []); 
  
  //検索が未完の場合Loading...を表示
  if (selectSqlLists_loading) {
    return <div>Loading...</div>;
  }

  return (
    <Fragment>
      <SelectInput
                      id="sqllist"
                      field="sqllist"
                      label=""
                      options={selectSqlLists}
                      required={true}
                      onChange={sqlListSelectChanged}
                      value={selectSql}
                      disabled={[AUT_NUM_READ_ONLY].includes(account.authority_lv)}//[参照専用]の場合は編集不可
                      />

      <div className="App">
        <GetTableList 
          sql={sql}
          setSql={setSql}
          isFindTableData={isFindTableData}
          setIsFindTableData={setIsFindTableData}
        /> 
      </div>        

    </Fragment>
  );
};

export default SqlView;

