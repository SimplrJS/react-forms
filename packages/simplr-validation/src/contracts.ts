export interface Validator {
    Validate(value: any): ValidationReturn;
}

export type ValidationReturn = Promise<void> | string | undefined;

export const VALIDATOR = "SimplrValidationValidatorComponent";
