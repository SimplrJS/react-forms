import * as Validator from "validator";

import { BaseValidator, ValidatorProps } from "../abstractions/base-validator";
import { ValidationReturn } from "../contracts";

export interface ContainsValidatorProps extends ValidatorProps {
    value: string;
}

export class ContainsValidator extends BaseValidator<ContainsValidatorProps> {
    Validate(value: any): ValidationReturn {
        if (this.SkipValidation(value)) {
            return this.ValidSync();
        }

        if (!Validator.contains(value, this.props.value)) {
            return this.InvalidSync(this.props.errorMessage);
        }

        return this.ValidSync();
    }
}
