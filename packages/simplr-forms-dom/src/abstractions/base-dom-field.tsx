import { BaseField, BaseFieldState } from "simplr-forms";
import { FieldProps } from "simplr-forms/contracts";
import {
    DomFieldProps,
    DomFieldTemplateCallback,
    DomComponentData,
    DomFieldDetails
} from "../contracts/field";
import { FormProps } from "../contracts/form";


export interface BaseDomFieldState extends BaseFieldState {

}

export abstract class BaseDomField<TProps extends DomFieldProps, TState extends BaseDomFieldState>
    extends BaseField<TProps, TState> {
    protected OnFocus = (event: React.FocusEvent<any>): void => {
        const props = this.props as DomFieldProps;
        if (props.onFocus != null) {
            props.onFocus(event);
        }

        this.Focus();
    }

    protected OnBlur = (event: React.FocusEvent<any>): void => {
        const props = this.props as DomFieldProps;
        if (props.onBlur != null) {
            props.onBlur(event);
        }

        this.Blur();
    }

    protected get FieldTemplate(): DomFieldTemplateCallback | undefined {
        const formProps = this.FormStore.GetState().Form.Props as FormProps;
        if (formProps.template) {
            return formProps.template;
        }

        if (this.props.template != null) {
            return this.props.template;
        }
    }

    protected GetHTMLProps(props: TProps) {
        const {
            defaultValue,
            destroyOnUnmount,
            disabled,
            formatValue,
            initialValue,
            name,
            normalizeValue,
            onBlur,
            onFocus,
            parseValue,
            template,
            validationType,
            value,
            children,
            ...otherProps
        } = props as DomFieldProps;

        return otherProps;
    }

    public abstract renderField(): JSX.Element | null;

    public render(): JSX.Element | null {
        if (this.FieldTemplate == null) {
            return this.renderField();
        }
        return this.FieldTemplate(
            this.renderField.bind(this),
            {
                name: this.Name,
                fieldGroupId: this.FieldsGroupId,
                id: this.FieldId
            } as DomFieldDetails,
            this.FormStore,
            {
                props: this.props,
                state: this.FieldState
            } as DomComponentData);
    }
}
