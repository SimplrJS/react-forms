import { FormError } from "simplr-forms/contracts";

export interface Validator {
    Validate(value: any): ValidationResult;
}

export type ValidationError = string | FormError;

export type ValidationResult = Promise<void> | ValidationError | undefined;

export const FIELD_VALIDATOR_FUNCTION_NAME = "SimplrValidationFieldValidatorComponent";
export const FORM_VALIDATOR_FUNCTION_NAME = "SimplrValidationFormValidatorComponent";

export enum SubscriberType {
    // Manually = 8,
    Automatically = 16
}
