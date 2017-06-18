import { BaseFieldValidator, BaseFieldValidatorProps } from "../abstractions/base-field-validator";
import { ValidationResult } from "../contracts";

import { FieldValue } from "simplr-forms/contracts";

export type RequiredValidatorProps = BaseFieldValidatorProps;

export class RequiredValidator extends BaseFieldValidator<RequiredValidatorProps> {

    private isString(value: FieldValue): boolean {
        return typeof value === "string";
    }

    private isArray(value: FieldValue): boolean {
        return {}.toString.call(value) === "[object Array]";
    }

    private isObject(value: FieldValue): boolean {
        return value === Object(value);
    }

    public Validate(value: FieldValue): ValidationResult {
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
