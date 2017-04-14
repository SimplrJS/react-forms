import { BaseValidator, ValidatorProps } from "../abstractions/base-validator";
import { ValidationReturn } from "../contracts";

export interface RequiredValidatorProps extends ValidatorProps { }

export class RequiredValidator extends BaseValidator<RequiredValidatorProps> {

    private isString(value: any) {
        return typeof value === "string";
    }

    private isArray(value: any) {
        return {}.toString.call(value) === "[object Array]";
    }

    private isObject(value: any) {
        return value === Object(value);
    }

    Validate(value: any): ValidationReturn {
        if (value == null) {
            return this.InvalidSync(this.props.errorMessage);
        }

        if (this.isString(value) &&
            value.trim().length === 0) {
            return this.InvalidSync(this.props.errorMessage);
        }

        if (this.isArray(value) &&
            value.length === 0) {
            return this.InvalidSync(this.props.errorMessage);
        }

        if (this.isObject(value) &&
            Object.keys(value).length === 0) {
            return this.InvalidSync(this.props.errorMessage);
        }

        return this.ValidSync();
    }
}
