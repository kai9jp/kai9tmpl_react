//全般が書いてある参考サイト↓
//https://maasaablog.com/development/frontend/react/3075/
import React from "react";
import ReactPaginate from "react-paginate";
import "./pagination.css";
import NumberInput from "../../common/components/NumberInput";
import { OnChangeModel } from "non_common/types/Form.types";

interface PaginationProps {
  dataCounts:any,
  numberOfDisplaysPerpage:number,
  SetnumberOfDisplaysPerpage?:any,
  currentPage:number,
  SetCurrentPage:any,
}

const Pagination = (props: PaginationProps) => {
  const totalPageCount = roundByCeil(props.dataCounts, props.numberOfDisplaysPerpage);

  // 切り上げ関数
  function roundByCeil(numerator: number, denominator: number) {
    return Math.ceil(numerator / denominator);
  }

  // ページクリック時のイベント
  const handlePaginate = (selectedPage: { selected: number; }) => {
    // selectedPage.selectedには、ページ番号 - 1が入る
    props.SetCurrentPage(selectedPage.selected + 1);
    //Reactの履歴に登録する  
    history.pushState({}, "", `?page=${selectedPage.selected + 1}`);
  };

  //表示件数変更時のイベント
  function on_numberOfDisplaysPerpage_ValueChanged(event: React.ChangeEvent<HTMLInputElement>): void {
    const value = Number(event.target.value); 
    if (value === 0) return; 
    props.SetnumberOfDisplaysPerpage(value); 
}

  return (
    <>
      <div className="row text-left align-items-center">
        <div className="col-md-4 pt-0 d-flex align-items-center">
          <label className="mr-2 mt-1">表示件数</label>
          <NumberInput
            id="numberOfDisplaysPerpage"
            value={props.numberOfDisplaysPerpage}
            field="numberOfDisplaysPerpage"
            onChange={on_numberOfDisplaysPerpage_ValueChanged}
            max={200}
            min={0}
            label=""
            is_need_ValidCheck={false}
          />
        </div>
        <div className="col-md-6 pt-2 d-flex align-items-center">
          <ReactPaginate
            forcePage={props.currentPage - 1}// 現在のページをreactのstateで管理したい場合等
            pageCount={totalPageCount}
            onPageChange={handlePaginate}
            marginPagesDisplayed={1}// 先頭と末尾に表示するページ数
            pageRangeDisplayed={2}// 現在のページの前後をいくつ表示させるか
            //これらのClassNameをCSSで指定可能
            containerClassName="pagination justify-center"// ul(pagination本体)
            pageClassName="page-item2"// li 
            pageLinkClassName="page-link-rounded-full"// a  数字の入ったボックス
            activeClassName="active-item"// active.li
            activeLinkClassName="active-item-Link"// active.li < a
            
            // 戻る・進む関連
            previousClassName="page-item2"// li
            nextClassName="page-item2"// li
            previousLabel={"<"}// a
            previousLinkClassName="previous-link"
            nextLabel={">"}// a
            nextLinkClassName="next-link"
            // 先頭 or 末尾に行ったときにそれ以上戻れ(進め)なくする
            disabledClassName="disabled-button d-none"
            // 中間ページの省略表記関連
            breakLabel="..."
            breakClassName=""
            breakLinkClassName=""
          />
        </div>
      </div>
    </>
  );
};

export interface ISetCurrentPageActionType { type: string, current_page: number };

export default Pagination;
