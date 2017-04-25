import * as Validator from "validator";
import { FieldValue } from "simplr-forms-core/contracts";

import { BaseValidator, ValidatorProps } from "../abstractions/base-validator";
import { ValidationResult } from "../contracts";

export interface AsciiValidatorProps extends ValidatorProps { }

export class AsciiValidator extends BaseValidator<AsciiValidatorProps> {
    Validate(value: FieldValue): ValidationResult {
        if (this.SkipValidation(value)) {
            return this.ValidSync();
        }

        if (!Validator.isAscii(value)) {
            return this.InvalidSync(this.props.error);
        }

        return this.ValidSync();
    }
}
