import * as React from "react";
import { FieldValue } from "@simplr/react-forms/contracts";

import { Validator, ValidationResult, ValidationError } from "../contracts";

export interface BaseValidatorProps {
    error: ValidationError;
}

export abstract class BaseValidator<TProps extends BaseValidatorProps, TState>
    extends React.Component<TProps, TState> implements Validator {

    public abstract Validate(value: FieldValue): ValidationResult;

    protected SkipValidation(value: any): boolean {
        return (value == null || value === "");
    }

    protected async Valid(): Promise<void> {
        return new Promise<void>(resolve => {
            resolve();
        });
    }

    protected async Invalid(error: ValidationError): Promise<void> {
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

    public render(): any {
        return null;
    }
}
