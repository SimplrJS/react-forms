import * as Validator from "validator";
import { FieldValue } from "simplr-forms-core/contracts";

import { BaseFieldValidator, BaseFieldProps } from "../abstractions/base-field-validator";
import { ValidationResult } from "../contracts";

export interface AlphaValidatorProps extends BaseFieldProps {
    locale?: ValidatorJS.AlphaLocale;
}

export class AlphaValidator extends BaseFieldValidator<AlphaValidatorProps> {
    Validate(value: FieldValue): ValidationResult {
        if (this.SkipValidation(value)) {
            return this.ValidSync();
        }

        if (!Validator.isAlpha(value, this.props.locale)) {
            return this.InvalidSync(this.props.error);
        }

        return this.ValidSync();
    }
}
