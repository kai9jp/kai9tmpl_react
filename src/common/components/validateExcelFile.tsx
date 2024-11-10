import Swal from 'sweetalert2';
import * as xlsx from 'xlsx';
import { callApi } from '../comUtil';
import moment from 'moment';

interface UniqueIndex {
  index_name: string;
  column_name: string;
  isPrimaryKey: boolean;
}


// エラーメッセージを表示するための関数
function showError(message: string) {
  Swal.fire({
    title: 'Error!',
    text: message,
    icon: 'error',
    confirmButtonText: 'OK'
  });
}

// エクセルファイルを読み込む関数
async function loadExcelFile(file: Blob) {
  try {
    // ファイルをArrayBufferとして読み込む
    const data = await file.arrayBuffer();
    // ArrayBufferを使ってExcelワークブックを読み込む
    const workbook = xlsx.read(data, { type: 'array' });
    return workbook;
  } catch (error) {
    // エラーメッセージを表示
    showError('ファイルの読み込みに失敗しました。');
    throw error;
  }
}

// エクセルシートから制御文字で位置を特定する関数
function findPosition(sheet: xlsx.WorkSheet, controlText: string) {
  // シートの範囲を取得
  const range = xlsx.utils.decode_range(sheet['!ref'] || '');
  // シート内をループして制御文字を探す
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell_address = { c: C, r: R };
      const cell = sheet[xlsx.utils.encode_cell(cell_address)];
      if (cell && cell.v === controlText) {
        return cell_address; // 制御文字の位置を返す
      }
    }
  }
  return null; // 制御文字が見つからない場合はnullを返す
}

// エクセルシートから列情報とデータを取得する関数
function getSheetData(sheet: xlsx.WorkSheet): { headers: string[], types: string[], data: any[][] } {
  // 各制御文字の位置を取得
  const colPos = findPosition(sheet, '#C2#');
  const rowPos = findPosition(sheet, '#R2#');
  const startRowPos = findPosition(sheet, '#R6#');

  // 制御文字が見つからない場合はエラーを投げる
  if (!colPos || !rowPos || !startRowPos) {
    throw new Error('必要な制御文字が見つかりません。');
  }

  const colStartIndex = colPos.c; // データの開始列
  const rowHeaderIndex = rowPos.r; // 列名が記載された行
  const dataStartIndex = startRowPos.r; // データの開始行

  // シートのデータをJSON形式に変換
  const jsonData: any[][] = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  // 列名とデータ型を取得
  const headers = jsonData[rowHeaderIndex].slice(colStartIndex) as string[];
  const types = jsonData[rowHeaderIndex + 1].slice(colStartIndex) as string[];
  // データを取得
const data = jsonData.slice(dataStartIndex).map(row => row.slice(colStartIndex)) as any[][];


  return { headers, types, data };
}

// 型に基づいて値をフォーマットする関数
function formatValueByType(type: string, value: any) {
  switch (type.toLowerCase()) {
    case 'boolean':
      const boolValue = typeof value === 'string' ? value.toLowerCase() : value;
      return value === undefined || typeof value === 'boolean' || boolValue === 'true' || boolValue === 'false';
    case 'short':
      const shortValue = parseInt(value, 10);
      return value !== undefined && !isNaN(shortValue) && shortValue >= -32768 && shortValue <= 32767;
    case 'integer':
      const intValue = parseInt(value, 10);
      return value !== undefined && !isNaN(intValue) && intValue >= -2147483648 && intValue <= 2147483647;
    case 'long':
      const longValue = parseInt(value, 10);
      return value !== undefined && !isNaN(longValue) && longValue >= -9223372036854775808 && longValue <= 9223372036854775807;
    case 'float':
    case 'double':
    case 'double precision':
    case 'real':
    case 'float8':
    case 'java.math.bigdecimal':
    case 'decimal':
    case 'numeric':
      const parseValue = parseFloat(value);
      return value !== undefined && !isNaN(parseValue);
    case 'string':
    case 'text':
    case 'varchar':
    case 'character':
    case 'character varying':
      return value === undefined || typeof value === 'string' || typeof value === 'number';;
    case 'byte[]':
      return value !== undefined && typeof value === 'string'; // バイト配列も文字列として入ってくるため
    case 'date':
    case 'timestamp':
    case 'time':
    case 'timestamp without time zone':
    case 'timestamp with time zone':
      const isExcelDate = !isNaN(parseFloat(value)) && parseFloat(value) > 0;
      if (isExcelDate) {
        const excelDate = parseFloat(value);
        const jsDate = new Date((excelDate - 25569) * 86400 * 1000);
        return value !== undefined && !isNaN(jsDate.getTime());
      } else {
        return value !== undefined && !isNaN(Date.parse(value));
      }
    default:
      return false;
  }
}

