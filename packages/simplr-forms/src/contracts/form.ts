import { TypedRecord } from "typed-immutable-record";

import { FormStore } from "../stores/form-store";
import { FormErrorRecord } from "./error";
import { FieldValidationType } from "./validation";

export type FormOnMountCallback = (store: FormStore) => void;

export interface FormProps {
    formId?: string;
    formStore?: FormStore;
    destroyOnUnmount?: boolean;
    forceSubmit?: boolean;
    disabled?: boolean;
    fieldsValidationType?: FieldValidationType;
    formValidationType?: FieldValidationType;
    onMount?: FormOnMountCallback;
}

export type FormStateProps = FormProps & React.Props<any>;

export interface FormPropsRecord extends TypedRecord<FormPropsRecord>, FormStateProps { }

export interface FormChildContext {
    FormId: string;
}

export interface FormState {
    Props: FormStateProps;
    Validating: boolean;
    Disabled: boolean;
    Error?: FormErrorRecord;
    SubmitCallback?: () => void;
    Submitting: boolean;
    SuccessfullySubmitted: boolean;
    ActiveFieldId?: string;
}

export interface FormStateRecord extends TypedRecord<FormStateRecord>, FormState { }

export interface FormContextPropsObject { }
