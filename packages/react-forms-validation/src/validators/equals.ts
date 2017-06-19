import * as Validator from "validator";
import { FieldValue } from "simplr-forms/contracts";

import { BaseFieldValidator, BaseFieldValidatorProps } from "../abstractions/base-field-validator";
import { ValidationResult } from "../contracts";

export interface EqualsValidatorProps extends BaseFieldValidatorProps {
    value: string;
}

export class EqualsValidator extends BaseFieldValidator<EqualsValidatorProps> {
    public Validate(value: FieldValue): ValidationResult {
        if (this.SkipValidation(value)) {
            return this.ValidSync();
        }

        if (!Validator.equals(value, this.props.value)) {
            return this.InvalidSync(this.props.error);
        }

        return this.ValidSync();
    }
}
