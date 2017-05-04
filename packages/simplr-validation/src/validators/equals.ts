import * as Validator from "validator";
import { FieldValue } from "simplr-forms-core/contracts";

import { BaseFieldValidator, BaseFieldProps } from "../abstractions/base-field-validator";
import { ValidationResult } from "../contracts";

export interface EqualsValidatorProps extends BaseFieldProps {
    value: string;
}

export class EqualsValidator extends BaseFieldValidator<EqualsValidatorProps> {
    Validate(value: FieldValue): ValidationResult {
        if (this.SkipValidation(value)) {
            return this.ValidSync();
        }

        if (!Validator.equals(value, this.props.value)) {
            return this.InvalidSync(this.props.error);
        }

        return this.ValidSync();
    }
}
