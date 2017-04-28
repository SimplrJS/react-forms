import { FormError } from "simplr-forms-core/contracts";

export interface Validator {
    Validate(value: any): ValidationResult;
}

export type ValidationError = string | FormError;

export type ValidationResult = Promise<void> | ValidationError | undefined;

export const VALIDATOR_FUNCTION_NAME = "SimplrValidationValidatorComponent";

export enum SubscriberType {
    // Manually = 8,
    Automatically = 16
}