import * as Validator from "validator";
import { FieldValue } from "simplr-forms-core/contracts";

import { BaseValidator, ValidatorProps } from "../abstractions/base-field-validator";
import { ValidationResult } from "../contracts";

export interface CurrencyValidatorProps extends ValidatorProps {
    options: ValidatorJS.IsCurrencyOptions;
}

export class CurrencyValidator extends BaseValidator<CurrencyValidatorProps> {
    Validate(value: FieldValue): ValidationResult {
        if (this.SkipValidation(value)) {
            return this.ValidSync();
        }

        if (!Validator.isCurrency(value, this.props.options)) {
            return this.InvalidSync(this.props.error);
        }

        return this.ValidSync();
    }
}
