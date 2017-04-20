import * as Validator from "validator";
import { Contracts } from "simplr-forms-core";

import { BaseValidator, ValidatorProps } from "../abstractions/base-validator";
import { ValidationResult } from "../contracts";

export interface BooleanValidatorProps extends ValidatorProps { }

export class BooleanValidator extends BaseValidator<BooleanValidatorProps> {
    Validate(value: Contracts.FieldValue): ValidationResult {
        if (this.SkipValidation(value)) {
            return this.ValidSync();
        }

        if (!Validator.isBoolean(value)) {
            return this.InvalidSync(this.props.error);
        }

        return this.ValidSync();
    }
}
