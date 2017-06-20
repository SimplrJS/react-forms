import { ValidationError, ValidationFormErrorTemplate } from "../contracts";
import { BaseValidator, BaseValidatorProps } from "./base-validator";

export interface BaseFormValidatorProps extends BaseValidatorProps {
    error: ValidationError | ValidationFormErrorTemplate;
}

export abstract class BaseFormValidator<TProps extends BaseFormValidatorProps>
    extends BaseValidator<TProps, {}> {
    // tslint:disable-next-line:no-empty
    public static SimplrValidationFormValidatorComponent(): void { }
}
