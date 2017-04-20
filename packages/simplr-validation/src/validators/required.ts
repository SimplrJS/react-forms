import { BaseValidator, ValidatorProps } from "../abstractions/base-validator";
import { ValidationResult } from "../contracts";

import { Contracts } from "simplr-forms-core";

export interface RequiredValidatorProps extends ValidatorProps { }

export class RequiredValidator extends BaseValidator<RequiredValidatorProps> {

    private isString(value: Contracts.FieldValue) {
        return typeof value === "string";
    }

    private isArray(value: Contracts.FieldValue) {
        return {}.toString.call(value) === "[object Array]";
    }

    private isObject(value: Contracts.FieldValue) {
        return value === Object(value);
    }

    Validate(value: Contracts.FieldValue): ValidationResult {
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