// 必須カラムが存在するかチェック
function checkRequiredColumns(headers: string[], requiredColumns: string[], data: any[][]): string[] {
  const errors: string[] = [];
  requiredColumns.forEach((col) => {
    if (!headers.includes(col)) {
      data.forEach((row, rowIndex) => {
        errors.push(`行 ${rowIndex + 1}: 必須カラム ${col} が欠落しています。`);
      });
    }
  });
  return errors;
}

// カラムの長さをチェック
function checkColumnLengths(headers: string[], types: string[], columnLengths: { [key: string]: string }, row: any[], rowIndex: number): string[] {
  const errors: string[] = [];
  
  // 各カラムの長さをチェック
  headers.forEach((header, index) => {
    const maxLength = columnLengths[header]; // カラムごとの最大長を取得
    const type = types[index]; // カラムのデータ型を取得

    // 最大長とカラムの値が存在する場合にチェックを行う
    if (maxLength && row[index] !== null && row[index] !== undefined) {
      // 数値型（numericだけ）
      if (type === 'numeric') {
        const [precision, scale] = maxLength.split(',').map(Number); // 精度とスケールを取得
        const [integerPart, fractionalPart] = row[index].toString().split('.'); // 数値を文字列に変換してから整数部と小数部に分割

        // 整数部の長さをチェック
        if (integerPart.length > precision - scale) {
          errors.push(`行 ${rowIndex + 1} 列 ${header}: 整数部の最大長を超えています（${precision - scale} 桁まで、値: ${row[index]}）。`);
        }
        // 小数部の長さをチェック
        if (fractionalPart && fractionalPart.length > scale) {
          errors.push(`行 ${rowIndex + 1} 列 ${header}: 小数部の最大長を超えています（${scale} 桁まで、値: ${row[index]}）。`);
        }
      } else if (row[index].toString().length > maxLength) {
        // 数値型以外の場合の長さチェック
        errors.push(`行 ${rowIndex + 1} 列 ${header}: 最大長を超えています（${maxLength} 文字まで、値: ${row[index]}）。`);
      }
    }
  });

  return errors;
}


// DBから取得したユニークカラム情報を元にユニークカラムセットを生成
function getUniqueColumnSets(uniqueColumns: UniqueIndex[]): string[][] {
  const indexGroups: { [key: string]: string[] } = {};

  uniqueColumns.forEach(({ index_name, column_name }) => {
    if (!indexGroups[index_name]) {
      indexGroups[index_name] = [];
    }
    indexGroups[index_name].push(column_name);
  });

  return Object.values(indexGroups);
}

// カラムの重複をチェック
function checkUniqueColumns(headers: string[], uniqueColumns: UniqueIndex[], data: any[][]) {
  const uniqueColumnSets = getUniqueColumnSets(uniqueColumns);
  const errors: string[] = [];
  const seen: { [key: string]: { rowIndex: string, values: string[] } } = {}; // 値と行番号を保存

  uniqueColumnSets.forEach(columnSet => {
    data.forEach((row, rowIndex) => {
      const values = columnSet.map(column => {
        const index = headers.indexOf(column);
        if (index !== -1) {
          const value = row[index];
          return value !== undefined && value !== null ? value.toString() : '';
        }
        return '';
      });

      const key = values.join('_');

      if (key !== '') { // 有効なキーが生成された場合のみチェック
        const fullKey = columnSet.join('_') + '_' + key; // カラム名セットと値の組み合わせでユニークなキーを作成
        if (seen[fullKey] !== undefined) {
          errors.push(`行 ${rowIndex + 1}: 列 ${columnSet.join(', ')} キー重複しています（重複する行: ${parseInt(seen[fullKey].rowIndex) + 1}、値: ${values.join(', ')}）。`);
        } else {
          seen[fullKey] = { rowIndex: rowIndex.toString(), values };
        }
      }
    });
  });

  return errors;
}

// DB情報を取得する関数
async function fetchDbInfo(tableName: string) {
  const data = { tableName };
  // サーバーからDB情報を取得
  const response = await callApi('db-info', data, 'application/json');
  if (response && response.data) {
    return JSON.parse(response.data.data);
  }
  throw new Error('DB情報の取得に失敗しました。');
}

