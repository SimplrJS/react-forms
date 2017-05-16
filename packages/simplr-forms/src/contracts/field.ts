import { TypedRecord } from "typed-immutable-record";
import { FormErrorRecord } from "./error";
import { FieldValidationType } from "./validation";
import { FormContextPropsObject } from "./form";
import { FieldsGroupContextProps } from "./fields-group";

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

export interface FieldStoreState {
    Name: string;
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
    Props?: FieldStorePropsRecord;
}

export type FieldStoreProps = CoreFieldProps & React.Props<any>;

export interface FieldStoreStateRecord extends TypedRecord<FieldStoreStateRecord>, FieldStoreState { }

export interface FieldStorePropsRecord extends TypedRecord<FieldStorePropsRecord>, FieldStoreProps { }

export interface FieldContext {
    FormId: string;
    FormProps: FormContextPropsObject;
    FieldsGroupId: string;
    FieldsGroupProps: FieldsGroupContextProps;
}
