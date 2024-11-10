import React, { useState, ChangeEvent, useEffect } from "react";
import { NumberInputProps } from "../types/NumberInput.types";

function NumberInput(props: NumberInputProps): JSX.Element {
    const [touched, setTouch] = useState(false);
    const [error, setError] = useState("");
    const [htmlClass, setHtmlClass] = useState("");
    const [value, setValue] = useState(props.value || 0);

    useEffect(() => {
        // 初期マウント時とprops.valueが変更された時にバリデーションを実行
        setValue(props.value);
    }, [props.value]); 

    // UP,Downボタン押下時の増減数を、小数点が有る場合、その最下位桁で行う様に動的に計算する
    function getStep(value: number | null | undefined): number {
        if (value === null || value === undefined) {
            return 0; // デフォルト値として0を返す
        }
        const decimalPart = value.toString().split('.')[1];
        return decimalPart ? parseFloat(`0.${'0'.repeat(decimalPart.length - 1)}1`) : 1;
    }
    
    function onValueChanged(event: ChangeEvent<HTMLInputElement>): void {
        if (props.disabled) return; // disabledの場合、何も実行しない
        let elementValue: number = (isNaN(Number(event.target.value))) ? 0 : Number(event.target.value);
        let [error, validClass] = ["", ""];
        let [is_invalid, is_valid] = ["is-invalid", ""];
        
        //is_need_ValidCheckがTrueの時だけ、cssの「is-valid」を表示(レ点で入力済を表す絵が出る)
        //入力フォーム以外のパーツとして利用する時、邪魔になるので制御
        if (props.is_need_ValidCheck) {
            is_valid = "is-valid";
        }

        if (!error) {
            [error, validClass] = ((props.max != null) && elementValue > (props.max)) ?
            [`${props.max}以下の値にして下さい`, is_invalid] : ["", is_valid];
        }

        if (!error) {
            [error, validClass] = ((props.min != null) && elementValue < (props.min)) ?
            [`${props.min}以上の値にして下さい`, is_invalid] : ["", is_valid];
        }

        props.onChange({ value: elementValue, error: error, touched: touched, field: props.field });

        setTouch(true);
        setError(error);
        setHtmlClass(validClass);
        setValue(elementValue);
    }

    return (
        <div className="form-group">
            <div className="row">
                {props.label ?
                <label className="col-form-label col-md-6" htmlFor={`id_${props.id}`} style={{
                    whiteSpace: "nowrap", // 改行を許可しない
                    overflow: "hidden", // コンテンツが領域をはみ出した場合、非表示にする
                    textOverflow: "ellipsis", // はみ出たコンテンツを省略記号(...)で表示
                    display: "inline-block", // 要素をインラインブロックとして表示
                    maxWidth: "100%" 
                }}>   
                    {props.label}
                </label>
                : null
                }
                <div className= {props.label ? "col-md-6":"col-md-12"}>
                    <input
                        value={value}
                        type="number"
                        onChange={onValueChanged}
                        className={`form-control ${props.inputClass} ${htmlClass} ${props.disabled ? 'disabled-input' : ''}`}
                        disabled={props.disabled ? true : false}
                        id={props.id}
                        onMouseDown={props.onMouseDown}
                        step={getStep(value)}
                    />
                    {error ?
                        <div className="invalid-feedback" id ={"invalid_"+props.id} >
                        {error}
                        </div> : null
                    }
                </div>
            </div>
        </div>
    );
}

export default NumberInput;
