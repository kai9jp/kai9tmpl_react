import React, { useState, ChangeEvent, Fragment, useEffect } from "react";
import { SelectProps } from "../types/Select.types";

function SelectInput(props: SelectProps): JSX.Element {
    const [touched, setTouch] = useState(false);
    const [error, setError] = useState("");
    const [htmlClass, setHtmlClass] = useState("");
    const [value, setValue] = useState(props.value);

    useEffect(() => {
        // 初期マウント時とprops.valueが変更された時にバリデーションを実行
        setValue(props.value);
        validate(props.value); 
    }, [props.value]); 

    function validate(elementValue: string) {
        let [localError, validClass] = ["", ""];

        if (!elementValue && props.required) {
            [localError, validClass] = ["必ず選択して下さい", "is-invalid"];
        }

        setError(localError);
        setHtmlClass(validClass);
        setTouch(true); // 初期バリデーションでもタッチされたとみなす
        props.onChange({ value: elementValue, error: localError, touched: true, field: props.field });
    }

    function onValueChanged(event: ChangeEvent<HTMLSelectElement>): void {
        const newValue = event.target.value;
        validate(newValue);
        setValue(newValue);
    }

    const getOptions: (JSX.Element | null)[] = props.options.map(option => {
        //disabledがTrueの場合、現在の値以外の選択肢を表示させない
        if (props.disabled) {
            if (option == props.value){
                return (
                    <option key={option} value={`${option}`} selected>{option}</option>
                )
            }
        }else{
            if (option == props.value){
                return <option key={option} value={`${option}`} selected>{option}</option> 
            }else{
                return <option key={option} value={`${option}`}>{option}</option> 
            }
        }
        return <option></option>;
    });

    return (
        <Fragment>
            <label htmlFor={`${props.id}`}>{props.label}</label>
            <select
                id={props.id}
                className={`form-control ${props.inputClass ? props.inputClass : ""} ${htmlClass}`}
                onChange={onValueChanged}>
                <option value="">Choose...</option>
                {getOptions}
                value={value}
            </select>

            {error ?
                <div className="invalid-feedback" id ={"invalid_"+props.id} >
                    {error}
                </div> : null
            }
        </Fragment>
    );
}

export default SelectInput;