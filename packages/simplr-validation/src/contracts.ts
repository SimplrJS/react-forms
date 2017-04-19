export interface Validator {
    Validate(value: any): ValidationResult;
}

export type ValidationResult = Promise<void> | string | undefined;

export const VALIDATOR_FUNCTION_NAME = "SimplrValidationValidatorComponent";

export const enum SubscriberType {
    // Manually = 8,
    Automatically = 16
}
