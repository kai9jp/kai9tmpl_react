import { useState, ChangeEvent, FocusEvent, useEffect } from "react";
import React from "react";
import Decimal from "decimal.js";

// NumberInput コンポーネント
// 数値入力フィールドをレンダリングし、入力値のバリデーションやフォーマットを行う
function NumberInput(props: any): JSX.Element {
    // 入力値を管理するステート
    const [value, setValue] = useState<string>(props.value?.toString() || "0");
    // エラーメッセージを管理するステート
    const [error, setError] = useState<string>("");
    // 小数点以下の最大桁数を管理するステート
    const [maxDecimalPlaces, setMaxDecimalPlaces] = useState<number>(0);
    // ユーザーが手入力中であるかを管理するフラグ
    const [isUserTyping, setIsUserTyping] = useState<boolean>(false);

    // 手入力やペースト操作を検知
    const handleKeyDown = (): void => setIsUserTyping(true);
    const handlePaste = (): void => setIsUserTyping(true);

    // 入力値が変更されたときの処理
    const onValueChanged = (event: ChangeEvent<HTMLInputElement>): void => {
        const rawInput = event.target.value; // 生の入力値を取得
        setValue(rawInput);

        try {
            const { value: parsedValue, overflow, errorType } = parseValue(rawInput);

            // 手入力時のみ、維持すべき小数点以下の桁数を更新
            if (isUserTyping) {
                const decimalPlaces = getDecimalPlaces(rawInput);
                setMaxDecimalPlaces(decimalPlaces);
            }

            // バリデーションを実行
            validate(parsedValue, overflow, errorType);

            // バリデーションを通過した値のみ、親コンポーネントに通知
            if (!overflow && parsedValue !== null) {
                if (props.onChange) {
                    props.onChange(event);
                }
            }
        } catch (err) {
            setError("無効な値が入力されました");
        }

        // 入力完了後、手入力フラグをリセット
        setIsUserTyping(false);
    };

    // フォーカスが外れたときの処理
    const onBlur = (event: FocusEvent<HTMLInputElement>): void => {
        const formattedValue = formatValue(value); // 入力値をフォーマット
        setValue(formattedValue); // フォーマット済みの値で更新
    };

    // 入力値を解析し、有効性や範囲をチェックする関数
    const parseValue = (input: string): { value: number | bigint | Decimal | null; overflow: boolean; errorType?: 'max' | 'min' } => {
    
        try {
            // Decimal.js を使用して高精度の数値を解析
            const decimalValue = new Decimal(input);
    
            // 最大値/最小値のチェック
            const maxDecimal = new Decimal("1.797693e+308");
            const minDecimal = new Decimal("-1.797693e+308");
            
            if (props.max !== undefined && decimalValue.gt(maxDecimal)) {
                return { value: null, overflow: true, errorType: 'max' };
            } else if (props.min !== undefined && decimalValue.lt(minDecimal)) {
                return { value: null, overflow: true, errorType: 'min' };
            }
    
            return { value: decimalValue, overflow: false };
        } catch (error) {
            console.error("[parseValue] Decimal parse error:", error);
            return { value: null, overflow: true };
        }
    };
    
    // バリデーションを行い、エラーメッセージを更新する関数
    const validate = (
        parsedValue: number | bigint | Decimal | null,
        overflow: boolean,
        errorType?: "max" | "min"
    ): void => {
        let errorMessage = "";

        if (overflow || parsedValue === null) {
            // オーバーフロー時のエラー処理
            if (errorType === "max") {
                errorMessage = `${props.max}以下の値にして下さい`;
            } else if (errorType === "min") {
                errorMessage = `${props.min}以上の値にして下さい`;
            } else {
                errorMessage = "入力値が無効です";
            }
        } else {
            // 正常な値の場合の範囲チェック
            const currentValue = Decimal.isDecimal(parsedValue)
                ? parsedValue
                : new Decimal(parsedValue.toString());

            if (props.max !== undefined && currentValue.gt(new Decimal(props.max))) {
                errorMessage = `${props.max}以下の値にして下さい`;
            } else if (props.min !== undefined && currentValue.lt(new Decimal(props.min))) {
                errorMessage = `${props.min}以上の値にして下さい`;
            }
            
        }

        setError(errorMessage);
    };

    // ステップ値（増減単位）を計算する関数
    const calculateStep = (): number => {
        const safeDecimalPlaces = Math.max(0, maxDecimalPlaces); // 小数点以下桁数を取得
        const stepValue = safeDecimalPlaces > 0
            ? parseFloat(`0.${"0".repeat(safeDecimalPlaces - 1)}1`) // 小数点以下に基づくステップ値
            : 1;
        return stepValue;
    };
    

    // 入力値をフォーマットする関数
    const formatValue = (input: string): string => {
        return input; // 入力値をそのまま返す
    };

    // 入力値から小数点以下の桁数を取得する関数
    const getDecimalPlaces = (input: string): number => {
        const parts = input.split(".");
        return parts.length > 1 ? parts[1].length : 0;
    };

    // 初回レンダリング時に入力値をバリデーション
    useEffect(() => {
        const { value: initialParsedValue, overflow } = parseValue(value);
        if (initialParsedValue !== null) {
            validate(initialParsedValue, overflow);
        } else {
            setError("入力値が無効です");
        }
    }, []);

    return (
        <div className="form-group">
            <div className="row">
                {/* ラベル表示 */}
                {props.label && (
                    <label className="col-form-label col-md-6" htmlFor={`id_${props.id}`}>
                        {props.label}
                    </label>
                )}
                <div className={props.label ? "col-md-6" : "col-md-12"}>
                    {/* 数値入力フィールド */}
                    <input
                        value={value}
                        type="number"
                        onChange={onValueChanged}
                        onBlur={onBlur}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                        className={`form-control ${error ? "is-invalid" : ""} ${props.inputClass}`}
                        id={props.id}
                        step={calculateStep()}
                    />
                    {/* エラーメッセージの表示 */}
                    {error && 
                        <div className="invalid-feedback" id={`invalid_${props.id}`}>
                            {error}
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default NumberInput;
