import ExcelJS, { Cell } from 'exceljs';

//-------------------------------------------------------------------
//  自作エクセル操作ライブラリ  ※骨組みはchatGPTで作成
//-------------------------------------------------------------------

type CellAddress = {
  row: number;
  col: number;
};

// シートから文字を検索しセルアドレスを返す
const searchSheetForCellAddress = (worksheet: ExcelJS.Worksheet, searchText: string, row: number = 0, col: number = 0): CellAddress | null => {
  // 指定された行の範囲を取得する
  const rows = worksheet.getRows(row, row > 0 ? row : worksheet.rowCount);
  if (!rows) return null;

  for (const row of rows) {
    if (!Array.isArray(row.values)) return null;
    
    // 指定された列または最初の列からループを開始する
    for (let columnIndex = col > 0 ? col : 1; columnIndex <= row.values.length; columnIndex++) {
      const cellValue = row.getCell(columnIndex).value? row.getCell(columnIndex).value?.toString() : '';
      if (cellValue === searchText) {
        // 一致するセルが見つかった場合、セルのアドレスを返す
        return { row: row.number, col: columnIndex };
      }
    }
  }

  return null; // 一致するセルが見つからない場合はnullを返す
};

//計算式の場合、計算結果を返す。値の場合は値をそのまま返す。
export function getCellValue(cellData:any) {
  if (typeof cellData.formula === 'string') {
    // 計算式の場合は計算結果を返す
    return cellData.result;
  } else {
    // 実値の場合はそのまま値を返す
    return cellData.value;
  }
}

//計算式の場合、計算結果を返す。値の場合は値をそのまま返す。
export function setCellColor(argb:string,cell:Cell) {
  //複数のセルに対して書式設定が適用されている場合、一部のセルのみに書式設定を適用出来ないExcelJS仕様(バグ？)への対応
  //バックアップ
  const bk_style = cell.style;
  //クリア
  cell.style = {};
  //書き戻し
  cell.fill = {...cell.fill, ...bk_style.fill}; 
  cell.border = {...cell.border, ...bk_style.border}; 
  cell.alignment = {...cell.alignment, ...bk_style.alignment}; 
  cell.font = {...cell.font, ...bk_style.font}; 
  //着色
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: argb }
  };


}



export { searchSheetForCellAddress};
