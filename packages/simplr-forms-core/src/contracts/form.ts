import { TypedRecord } from "typed-immutable-record";

import { FormStore } from "../stores/form-store";
import { FormErrorRecord } from "./error";

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
    Error?: FormErrorRecord;
    SubmitCallback?: () => void;
    Submitting: boolean;
    SuccessfullySubmitted: boolean;
    ActiveFieldId?: string;
}

export interface FormStateRecord extends TypedRecord<FormStateRecord>, FormState { }

export interface FormContextPropsObject { }
