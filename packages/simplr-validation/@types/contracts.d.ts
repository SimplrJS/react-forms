export interface Validator {
    Validate(value: any): ValidationReturn;
}
export declare type ValidationReturn = Promise<void> | string | undefined;
export declare const VALIDATOR = "SimplrValidationValidatorComponent";
