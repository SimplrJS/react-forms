import * as React from "react";
import { BaseForm } from "@simplr/react-forms";

import {
    BaseFormProps,
    FormOnSubmitCallback,
    FormOnSubmitInternalCallback
} from "../contracts/form";

import {
    FieldOnChangeCallback,
    FieldOnChangeInternalCallback,
    HTMLElementProps
} from "../contracts/field";

export interface FormProps extends BaseFormProps, HTMLElementProps<HTMLFormElement> {
    onSubmit?: FormOnSubmitCallback & FormOnSubmitInternalCallback;
    onChange?: FieldOnChangeCallback<any> & FieldOnChangeInternalCallback;

    ref?: React.Ref<Form>;
}

export class Form extends BaseForm<FormProps, {}> {
    public Element: HTMLFormElement | null;

    protected SetElementRef = (element: HTMLFormElement | null) => {
        this.Element = element;
        if (this.FormStore != null && element != null) {
            this.FormStore.SetFormSubmitCallback(() => {
                element.dispatchEvent(new Event("submit"));
            });
        }
    }

    public static defaultProps: FormProps = {
        ...BaseForm.defaultProps,
        preventSubmitDefaultAndPropagation: true
    };

    protected FormSubmitHandler = (event: React.FormEvent<HTMLFormElement>): void => {
        if (this.props.preventSubmitDefaultAndPropagation) {
            event.preventDefault();
            event.stopPropagation();
        }
        if (!this.ShouldFormSubmit()) {
            return;
        }

        this.FormStore.TouchFields();

        if (this.props.onSubmit == null) {
            return;
        }

        // Persist synthetic event, because it's passed into another method.
        event.persist();

        // Pass onSubmit result to FormStore for further processing.
        const result = this.props.onSubmit(event, this.FormStore);
        this.FormStore.SubmitForm(result);
    }

    protected GetHTMLProps(props: BaseFormProps): {} {
        const {
            formId,
            preventSubmitDefaultAndPropagation,
            template,
            formStore,
            destroyOnUnmount,
            forceSubmit,
            disabled,
            fieldsValidationType,
            formValidationType,
            onMount,
            ...restProps
    } = props;

        return restProps;
    }

    public render(): JSX.Element {
        return <form
            ref={this.SetElementRef}
            {...this.GetHTMLProps(this.props) }
            onSubmit={this.FormSubmitHandler}
        >
            {this.props.children}
        </form>;
    }
}
