import * as Validator from "validator";
import { FieldValue } from "simplr-forms-core/contracts";

import { BaseValidator, ValidatorProps } from "../abstractions/base-validator";
import { ValidationResult } from "../contracts";

export interface CreditCardValidatorProps extends ValidatorProps {}

export class CreditCardValidator extends BaseValidator<CreditCardValidatorProps> {
    Validate(value: FieldValue): ValidationResult {
        if (this.SkipValidation(value)) {
            return this.ValidSync();
        }

        if (!Validator.isCreditCard(value)) {
            return this.InvalidSync(this.props.error);
        }

        return this.ValidSync();
    }
}
