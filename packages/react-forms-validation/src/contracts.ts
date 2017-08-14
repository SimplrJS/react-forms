import { FormError } from "@simplr/react-forms/contracts";
import { FormStore } from "@simplr/react-forms/stores";

export interface Validator {
    Validate(value: any): ValidationResult;
}

export type ValidationError<TTemplateFunc = (...args: any[]) => void> = string | FormError | TTemplateFunc;

export type ValidationFormErrorTemplate = (formStore: FormStore) => ValidationError;
export type ValidationFieldErrorTemplate = (fieldId: string, formStore: FormStore) => ValidationError;

export type ValidationResult = Promise<void> | ValidationError | undefined;

export const FIELD_VALIDATOR_FUNCTION_NAME = "SimplrValidationFieldValidatorComponent";
export const FORM_VALIDATOR_FUNCTION_NAME = "SimplrValidationFormValidatorComponent";

export enum SubscriberType {
    // Manually = 8,
    Automatically = 16
}