// 型チェック
function checkTypes(headers: string[], types: string[], data: any[][]): string[] {
  return data.flatMap((row, rowIndex) =>
    headers.map((header, colIndex) => {
      const expectedType = types[colIndex].toLowerCase();
      const value = row[colIndex];
      // 日付型の場合はisValidDate関数を使用
      const isValid = (expectedType === 'date' || expectedType === 'datetime') 
        ? isValidDate(value) 
        : formatValueByType(expectedType, value);
      // データ型が不正な場合にエラーメッセージを生成
      return isValid ? '' : `行 ${rowIndex + 1} 列 ${header}: データ型が不正です（期待される型: ${expectedType}、値: ${value ?? 'undefined'}）。`;
    }).filter(error => error) // エラーメッセージがある場合にフィルタリング
  );
}

//日付形式をチェックする関数
// DateParserUtilと平仄を合わせる事(同じフォーマッタを定義しているので
function isValidDate(value: any): boolean {
  const formats = [
    moment.ISO_8601,
    'yyyy-MM-dd\'T\'HH:mm:ss.SSSX',
    'yyyy-MM-dd\'T\'HH:mm:ss.SSS',
    'yyyy-MM-dd\'T\'HH:mm:ssX',
    'yyyy-MM-dd\'T\'HH:mm:ss',
    'yyyy/MM/dd\'T\'HH:mm:ss',
    'yyyy/MM/dd HH:mm:ss',
    'yyyy-MM-dd HH:mm:ss.S',
    'yyyy-MM-dd HH:mm:ss.SS',
    'yyyy-MM-dd HH:mm:ss.SSS',
    'yyyy-MM-dd HH:mm:ss',
    'yyyy/MM/dd HH:mm:ss',
    'MM/dd/yyyy HH:mm:ss',
    'dd/MM/yyyy HH:mm:ss',
    'yyyy-MM-d HH:mm:ss',
    'yyyy-M-dd HH:mm:ss',
    'yyyy-M-d HH:mm:ss',
    'yyyy-MM-dd',
    'yyyy/MM/dd',
    'MM/dd/yyyy',
    'dd/MM/yyyy',
    'yyyyMMdd',
    'dd-MM-yyyy',
    'EEE MMM dd HH:mm:ss zzz yyyy',
    'EEE MMM dd yyyy',
    'EEE, dd MMM yyyy HH:mm:ss z',
    'EEEE, dd MMMM yyyy HH:mm:ss z',
    'EEE, dd MMM yyyy HH:mm:ss z',
    'd MMM uuuu',
    'd MMMM uuuu',
    'MMM d, uuuu',
    'yyyy/MM/d',
    'yyyy/M/dd',
    'yyyy/M/d',
    'yyyy-M-d',
    'yyyy-M-dd',
    'yyyy/MM/dd\'T\'HH:mm',
    'yyyy/MM/dd\'T\'HH:mm:ss',
  ];
  return formats.some(format => moment(value, format, true).isValid());
}

// ユニークインデックスの一意制約違反をチェック(PKは除く)
async function sendKeyDataToBackend(headers: string[], data: any[][], uniqueColumns: UniqueIndex[], tableName: string): Promise<string[]> {
  const keyColumnNames = uniqueColumns.filter(col => !col.isPrimaryKey).map(col => col.column_name); 
  // ユニークインデックス名を取得
  const uniqueInddexs = uniqueColumns.filter(col => !col.isPrimaryKey).map(col => col.index_name);
  // 処理済みインデックス名の追跡用
  const processedIndexNames = new Set();
  // ユニークインデックス名を取得して、それぞれのインデックスに対応するデータを抽出
  const keyData = uniqueInddexs.reduce((acc: { primary_key_data: string, index_name: string, data: any[] }[], index_name: string) => {
    if (processedIndexNames.has(index_name)) return acc; // 重複を防ぐ
  
    // 現在のインデックス名に関連するカラムを取得
    const cols = uniqueColumns
      .filter(col => col.index_name === index_name && !col.isPrimaryKey);
  
    // primary_key_dataを取得するためのインデックスを取得
    const primaryKeyIndex = headers.indexOf(uniqueColumns.find(col => col.isPrimaryKey)?.column_name || "");
  
    // 各カラムに対応するデータを抽出し、個別に格納
    if (cols.length === 1) {
      const colIndex = headers.indexOf(cols[0].column_name);
      data.forEach(row => {
        acc.push({
          primary_key_data: row[primaryKeyIndex],
          index_name,
          data: [row[colIndex]]
        });
      });
    } else {
      const dataRows = data.map(row => 
        cols.map(col => row[headers.indexOf(col.column_name)])
      );
      dataRows.forEach((dataRow, rowIndex) => {
        acc.push({
          primary_key_data: data[rowIndex][primaryKeyIndex],
          index_name,
          data: dataRow
        });
      });
    }
  
    processedIndexNames.add(index_name); // 処理済みとしてマーク
  
    return acc;
  }, []);
  //console.log(JSON.stringify(keyData, null, 2)); // デバッグ用(jsonで出力)

  const payload = {
    tableName: tableName,
    keyColumnNames: keyColumnNames,
    keyData: keyData
  };

  // サーバーに送信
  const response = await callApi('validate-keys', payload, 'application/json');
  if (response && response.data　&& response.data.msg) {
    let errors = [];
    if (response.data.errors){
      errors = JSON.parse(response.data.errors);
    }else if (response.data.return_code !== 200 && response.data.msg){
      errors = response.data.msg;
    }
  return errors;
  } else {
    return ['サーバーからの応答が不正です。'];
  }
}

