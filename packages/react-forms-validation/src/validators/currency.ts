import * as Validator from "validator";
import { FieldValue } from "@simplr/react-forms";

import { BaseFieldValidator, BaseFieldValidatorProps } from "../abstractions/base-field-validator";
import { ValidationResult } from "../contracts";

export interface CurrencyValidatorProps extends BaseFieldValidatorProps {
    options: ValidatorJS.IsCurrencyOptions;
}

export class CurrencyValidator extends BaseFieldValidator<CurrencyValidatorProps> {
    public Validate(value: FieldValue): ValidationResult {
        if (this.SkipValidation(value)) {
            return this.ValidSync();
        }

        if (!Validator.isCurrency(value, this.props.options)) {
            return this.InvalidSync(this.props.error);
        }

        return this.ValidSync();
    }
}
