import { FieldValue } from "simplr-forms-core/contracts";

import { Validator, ValidationError } from "../contracts";
import { BaseValidator } from "./base-validator";

export interface ValidatorProps {
    error: ValidationError;
}

export abstract class BaseFieldValidator<TProps extends ValidatorProps>
    extends BaseValidator<TProps, {}> {
    static SimplrValidationValidatorComponent(): void { }
}
