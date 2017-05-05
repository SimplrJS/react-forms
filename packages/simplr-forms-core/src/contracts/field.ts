import { TypedRecord } from "typed-immutable-record";
import { FormErrorRecord } from "./error";

// Field value can be of any type or undefined
export type FieldValue = any | undefined;

export type FieldFormatValueCallback = (value: FieldValue) => FieldValue;
export type FieldParseValueCallback = (value: FieldValue) => FieldValue;
export type FieldNormalizeValueCallback = (value: FieldValue) => FieldValue;

export interface CoreFieldProps {
    name: string;
    destroyOnUnmount?: boolean;
    formatValue?: FieldFormatValueCallback;
    parseValue?: FieldParseValueCallback;
    normalizeValue?: FieldNormalizeValueCallback;
    validationType?: FieldValidationType;
    onBlur?: (event: any) => void;
    onFocus?: (event: any) => void;
}

export interface FieldProps extends CoreFieldProps {
    defaultValue?: FieldValue;
    initialValue?: FieldValue;
    value?: FieldValue;
}

export interface FieldState {
    DefaultValue: FieldValue;
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

export type FieldStateProps = CoreFieldProps & React.Props<any>;

export interface FieldStateRecord extends TypedRecord<FieldStateRecord>, FieldState { }
export interface FieldStatePropsRecord extends TypedRecord<FieldStatePropsRecord>, FieldStateProps { }

export enum FieldValidationType {
    None,
    OnFieldRegistered = 1 << 1,
    OnValueChange = 1 << 2,
    OnPropsChange = 1 << 3
}
