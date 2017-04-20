import * as React from "react";
import { Abstractions as CoreAbstractions, Contracts as CoreContracts } from "simplr-forms-core";

export interface BaseDomFieldState extends CoreAbstractions.BaseFieldState {

}

export abstract class BaseDomField<TProps extends CoreContracts.FieldProps, TState extends BaseDomFieldState>
    extends CoreAbstractions.BaseField<TProps, TState> {
    public abstract renderField(): JSX.Element | null;

    public render() {
        return this.renderField();
    }
}
