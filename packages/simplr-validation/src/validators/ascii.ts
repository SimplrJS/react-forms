import * as Validator from "validator";
import { Contracts } from "simplr-forms-core";

import { BaseValidator, ValidatorProps } from "../abstractions/base-validator";
import { ValidationResult } from "../contracts";

export interface AsciiValidatorProps extends ValidatorProps { }

export class AsciiValidator extends BaseValidator<AsciiValidatorProps> {
    Validate(value: Contracts.FieldValue): ValidationResult {
        if (this.SkipValidation(value)) {
            return this.ValidSync();
        }

        if (!Validator.isAscii(value)) {
            return this.InvalidSync(this.props.errorMessage);
        }

        return this.ValidSync();
    }
}
