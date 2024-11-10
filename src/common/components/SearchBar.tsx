import React, { useState } from 'react';


interface SearchBarProps {
  setFindStr: (arg0: string) => void; 
  setIsNeedFind: (arg0: boolean) => void; 
  onMouseDown?:any;
}

function SearchBar(props: SearchBarProps) {

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        const inputElement = event.target as HTMLInputElement;
        if (inputElement && inputElement.placeholder === 'キーワード検索') {
          inputElement.setSelectionRange(inputElement.value.length, inputElement.value.length);
          inputElement.setSelectionRange(0, 0, 'backward');
          inputElement.setAttribute('lang', 'ja');
        }
      };
      
    const [isComposing, setIsComposing] = useState(false);
    const [MyFindStr, setMyFindStr] = useState("");

    return (
      <div className="col-md-12">
          <div className="row">
              <div className="col-md-10 px-1">
                  <input
                  type="text"
                  id="keyword_find_input"
                  className="form-control"
                  placeholder="キーワード検索"
                  aria-label="キーワード検索"
                  aria-describedby="button-addon2"
                  value={MyFindStr}
                  onChange={(event) => setMyFindStr(event.target.value)}
                  onFocus={handleFocus}
                  onCompositionStart={() => setIsComposing(true)}//IME入力確定のEnterを無視
                  onCompositionEnd={() => setIsComposing(false)} //IME入力確定のEnterを無視
                  onKeyDown={(event) => {
                      if (!isComposing && event.key === 'Enter') {
                        props.setFindStr(MyFindStr);
                        props.setIsNeedFind(true);
                      }
                  }}
                  onMouseDown={props.onMouseDown}
                  />
              </div>
              <div className="col-md-2 px-0">
                  <button
                  className="btn btn-outline-secondary"
                  type="button"
                  id="keyword_find_button"
                  onClick={() => {
                    props.setFindStr(MyFindStr);
                    props.setIsNeedFind(true);
                  }}
                  style={{
                    whiteSpace: "nowrap", // 改行を許可しない
                    overflow: "hidden", // コンテンツが領域をはみ出した場合、非表示にする
                    textOverflow: "ellipsis", // はみ出たコンテンツを省略記号(...)で表示
                    display: "inline-block", // 要素をインラインブロックとして表示
                    maxWidth: "100%" 
                  }}
                  >
                  検索
                  </button>
              </div>
          </div>
      </div>
    );
  }
  
  export default SearchBar;
  