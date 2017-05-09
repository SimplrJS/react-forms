import { BaseField, BaseFieldState } from "simplr-forms";
import { FieldProps } from "simplr-forms/contracts";

export interface BaseDomFieldState extends BaseFieldState {

}

export abstract class BaseDomField<TProps extends FieldProps, TState extends BaseDomFieldState>
    extends BaseField<TProps, TState> {
    public abstract renderField(): JSX.Element | null;

    public render() {
        // TODO: FieldTemplate
        return this.renderField();
    }
}
