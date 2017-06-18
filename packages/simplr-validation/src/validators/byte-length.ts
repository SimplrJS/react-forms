import * as Validator from "validator";
import { FieldValue } from "simplr-forms/contracts";

import { BaseFieldValidator, BaseFieldValidatorProps } from "../abstractions/base-field-validator";
import { ValidationResult } from "../contracts";

export interface ByteLengthValidatorProps extends BaseFieldValidatorProps {
    options: ValidatorJS.IsByteLengthOptions;
}

export class ByteLengthValidator extends BaseFieldValidator<ByteLengthValidatorProps> {
    public Validate(value: FieldValue): ValidationResult {
        if (this.SkipValidation(value)) {
            return this.ValidSync();
        }

        if (!Validator.isByteLength(value, this.props.options)) {
            return this.InvalidSync(this.props.error);
        }

        return this.ValidSync();
    }
}
