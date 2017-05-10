import * as Validator from "validator";
import { FieldValue } from "simplr-forms/contracts";

import { BaseFieldValidator, BaseFieldValidatorProps } from "../abstractions/base-field-validator";
import { ValidationResult } from "../contracts";

export interface AsciiValidatorProps extends BaseFieldValidatorProps { }

export class AsciiValidator extends BaseFieldValidator<AsciiValidatorProps> {
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
