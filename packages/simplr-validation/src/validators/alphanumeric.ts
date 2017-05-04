import * as Validator from "validator";
import { FieldValue } from "simplr-forms-core/contracts";

import { BaseFieldValidator, ValidatorProps } from "../abstractions/base-field-validator";
import { ValidationResult } from "../contracts";

export interface AlphanumericValidatorProps extends ValidatorProps {
    locale?: ValidatorJS.AlphanumericLocale;
}

export class AlphanumericValidator extends BaseFieldValidator<AlphanumericValidatorProps> {
    Validate(value: FieldValue): ValidationResult {
        if (this.SkipValidation(value)) {
            return this.ValidSync();
        }

        if (!Validator.isAlphanumeric(value, this.props.locale)) {
            return this.InvalidSync(this.props.error);
        }

        return this.ValidSync();
    }
}
