import * as Validator from "validator";
import { Contracts } from "simplr-forms-core";

import { BaseValidator, ValidatorProps } from "../abstractions/base-validator";
import { ValidationResult } from "../contracts";

export interface ContainsValidatorProps extends ValidatorProps {
    value: string;
}

export class ContainsValidator extends BaseValidator<ContainsValidatorProps> {
    Validate(value: Contracts.FieldValue): ValidationResult {
        if (this.SkipValidation(value)) {
            return this.ValidSync();
        }

        if (!Validator.contains(value, this.props.value)) {
            return this.InvalidSync(this.props.error);
        }

        return this.ValidSync();
    }
}
