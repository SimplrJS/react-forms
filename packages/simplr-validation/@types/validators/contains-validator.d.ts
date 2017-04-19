import { BaseValidator, ValidatorProps } from "../abstractions/base-validator";
import { ValidationReturn } from "../contracts";
export interface ContainsValidatorProps extends ValidatorProps {
    value: string;
}
export declare class ContainsValidator extends BaseValidator<ContainsValidatorProps> {
    Validate(value: any): ValidationReturn;
}
