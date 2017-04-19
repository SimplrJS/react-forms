import * as Validator from "validator";
import { Contracts } from "simplr-forms-core";

import { BaseValidator, ValidatorProps } from "../abstractions/base-validator";
import { ValidationResult } from "../contracts";

export interface CurrencyValidatorProps extends ValidatorProps {
    options: ValidatorJS.IsCurrencyOptions;
}

export class CurrencyValidator extends BaseValidator<CurrencyValidatorProps> {
    Validate(value: Contracts.FieldValue): ValidationResult {
        if (this.SkipValidation(value)) {
            return this.ValidSync();
        }

        if (!Validator.isCurrency(value, this.props.options)) {
            return this.InvalidSync(this.props.errorMessage);
        }

        return this.ValidSync();
    }
}
