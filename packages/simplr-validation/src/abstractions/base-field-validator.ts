import { ValidationError } from "../contracts";
import { BaseValidator, BaseValidatorProps } from "./base-validator";

export interface BaseFieldValidatorProps extends BaseValidatorProps { }

export abstract class BaseFieldValidator<TProps extends BaseFieldValidatorProps>
    extends BaseValidator<TProps, {}> {
    static SimplrValidationFieldValidatorComponent(): void { }
}
