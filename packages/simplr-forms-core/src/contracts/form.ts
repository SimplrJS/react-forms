import { FormError } from "./error";
import { FormStore } from "../stores/form-store";
import { TypedRecord } from "typed-immutable-record";

export interface FormProps {
    formId?: string;
    formStore?: FormStore;
    destroyOnUnmount?: boolean;
}

export interface FormChildContext {
    FormId: string;
}

export interface FormState {
    Error: FormError | undefined;
    Submitting: boolean;
    SuccessfullySubmitted: boolean;
    SubmitCallback: Function | undefined;
    ActiveFieldId: string | undefined;
}

export interface FormStateRecord extends TypedRecord<FormStateRecord>, FormState { }