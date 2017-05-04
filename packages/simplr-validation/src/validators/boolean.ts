import * as Validator from "validator";
import { FieldValue } from "simplr-forms-core/contracts";

import { BaseValidator, ValidatorProps } from "../abstractions/base-field-validator";
import { ValidationResult } from "../contracts";

export interface BooleanValidatorProps extends ValidatorProps { }

export class BooleanValidator extends BaseValidator<BooleanValidatorProps> {
    Validate(value: FieldValue): ValidationResult {
        if (this.SkipValidation(value)) {
            return this.ValidSync();
        }

        if (!Validator.isBoolean(value)) {
            return this.InvalidSync(this.props.error);
        }

        return this.ValidSync();
    }
}
