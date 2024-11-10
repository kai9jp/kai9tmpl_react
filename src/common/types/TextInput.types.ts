export type TextInputProps = {
    required: boolean,
    onChange: Function,
    id: string,
    label: string,
    placeholder: string,
    value: string,
    type?: string,
    maxLength?: number,
    minLength?: number,
    inputClass?: string,
    field: string
    Pattern_regexp?: string;
    Pattern_message?: string;
    disabled?:boolean;
    inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search' |undefined;    
    isImeDisble?:boolean;
};