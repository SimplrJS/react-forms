import { ValidationError } from "../contracts";
import { BaseValidator, BaseValidatorProps } from "./base-validator";

export type BaseFieldValidatorProps = BaseValidatorProps;

export abstract class BaseFieldValidator<TProps extends BaseFieldValidatorProps>
    extends BaseValidator<TProps, {}> {
    // tslint:disable-next-line:no-empty
    public static SimplrValidationFieldValidatorComponent(): void { }
}
