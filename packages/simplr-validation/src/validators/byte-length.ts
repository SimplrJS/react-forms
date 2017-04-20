import * as Validator from "validator";
import { Contracts } from "simplr-forms-core";

import { BaseValidator, ValidatorProps } from "../abstractions/base-validator";
import { ValidationResult } from "../contracts";

export interface ByteLengthValidatorProps extends ValidatorProps {
    options: ValidatorJS.IsByteLengthOptions;
}

export class ByteLengthValidator extends BaseValidator<ByteLengthValidatorProps> {
    Validate(value: Contracts.FieldValue): ValidationResult {
        if (this.SkipValidation(value)) {
            return this.ValidSync();
        }

        if (!Validator.isByteLength(value, this.props.options)) {
            return this.InvalidSync(this.props.error);
        }

        return this.ValidSync();
    }
}
