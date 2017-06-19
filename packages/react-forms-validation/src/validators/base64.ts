import * as Validator from "validator";
import { FieldValue } from "@simplr/react-forms/contracts";

import { BaseFieldValidator, BaseFieldValidatorProps } from "../abstractions/base-field-validator";
import { ValidationResult } from "../contracts";

export type Base64ValidatorProps = BaseFieldValidatorProps;

export class Base64Validator extends BaseFieldValidator<Base64ValidatorProps> {
    public Validate(value: FieldValue): ValidationResult {
        if (this.SkipValidation(value)) {
            return this.ValidSync();
        }

        if (!Validator.isBase64(value)) {
            return this.InvalidSync(this.props.error);
        }

        return this.ValidSync();
    }
}
