import { ValidationError, ValidationFieldErrorTemplate } from "../contracts";
import { BaseValidator, BaseValidatorProps } from "./base-validator";

export interface BaseFieldValidatorProps extends BaseValidatorProps {
    error: ValidationError<ValidationFieldErrorTemplate>;
}

export abstract class BaseFieldValidator<TProps extends BaseFieldValidatorProps>
    extends BaseValidator<TProps, {}> {
    // tslint:disable-next-line:no-empty
    public static SimplrValidationFieldValidatorComponent(): void { }
}
