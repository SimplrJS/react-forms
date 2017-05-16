import { BaseField, BaseFieldState } from "simplr-forms";
import { FieldProps } from "simplr-forms/contracts";

export interface BaseDomFieldState extends BaseFieldState {

}

export abstract class BaseDomField<TProps extends FieldProps, TState extends BaseDomFieldState>
    extends BaseField<TProps, TState> {
    protected OnFocus = (event: React.FocusEvent<HTMLInputElement>): void => {
        const props = this.props as FieldProps;
        if (props.onFocus != null) {
            props.onFocus(event);
        }

        this.Focus();
    }

    protected OnBlur = (event: React.FocusEvent<HTMLInputElement>): void => {
        const props = this.props as FieldProps;
        if (props.onBlur != null) {
            props.onBlur(event);
        }

        this.Blur();
    }

    public abstract renderField(): JSX.Element | null;

    public render(): JSX.Element | null {
        // TODO: FieldTemplate
        return this.renderField();
    }
}
