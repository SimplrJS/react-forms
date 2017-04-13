import { BaseValidator, ValidatorProps } from "../abstractions/base-validator";
import { ValidationReturn } from "../contracts";
export interface RequiredValidatorProps extends ValidatorProps {
}
export declare class RequiredValidator extends BaseValidator<RequiredValidatorProps> {
    private isString(value);
    private isArray(value);
    private isObject(value);
    Validate(value: any): ValidationReturn;
}
