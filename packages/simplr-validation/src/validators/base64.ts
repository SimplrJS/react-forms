import * as Validator from "validator";
import { Contracts } from "simplr-forms-core";

import { BaseValidator, ValidatorProps } from "../abstractions/base-validator";
import { ValidationResult } from "../contracts";

export interface Base64ValidatorProps extends ValidatorProps { }

export class Base64Validator extends BaseValidator<Base64ValidatorProps> {
    Validate(value: Contracts.FieldValue): ValidationResult {
        if (this.SkipValidation(value)) {
            return this.ValidSync();
        }

        if (!Validator.isBase64(value)) {
            return this.InvalidSync(this.props.error);
        }

        return this.ValidSync();
    }
}
