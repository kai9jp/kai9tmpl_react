export type TextAreaProps = {
    required: boolean,
    onChange: Function,
    id: string,
    label: string,
    placeholder: string,
    value: string,
    maxLength?: number,
    minLength?: number,
    inputClass?: string,
    field: string,
    Pattern_regexp?: string;
    Pattern_message?: string;
    rows?: number,
    cols?: number,
    disabled?:boolean,
};