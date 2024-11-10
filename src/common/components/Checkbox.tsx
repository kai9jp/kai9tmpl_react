import React, { useState, ChangeEvent } from "react";
import { CheckboxProps } from "../types/Checkbox.types";

// チェックボックスコンポーネント
function Checkbox(props: CheckboxProps): JSX.Element {
    // 状態を管理するための変数
    const [touched, setTouch] = useState(false); // 入力があったかどうか
    const [error, setError] = useState(""); // エラーメッセージ
    const [htmlClass, setHtmlClass] = useState(""); // HTMLクラス

    // チェックボックスの状態が変化したときに呼び出される関数
    function onValueChanged(event: ChangeEvent<HTMLInputElement>): void {
        // 状態を更新するための変数
        let [error, validClass, elementValue] = ["", "", event.target.checked];

        // 必須項目がチェックされていない場合はエラーを設定する
        [error, validClass] = (!elementValue && props.required) ?
            ["必ずチェックして下さい", "is-invalid"] : ["", "is-valid"];

        // 親コンポーネントに変更を通知する
        props.onChange({ value: elementValue, error: error, touched: touched, field: props.field });

        // 状態を更新する
        setTouch(true);
        setError(error);
        setHtmlClass(validClass);
    }

    return (
        // フォームのチェックボックス
        <div className="form-check" style={{ maxWidth: "100%" }}>
            <input
                // HTMLクラスを動的に設定する
                className={`form-check-input ${props.inputClass ? props.inputClass : ""} ${htmlClass}`}
                type="checkbox"
                id={props.id}
                checked={props.value}
                onChange={onValueChanged}
                disabled={props.disabled}
            />
            {/* ラベルがクリックされた場合にチェックボックスも反転させる */}
            <label className="form-check-label" htmlFor={`${props.id}`} onClick={() => onValueChanged} style={{
                whiteSpace: "nowrap", // 改行を許可しない
                overflow: "hidden", // コンテンツが領域をはみ出した場合、非表示にする
                textOverflow: "ellipsis", // はみ出たコンテンツを省略記号(...)で表示
                display: "inline-block", // 要素をインラインブロックとして表示
                maxWidth: "calc(100% - 24px)" // チェックボックスの幅を考慮して、最大幅を設定（24pxはチェックボックスの推定幅）
            }}>                
                {props.label}
            </label>

            {/* エラーメッセージを表示する */}
            {error ?
                <div className="invalid-feedback" id ={"invalid_"+props.id} >
                    {error}
                </div> : null
            }
        </div>
    );
}

export default Checkbox;
