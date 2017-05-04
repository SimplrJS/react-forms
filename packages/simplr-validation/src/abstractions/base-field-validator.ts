import { FieldValue } from "simplr-forms-core/contracts";

import { Validator, ValidationError } from "../contracts";
import { BaseValidator, BaseValidatorProps } from "./base-validator";

export interface BaseFieldProps extends BaseValidatorProps {
    error: ValidationError;
}

export abstract class BaseFieldValidator<TProps extends BaseFieldProps>
    extends BaseValidator<TProps, {}> {
    static SimplrValidationValidatorComponent(): void { }
}
