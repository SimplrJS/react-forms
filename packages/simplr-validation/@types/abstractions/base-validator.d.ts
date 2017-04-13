/// <reference types="react" />
import * as React from "react";
import * as Contracts from "../contracts";
export interface ValidatorProps {
    errorMessage: string;
}
export declare abstract class BaseValidator<TProps extends ValidatorProps> extends React.Component<TProps, {}> implements Contracts.Validator {
    static SimplrValidationValidatorComponent(): void;
    abstract Validate(value: any): Contracts.ValidationReturn;
    protected SkipValidation(value: any): boolean;
    protected Valid(): Promise<void>;
    protected Invalid(error: string): Promise<void>;
    protected ValidSync(): undefined;
    protected InvalidSync(error: string): string;
    render(): null;
}
