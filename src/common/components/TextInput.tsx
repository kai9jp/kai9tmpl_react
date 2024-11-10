import React, { useState, ChangeEvent, useEffect, useRef } from "react";
import { TextInputProps } from "../types/TextInput.types";

function TextInput(props: TextInputProps): JSX.Element {
    const [value, setValue] = useState(props.value);
    const [touched, setTouch] = useState(false);
    const [error, setError] = useState("");
    const [htmlClass, setHtmlClass] = useState("");
    //強制半角モード用
    const numericInputRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
        // 初期マウント時とprops.valueが変更された時にバリデーションを実行
        setValue(props.value);
        validate(props.value); 
    }, [props.value]); 

    function validate(elementValue: string | null) {
        let [localError, validClass] = ["", ""];

        if (!elementValue && props.required) {
            localError = "省略出来ません";
            validClass = "is-invalid";
        } else {
            validClass = "is-valid";
        }

        // 最大文字数の確認
        if (elementValue !== null && !localError && props.maxLength && elementValue.length > props.maxLength) {
            localError = `${props.maxLength}文字以内で入力して下さい`;
            validClass = "is-invalid";
        }

        // 最小文字数の確認
        if (elementValue !== null && !localError && props.minLength && elementValue.length < props.minLength) {
            localError = `${props.minLength}文字以上で入力して下さい`;
            validClass = "is-invalid";
        }

        // 入力文字種別を正規表現でチェック
        if (elementValue !== null && !localError && props.Pattern_regexp && !elementValue.match(props.Pattern_regexp)) {
            localError = props.Pattern_message || "";
            validClass = "is-invalid";
        }

        setError(localError);
        setHtmlClass(validClass);
        setTouch(true); // 初期バリデーションでもタッチされたとみなす
        props.onChange({ value: elementValue, error: localError, touched: true, field: props.field });
    }

    function onValueChanged(event: ChangeEvent<HTMLInputElement>): void {
        const newValue = event.target.value;
        validate(newValue);
        setValue(newValue);
    }

    //inputMode がdisableの場合、強制的にIMEを無効化し、半角入力モードにする
    useEffect(() => {
        const input = numericInputRef.current;
    
        const handleCompositionStart = (event: CompositionEvent) => {
          // IME が開始されたときの処理
          if (input && props.isImeDisble) {
            input.setAttribute('inputMode', 'none'); // IME を一時的に無効化
          }
        };
        const handleCompositionEnd = (event: CompositionEvent) => {
          // IME が終了したときの処理
          if (input && props.isImeDisble) {
            input.setAttribute('inputMode', 'numeric'); // IME を再度有効化
          }
        };
        if (input && props.isImeDisble) {
          input.addEventListener('compositionstart', handleCompositionStart);
          input.addEventListener('compositionend', handleCompositionEnd);
        }
        return () => {
          if (input && props.isImeDisble) {
            input.removeEventListener('compositionstart', handleCompositionStart);
            input.removeEventListener('compositionend', handleCompositionEnd);
          }
        };
      }, []);

    return (
        <div>
            <label htmlFor={props.id.toString()}>{props.label}</label>
                <input
                    value={value}
                    type={props.type}
                    onChange={onValueChanged}
                    className={`form-control ${props.inputClass} ${htmlClass}`}
                    id={props.id}
                    placeholder={props.placeholder} 
                    ref={numericInputRef}
                    //Enter keyでsubmitされてしまうのを無効にする
                    //https://kenjimorita.jp/react-redux-form-enter-key-submit/
                    onKeyPress={e => {
                        if (e.key === 'Enter') e.preventDefault();
                      }}                    
                    disabled = {props.disabled}
                />
                {error ?
                    <div className="invalid-feedback" id ={"invalid_"+props.id} >
                        {error}
                    </div> : null
                }
        </div>
    );
}

export default TextInput;