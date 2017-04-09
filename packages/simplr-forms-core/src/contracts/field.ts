import { FormError } from "./error";
import { TypedRecord } from "typed-immutable-record";

// Field value can be of any type or undefined
export type FieldValueType = any | undefined;

export type FieldFormatValueCallback = (value: FieldValueType) => FieldValueType;
export type FieldParseValueCallback = (value: FieldValueType) => FieldValueType;
export type FieldNormalizeValueCallback = (value: FieldValueType) => FieldValueType;

export interface FieldProps {
    name: string;
    destroyOnUnmount?: boolean;
    formatValue?: FieldFormatValueCallback;
    parseValue?: FieldParseValueCallback;
    normalizeValue?: FieldNormalizeValueCallback;
    validationType?: FieldValidationType;
    onBlur?: (event: any) => void;
    onFocus?: (event: any) => void;
    children?: React.ReactNode;
}

export interface FieldState {
    InitialValue: FieldValueType;
    Value: FieldValueType;
    Error?: FormError;
    Touched: boolean;
    Pristine: boolean;
    Validating: boolean;
    Validators?: Array<JSX.Element | any>;
    FieldsGroup?: {
        Id: string;
    };
}

export interface FieldStateRecord extends TypedRecord<FieldStateRecord>, FieldState { }

export enum FieldValidationType {
    None,
    OnChange,
    OnBlur
}
