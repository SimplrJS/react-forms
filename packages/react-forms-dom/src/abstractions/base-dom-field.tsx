import { BaseField, BaseFieldState } from "@simplr/react-forms";
import { FormProps } from "@simplr/react-forms/contracts";
import * as classnames from "classnames";
import {
    DomFieldProps,
    DomFieldTemplateCallback,
    DomComponentData,
    DomFieldDetails
} from "../contracts/field";
import { BaseFormProps } from "../contracts/form";

export type BaseDomFieldState = BaseFieldState;

export abstract class BaseDomField<TProps extends DomFieldProps, TState extends BaseDomFieldState, TUnderlyingElement = any>
    extends BaseField<TProps, TState> {
    public Element: TUnderlyingElement | null;

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
        const formProps = this.FormStore.GetState().Form.Props as BaseFormProps;
        if (this.props.template != null) {
            return this.props.template;
        }

        if (formProps.template) {
            return formProps.template;
        }
    }

    protected GetHTMLProps(props: DomFieldProps): {} {
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
            errorClassName,
            ...restProps
        } = props;

        return restProps;
    }

    protected SetElementRef = (element: TUnderlyingElement | null): void => {
        this.Element = element;
    }

    protected AddErrorClassName(className?: string): string | undefined {
        // If field has no error
        if (this.FieldState.Error == null) {
            return className;
        }

        // We know props interface and can cast safely, while using only getters
        const fieldProps = this.FieldState.Props as Readonly<DomFieldProps> | undefined;

        // errorClassName is optional, so there is no harm in casting with `as`
        const formProps = this.FormStore.GetState().Form.Props as Readonly<FormProps>;

        const errorClassName = this.resolveErrorClassName(fieldProps, formProps);

        // If there is no errorClassName defined
        if (errorClassName == null) {
            return className;
        }

        return classnames(className, errorClassName);
    }

    private resolveErrorClassName(
        fieldProps: Readonly<DomFieldProps> | undefined,
        formProps: Readonly<FormProps> | undefined): string | undefined {
        if (fieldProps != null && fieldProps.errorClassName != null) {
            return fieldProps.errorClassName;
        }

        if (formProps != null && formProps.errorClassName != null) {
            return formProps.errorClassName;
        }
        return undefined;
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
