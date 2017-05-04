import { ValidationError } from "../contracts";
import { BaseValidator, BaseValidatorProps } from "./base-validator";

export interface BaseFormValidatorProps extends BaseValidatorProps { }

export abstract class BaseFieldValidator<TProps extends BaseFormValidatorProps>
    extends BaseValidator<TProps, {}> {
    static SimplrValidationFormValidatorComponent(): void { }
}
