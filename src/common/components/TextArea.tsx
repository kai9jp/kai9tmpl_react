import React, { useState, ChangeEvent, useEffect } from "react";
import { TextAreaProps } from "../types/TextArea.types";

function TextArea(props: TextAreaProps): JSX.Element {
    const [value, setValue] = useState(props.value);
    const [touched, setTouch] = useState(false);
    const [error, setError] = useState("");
    const [htmlClass, setHtmlClass] = useState("");

    useEffect(() => {
        // 初期マウント時とprops.valueが変更された時にバリデーションを実行
        setValue(props.value);
        validate(props.value); 
    }, [props.value]); 

    function validate(elementValue: string | null) {
        let [localError, validClass] = ["", ""];

        [localError, validClass] = (!elementValue && props.required) ?
            ["省略出来ません", "is-invalid"] : ["", "is-valid"];

        // 最大文字数の確認
        if (!localError) {
            [localError, validClass] = (elementValue !== null &&props.maxLength && elementValue.length > props.maxLength) ?
            [`${props.maxLength}文字以内で入力して下さい`, "is-invalid"] : ["", "is-valid"];
        }

        // 最小文字数の確認
        if (!localError) {
            [localError, validClass] = (elementValue !== null &&props.minLength && elementValue.length < props.minLength) ?
            [`${props.minLength}文字以上で入力して下さい`, "is-invalid"] : ["", "is-valid"];
        }

        // 入力文字種別を正規表現でチェック
        if (elementValue !== null &&!localError && props.Pattern_regexp && !elementValue.match(props.Pattern_regexp)) {
            [localError, validClass] = [props.Pattern_message ? props.Pattern_message : "", "is-invalid"];
        }

        setError(localError);
        setHtmlClass(validClass);
        setTouch(true); // 初期バリデーションでもタッチされたとみなす
        props.onChange({ value: elementValue, error: localError, touched: true, field: props.field });
    }

    function onValueChanged(event: ChangeEvent<HTMLTextAreaElement>): void {
        const newValue = event.target.value;
        validate(newValue);
        setValue(newValue);
    }

    return (
        <div>
            <label htmlFor={props.id.toString()}>{props.label}</label>
            <textarea
                value={value}
                onChange={onValueChanged}
                className={`form-control ${props.inputClass} ${htmlClass}`}
                id={props.id}
                placeholder={props.placeholder} 
                // Enter keyでsubmitされてしまうのを無効にする
                // https://kenjimorita.jp/react-redux-form-enter-key-submit/
                onKeyPress={e => {
                    if (e.key === 'Enter') e.preventDefault();
                }}
                rows={props.rows}
                cols={props.cols}
                disabled={props.disabled}
            />
            {error ?
                <div className="invalid-feedback" id={"invalid_" + props.id}>
                    {error}
                </div> : null
            }
        </div>
    );
}

export default TextArea;
