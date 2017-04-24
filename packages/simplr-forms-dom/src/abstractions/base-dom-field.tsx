import * as React from "react";
import { BaseField, BaseFieldState } from "simplr-forms-core";
import { FieldProps } from "simplr-forms-core/contracts";

export interface BaseDomFieldState extends BaseFieldState {

}

export abstract class BaseDomField<TProps extends FieldProps, TState extends BaseDomFieldState>
    extends BaseField<TProps, TState> {
    public abstract renderField(): JSX.Element | null;

    public render() {
        return this.renderField();
    }
}
