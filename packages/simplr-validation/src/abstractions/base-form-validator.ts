import { ValidationError } from "../contracts";
import { BaseValidator, BaseValidatorProps } from "./base-validator";

export type BaseFormValidatorProps = BaseValidatorProps;

export abstract class BaseFormValidator<TProps extends BaseFormValidatorProps>
    extends BaseValidator<TProps, {}> {
    // tslint:disable-next-line:no-empty
    public static SimplrValidationFormValidatorComponent(): void { }
}
