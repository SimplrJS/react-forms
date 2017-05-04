import { TypedRecord } from "typed-immutable-record";

import { FormError } from "./error";
import { FormStore } from "../stores/form-store";

export interface FormProps {
    formId?: string;
    formStore?: FormStore;
    destroyOnUnmount?: boolean;
    forceSubmit?: boolean;
    disabled?: boolean;
}

export interface FormPropsRecord extends TypedRecord<FormPropsRecord>, FormProps { }

export interface FormChildContext {
    FormId: string;
}

export interface FormState {
    Props: FormPropsRecord;
    Validating: boolean;
    Error?: FormError;
    SubmitCallback?: () => void;
    Submitting: boolean;
    SuccessfullySubmitted: boolean;
    ActiveFieldId?: string;
}

export interface FormStateRecord extends TypedRecord<FormStateRecord>, FormState { }

export interface FormContextPropsObject { }
