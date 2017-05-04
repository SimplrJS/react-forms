import { BaseFieldValidator, ValidatorProps } from "../abstractions/base-field-validator";
import { ValidationResult } from "../contracts";

import { FieldValue } from "simplr-forms-core/contracts";

export interface RequiredValidatorProps extends ValidatorProps { }

export class RequiredValidator extends BaseFieldValidator<RequiredValidatorProps> {

    private isString(value: FieldValue) {
        return typeof value === "string";
    }

    private isArray(value: FieldValue) {
        return {}.toString.call(value) === "[object Array]";
    }

    private isObject(value: FieldValue) {
        return value === Object(value);
    }

    Validate(value: FieldValue): ValidationResult {
        if (value == null) {
            return this.InvalidSync(this.props.error);
        }

        if (this.isString(value) &&
            value.trim().length === 0) {
            return this.InvalidSync(this.props.error);
        }

        if (this.isArray(value) &&
            value.length === 0) {
            return this.InvalidSync(this.props.error);
        }

        if (this.isObject(value) &&
            Object.keys(value).length === 0) {
            return this.InvalidSync(this.props.error);
        }

        return this.ValidSync();
    }
}
