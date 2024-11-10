import { useState, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faCircleExclamation, faUpload } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import Swal from 'sweetalert2';

type ExcelDropzoneProps = {
  label: string;
  id: string;
  onDrop: (blob: Blob, filename: string) => void;
};

//https://codezine.jp/article/detail/15759?p=2
function ExcelDropzone(props: ExcelDropzoneProps) {
  //外枠の基本スタイル
  // ドロップ領域のスタイル定義
  const baseStyle = {
    flex: 1,
    display: "flex",
    flexDirection: 'column' as 'column',
    alignItems: "center",
    padding: "20px",
    borderWidth: 2,
    borderRadius: 2,
    borderColor: "#eeeeee",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    color: "#bdbdbd",
    outline: "none",
    transition: "border .24s ease-in-out",
  };
  
  // ドロップ領域のフォーカスが当たった時のスタイル定義
  const focusedStyle = {
    borderColor: "#2196f3",
  };

  // 受け入れ可能なファイルをドラッグしたときのスタイル定義
  const acceptStyle = {
    borderColor: "#0067C0",
  };

  // 受け入れできないファイルをドラッグしたときのスタイル定義
  const rejectStyle = {
    borderColor: "#ff1744",
  };

  // ステートフック
  const [isDragEnd, setIsDragEnd] = useState(false);
  const [dragEndMsg, setDragEndMsg] = useState("");
  const [dragEndIcon, setDragEndIcon] = useState(faFileAlt);

  // ドロップ処理
  const onDrop = useCallback((acceptedFiles: File[]) => { 
    setIsDragEnd(true);  
    if (acceptedFiles.length === 0) {
      setDragEndMsg('アップロード出来ないファイルタイプです。無視されました。');
      setDragEndIcon(faCircleExclamation);
      Swal.fire('アップロード出来ないファイルタイプです。無視されました', '', 'error');
      return;
    }else if (acceptedFiles.length !== 1) {
        setDragEndMsg('1つのファイルだけをアップロードしてください');
        setDragEndIcon(faCircleExclamation);
        Swal.fire('1つのファイルだけをアップロードしてください', '', 'error');
        return;
      } else {
      setDragEndMsg('ファイルがアップロードされました');
      setDragEndIcon(faFileAlt);
    }

    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      const binaryStr = reader.result;
      const blob = new Blob([binaryStr as string], { type: file.type });

      // 親コンポーネントから渡されたコールバック関数を呼び出す
      props.onDrop(blob, file.name);
    };
    reader.readAsArrayBuffer(file);
  }, [props]);

  // ドロップ領域のプロパティを取得
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ['.xlsx'] } // 受け付けるMIMEタイプ
  });

  // 状態に応じたスタイルオブジェクトを生成する
  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  return (
    <div>
      <label>{props.label}</label>
      <div id={props.id} {...getRootProps({ style })}>
        <input {...getInputProps()} />
        {isDragEnd ? (
          <div>
            <FontAwesomeIcon icon={dragEndIcon} />
            {dragEndMsg}
          </div>
        ) : (
          <div>
            <FontAwesomeIcon icon={faUpload} />
            ファイルをドラッグアンドドロップして下さい (クリックして、ファイルを選択する事も可能です)
          </div>
        )}
      </div>
    </div>
  );
}

export default ExcelDropzone;
