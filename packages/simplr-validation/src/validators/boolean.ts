import * as Validator from "validator";
import { FieldValue } from "simplr-forms/contracts";

import { BaseFieldValidator, BaseFieldValidatorProps } from "../abstractions/base-field-validator";
import { ValidationResult } from "../contracts";

export type BooleanValidatorProps = BaseFieldValidatorProps;

export class BooleanValidator extends BaseFieldValidator<BooleanValidatorProps> {
    public Validate(value: FieldValue): ValidationResult {
        if (this.SkipValidation(value)) {
            return this.ValidSync();
        }

        if (!Validator.isBoolean(value)) {
            return this.InvalidSync(this.props.error);
        }

        return this.ValidSync();
    }
}