//---------------------------------------------
//(メインルーチン)
// エクセルファイルのバリデーションを行う関数
//---------------------------------------------
async function validateExcelFile(
  file: Blob,
  customChecks: (
    row: any[], 
    rowIndex: number, 
    headers: string[], 
    types: string[], 
    values: any
  ) => Promise<string[]>,
  tableName: string,
  values: any,
  runCustomChecksOnAllData?: (
    data: any[][], 
    headers: string[], 
    types: string[]
  ) => Promise<string[]>
): Promise<boolean> {
    try {
    // エクセルファイルを読み込む
    const workbook = await loadExcelFile(file);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const { headers, types, data } = getSheetData(sheet);

    // DB情報を取得
    const dbInfo = await fetchDbInfo(tableName);

    // 必須カラムのチェック
    const requiredColumnsErrors = checkRequiredColumns(headers, dbInfo.requiredColumns, data);
    
    // カラム長のチェック
    const columnLengthsErrors = data.flatMap((row, rowIndex) => checkColumnLengths(headers, types,dbInfo.columnLengths, row, rowIndex));

    // 型チェック
    const typeErrors = checkTypes(headers, types, data);

    // ユニークカラムの重複チェック(投入データ内だけ)
    const uniqueColumnsErrors = checkUniqueColumns(headers, dbInfo.uniqueColumns, data);

    // ユニークインデックスの一意制約違反をチェック(PKは除く：既存データに対する確認)
    const backendKeyValidationErrors = await sendKeyDataToBackend(headers, data, dbInfo.uniqueColumns, tableName);

    // 全量データに対するカスタムチェックの実行
    let runCustomChecksOnAllDataErrors: string[] = [];
    if (runCustomChecksOnAllData) {
      runCustomChecksOnAllDataErrors = await runCustomChecksOnAllData(data, headers, types);
    }

    // カスタムチェックの実行
    const customErrors = await Promise.all(data.map((row, rowIndex) => customChecks(row, rowIndex, headers, types,values)));
    const flattenedCustomErrors = customErrors.flat();
    
    // すべてのエラーメッセージを結合
    const errors = requiredColumnsErrors.concat(columnLengthsErrors, uniqueColumnsErrors, backendKeyValidationErrors, typeErrors, flattenedCustomErrors,runCustomChecksOnAllDataErrors);

    // エラーが存在する場合は例外を投げる
    if (errors.length > 0) {
      throw new Error(errors.join('\n'));
    }

    // バリデーションが成功した場合はtrueを返す
    return true;

  } catch (error) {
    // エラーメッセージを生成
    let errorMessage = "";
    if (error instanceof Error) {
      errorMessage += error.message;
    } else if (typeof error === 'string') {
      errorMessage += error;
    }

    // エラー内容をテキストファイルにしてダウンロード
    const element = document.createElement('a');
    const file = new Blob([errorMessage], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'バリデーションエラー.txt';
    document.body.appendChild(element); // Firefox 対応
    element.click();
    document.body.removeChild(element);

    // エラーメッセージを表示
    showError('バリデーション中にエラーが発生しました。詳細はテキストを確認して下さい。');
    return false;
  }
}

export default validateExcelFile;
