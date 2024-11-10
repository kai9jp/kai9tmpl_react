export type NumberInputProps = {
    onChange: Function,
    id: string,
    label?: string,
    value: number,
    max?: number,
    min?: number,
    inputClass?: string,
    field: string,
    is_need_ValidCheck?: boolean,
    disabled?:boolean
    onMouseDown?:any;
    className?: string;
    noFormGroup?:boolean
};

export type OnChangeNumberModel = {
    value: number,
    error: string,
    touched: boolean
};