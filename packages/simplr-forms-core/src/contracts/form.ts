import { TypedRecord } from "typed-immutable-record";

import { FormStore } from "../stores/form-store";
import { FormErrorRecord } from "./error";
import { ValidationType } from "./validation";

export interface FormProps {
    formId?: string;
    formStore?: FormStore;
    destroyOnUnmount?: boolean;
    forceSubmit?: boolean;
    disabled?: boolean;
    fieldValidationType?: ValidationType;
    formValidationType?: ValidationType;
}

export type FormStateProps = FormProps & React.Props<any>;

export interface FormPropsRecord extends TypedRecord<FormPropsRecord>, FormStateProps { }

export interface FormChildContext {
    FormId: string;
}

export interface FormState {
    Props: FormStateProps;
    Validating: boolean;
    Error?: FormErrorRecord;
    SubmitCallback?: () => void;
    Submitting: boolean;
    SuccessfullySubmitted: boolean;
    ActiveFieldId?: string;
}

export interface FormStateRecord extends TypedRecord<FormStateRecord>, FormState { }

export interface FormContextPropsObject { }
