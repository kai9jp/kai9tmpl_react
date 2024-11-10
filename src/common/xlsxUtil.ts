import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

//-------------------------------------------------------------------
//  自作エクセル操作ライブラリ  ※骨組みはchatGPTで作成
//-------------------------------------------------------------------

// XLSXライブラリで使用されるセルプロパティの一覧(chatGPT作+補記)
// v: セルに表示される値を表します。これだけは必ず在る。書式が設定されたセルの値や計算された値を含め、すべてのセルの値を取得可能。
// w: セルに表示される文字列を表します。ただし、実際の文字列は共有文字列テーブルに格納されます。
//  ※共有文字列テーブルは、Excelファイル内で複数回使用される文字列を1つの場所に格納するための機能で、メモリを節約することができます。wプロパティには、セルに表示される文字列が含まれますが、実際の文字列は共有文字列テーブルに格納されます。
// t: セルの値の種類を示す文字列です。値が数値、文字列、エラー、ブール値、または共有文字列のいずれかであることを示します。
// f: セルに含まれる関数式を表します。例えば、"SUM(A1:A10)"のような式が含まれる場合があります。
// r: セルの位置を表す文字列です。例えば、"A1"や"C4"のような文字列が含まれます。
// c: セルの列のインデックスを表します。例えば、A列の場合は0、B列の場合は1となります。
// r: セルの行のインデックスを表します。例えば、1行目の場合は0、2行目の場合は1となります。
// z: セルの書式コードを表します。例えば、通貨の場合は"$#,##0.00"のような書式が含まれます。
// h: セルのHTML表現を表します。セルにリンクや画像が含まれる場合などに使用されます。
// s: セルのスタイルを表すオブジェクトです。セルのフォントサイズ、フォントカラー、セルの背景色などのスタイルが含まれます。
// l: セルに関連付けられたハイパーリンクを表します。
// b: セルに太字が設定されているかどうかを示すブール値です。
// u: セルに下線が設定されているかどうかを示すブール値です。
// i: セルが斜体に設定されているかどうかを示すブール値です。


function ErrorMSG(msg: string) {
    Swal.fire({
      title: 'Error!',
      text: msg,
      icon: 'error',
      confirmButtonText: 'OK'
    })
  }

//シートから文字を検索しセル座標を返す  
export function searchSheetForText(sheet: XLSX.WorkSheet, searchText: any) {
    const range = XLSX.utils.decode_range(sheet['!ref'] as string);
    for (let row = range.s.r; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        const cell = sheet[cellAddress];
        if (cell && cell.t === 's' && cell.v.includes(searchText)) {
          return cellAddress;
        }
      }
    }
    return null;
  }
  
//ブックから文字を検索しセル座標を返す(シート名　を指定) 
export function searchWorkbookForText(workbook: XLSX.WorkBook, sheetName: string | number, searchText: any) {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
      ErrorMSG(`シート '${sheetName}' が見つかりません`);
      //throw new Error(`Sheet '${sheetName}' not found in the workbook`);
    }
    return searchSheetForText(sheet, searchText);
  }
  
  //ファイルから文字を検索しセル座標を返す(ファイル名、シート名　を指定)  
  export function searchFileForText(filePath: string, sheetName: string | number, searchText: any) {
    const workbook = XLSX.readFile(filePath);
    return searchWorkbookForText(workbook, sheetName, searchText);
  }

//特定の行から文字を検索しセル座標を返す  
export function searchRowForText(sheet: XLSX.WorkSheet, row:number,searchText: any) {
  const range = XLSX.utils.decode_range(sheet['!ref'] as string);
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
    const cell = sheet[cellAddress];
    if (cell && cell.t === 's' && cell.v.includes(searchText)) {
      return cellAddress;
    }
  }
  return null;
}

//特定の列から文字を検索しセル座標を返す  
export function searchColForText(sheet: XLSX.WorkSheet, col:number,searchText: any) {
  const range = XLSX.utils.decode_range(sheet['!ref'] as string);
  for (let row = range.s.r; row <= range.e.r; row++) {
    const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
    const cell = sheet[cellAddress];
    if (cell && cell.t === 's' && cell.v.includes(searchText)) {
      return cellAddress;
    }
  }
  return null;
}

//セルの値を返す
export function cellvalue(sheet: XLSX.WorkSheet, row: number,col: number) {
  const address = XLSX.utils.encode_cell({r:row, c:col});
  const cell = sheet[address];
  if (cell){
    return cell.v;
  }else{
    return "";
  }
}

//指定列の最終行を返す
export function getLastRowForCol(sheet: XLSX.WorkSheet, col: number):number {
  const range = XLSX.utils.decode_range(sheet['!ref'] as string);
  let result = 0;
  let blunc = 0;
  for (let row = range.s.r; row <= range.e.r; row++) {
    const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
    const cell = sheet[cellAddress];
    if (cell && cell.v) result = row;
    else blunc = blunc + 1;
    if (blunc > 1000) break;//空白行が1000を超えれば抜ける
  }
  return result;
}

