import * as React from "react";
import { FieldValue } from "simplr-forms-core/contracts";

import { Validator, ValidationResult, ValidationError } from "../contracts";

export interface ValidatorProps {
    error: ValidationError;
}

export abstract class BaseValidator<TProps extends ValidatorProps>
    extends React.Component<TProps, {}> implements Validator {
    static SimplrValidationValidatorComponent(): void { }

    abstract Validate(value: FieldValue): ValidationResult;

    protected SkipValidation(value: any) {
        return (value == null || value === "");
    }

    protected Valid(): Promise<void> {
        return new Promise<void>(resolve => {
            resolve();
        });
    }

    protected Invalid(error: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            reject(error);
        });
    }

    protected ValidSync(): undefined {
        return;
    }

    protected InvalidSync(error: ValidationError): ValidationError {
        return error;
    }

    render() {
        return null;
    }
}
