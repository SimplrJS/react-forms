import * as React from "react";

import * as Contracts from "../contracts";

export interface ValidatorProps {
    errorMessage: string;
}

export abstract class BaseValidator<TProps extends ValidatorProps>
    extends React.Component<TProps, {}> implements Contracts.Validator {
    static SimplrValidationValidatorComponent(): void { }

    abstract Validate(value: any): Contracts.ValidationReturn;

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
