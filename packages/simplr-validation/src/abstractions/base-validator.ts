import * as React from "react";
import { Contracts as FormsCoreContracts } from "simplr-forms-core";

import { Validator, ValidationResult } from "../contracts";

export interface ValidatorProps {
    errorMessage: string;
}

export abstract class BaseValidator<TProps extends ValidatorProps>
    extends React.Component<TProps, {}> implements Validator {
    static SimplrValidationValidatorComponent(): void { }

    abstract Validate(value: FormsCoreContracts.FieldValue): ValidationResult;

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

    protected InvalidSync(error: string): string {
        return error;
    }

    render() {
        return null;
    }
}
