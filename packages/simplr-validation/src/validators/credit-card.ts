import * as Validator from "validator";
import { Contracts } from "simplr-forms-core";

import { BaseValidator, ValidatorProps } from "../abstractions/base-validator";
import { ValidationResult } from "../contracts";

export interface CreditCardValidatorProps extends ValidatorProps {}

export class CreditCardValidator extends BaseValidator<CreditCardValidatorProps> {
    Validate(value: Contracts.FieldValue): ValidationResult {
        if (this.SkipValidation(value)) {
            return this.ValidSync();
        }

        if (!Validator.isCreditCard(value)) {
            return this.InvalidSync(this.props.errorMessage);
        }

        return this.ValidSync();
    }
}
