import * as React from "react";
import { BaseForm } from "@simplr/react-forms";

import { FormProps } from "../contracts/form";

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

        // Touch all fields for validation to kick in
        this.FormStore.TouchFields();

        if (this.props.onSubmit == null) {
            return;
        }

        // Persist synthetic event, because it's passed to another method.
        event.persist();

        // Pass onSubmit result to FormStore for further processing.
        const result = this.props.onSubmit(event, this.FormStore);
        this.FormStore.SubmitForm(result);
    }

    public render(): JSX.Element {
        return <form
            ref={this.SetElementRef}
            onSubmit={this.FormSubmitHandler}
        >
            {this.props.children}
        </form>;
    }
}
