import { TypedRecord } from "typed-immutable-record";
import { FormError } from "./error";

// Field value can be of any type or undefined
export type FieldValue = any | undefined;

export type FieldFormatValueCallback = (value: FieldValue) => FieldValue;
export type FieldParseValueCallback = (value: FieldValue) => FieldValue;
export type FieldNormalizeValueCallback = (value: FieldValue) => FieldValue;

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
    InitialValue: FieldValue;
    Value: FieldValue;
    Error?: FormErrorRecord;
    Touched: boolean;
    Pristine: boolean;
    Validating: boolean;
    FieldsGroup?: {
        Id: string;
    };
    Props?: FieldStatePropsRecord;
}

export type FieldStateProps = FieldProps & React.Props<void>;

export interface FieldStateRecord extends TypedRecord<FieldStateRecord>, FieldState { }
export interface FieldStatePropsRecord extends TypedRecord<FieldStatePropsRecord>, FieldStateProps { }
export interface FormErrorRecord extends TypedRecord<FormErrorRecord>, FormError { }

export enum FieldValidationType {
    None,
    OnChange,
    OnBlur
}
