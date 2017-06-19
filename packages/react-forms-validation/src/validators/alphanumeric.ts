import * as Validator from "validator";
import { FieldValue } from "@simplr/react-forms/contracts";

import { BaseFieldValidator, BaseFieldValidatorProps } from "../abstractions/base-field-validator";
import { ValidationResult } from "../contracts";

export interface AlphanumericValidatorProps extends BaseFieldValidatorProps {
    locale?: ValidatorJS.AlphanumericLocale;
}

export class AlphanumericValidator extends BaseFieldValidator<AlphanumericValidatorProps> {
    public Validate(value: FieldValue): ValidationResult {
        if (this.SkipValidation(value)) {
            return this.ValidSync();
        }

        if (!Validator.isAlphanumeric(value, this.props.locale)) {
            return this.InvalidSync(this.props.error);
        }

        return this.ValidSync();
    }
}
