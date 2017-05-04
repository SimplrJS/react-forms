import * as Validator from "validator";
import { FieldValue } from "simplr-forms-core/contracts";

import { BaseFieldValidator, BaseFieldProps } from "../abstractions/base-field-validator";
import { ValidationResult } from "../contracts";

export interface Base64ValidatorProps extends BaseFieldProps { }

export class Base64Validator extends BaseFieldValidator<Base64ValidatorProps> {
    Validate(value: FieldValue): ValidationResult {
        if (this.SkipValidation(value)) {
            return this.ValidSync();
        }

        if (!Validator.isBase64(value)) {
            return this.InvalidSync(this.props.error);
        }

        return this.ValidSync();
    }
}
