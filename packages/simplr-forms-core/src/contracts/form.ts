import { FormError } from "./error";
import { FormStore } from "../stores/form-store";

export interface FormProps {
    formId?: string;
    formStore?: FormStore;
    destroyOnUnmount?: boolean;
}

export interface FormChildContext {
    FormId: string;
}

export interface FormStoreState {
    Error: FormError | undefined;
    Submitting: boolean;
    SuccessfullySubmitted: boolean;
    SubmitCallback: Function | undefined;
    ActiveFieldId: string | undefined;
}
