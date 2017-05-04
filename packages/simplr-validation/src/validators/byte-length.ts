import * as Validator from "validator";
import { FieldValue } from "simplr-forms-core/contracts";

import { BaseFieldValidator, BaseFieldProps } from "../abstractions/base-field-validator";
import { ValidationResult } from "../contracts";

export interface ByteLengthValidatorProps extends BaseFieldProps {
    options: ValidatorJS.IsByteLengthOptions;
}

export class ByteLengthValidator extends BaseFieldValidator<ByteLengthValidatorProps> {
    Validate(value: FieldValue): ValidationResult {
        if (this.SkipValidation(value)) {
            return this.ValidSync();
        }

        if (!Validator.isByteLength(value, this.props.options)) {
            return this.InvalidSync(this.props.error);
        }

        return this.ValidSync();
    }
}
