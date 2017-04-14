export interface Validator {
    Validate(value: any): ValidationReturn;
}

export type ValidationReturn = Promise<string> | string | undefined;

export const VALIDATOR = "SimplrValidationValidatorComponent";
