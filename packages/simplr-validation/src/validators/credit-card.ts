import * as Validator from "validator";
import { FieldValue } from "simplr-forms-core/contracts";

import { BaseFieldValidator, BaseFieldProps } from "../abstractions/base-field-validator";
import { ValidationResult } from "../contracts";

export interface CreditCardValidatorProps extends BaseFieldProps {}

export class CreditCardValidator extends BaseFieldValidator<CreditCardValidatorProps> {
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
