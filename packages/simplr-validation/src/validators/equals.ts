import * as Validator from "validator";
import { Contracts } from "simplr-forms-core";

import { BaseValidator, ValidatorProps } from "../abstractions/base-validator";
import { ValidationResult } from "../contracts";

export interface EqualsValidatorProps extends ValidatorProps {
    value: string;
}

export class EqualsValidator extends BaseValidator<EqualsValidatorProps> {
    Validate(value: Contracts.FieldValue): ValidationResult {
        if (this.SkipValidation(value)) {
            return this.ValidSync();
        }

        if (!Validator.equals(value, this.props.value)) {
            return this.InvalidSync(this.props.error);
        }

        return this.ValidSync();
    }
}
