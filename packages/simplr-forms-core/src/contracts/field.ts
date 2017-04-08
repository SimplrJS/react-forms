import { FormError } from "./error";

// Field value can be of any type or undefined
export type ValueType = any | undefined;

export type FieldFormatValueCallback = (value: ValueType) => ValueType;
export type FieldParseValueCallback = (value: ValueType) => ValueType;
export type FieldNormalizeValueCallback = (value: ValueType) => ValueType;

export interface FieldStoreState<TValue> {
    InitialValue: TValue;
    Value: TValue;
    Error?: FormError;
    Touched: boolean;
    Pristine: boolean;
    Validating: boolean;
    Validators?: Array<JSX.Element | any>;
    FieldsGroup?: {
        Id: string;
    };
}

export interface FieldProps {
    name: string;
    destroyOnUnmount?: boolean;
    formatValue?: FieldFormatValueCallback;
    parseValue?: FieldParseValueCallback;
    normalizeValue?: FieldNormalizeValueCallback;
    validationType?: ValidationType;
    onBlur?: (event: any) => void;
    onFocus?: (event: any) => void;
    children?: React.ReactNode;
}

export enum ValidationType {
    None,
    OnChange,
    OnBlur
}
