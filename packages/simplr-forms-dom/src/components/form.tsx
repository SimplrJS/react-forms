import * as React from "react";
import { BaseForm } from "simplr-forms-core";

import { FormProps, FormOnSubmitCallback } from "../contracts/form";

export class Form extends BaseForm<FormProps, {}> {
    public Element: HTMLFormElement;

    static defaultProps: FormProps = {
        preventSubmitDefaultAndPropagation: true
    };

    protected SetElementRef = (element: HTMLFormElement) => {
        this.Element = element;
        this.FormStore.SetSubmitCallback(() => {
            element.dispatchEvent(new Event("submit"));
        });
    }

    protected FormSubmitHandler = (event: React.FormEvent<HTMLFormElement>): void => {
        if (this.props.preventSubmitDefaultAndPropagation) {
            event.preventDefault();
            event.stopPropagation();
        }
        if (!this.ShouldFormSubmit()) {
            return;
        }

        // TODO: Touch all fields to validate

        if (this.props.onSubmit == null) {
            return;
        }

        const result = this.props.onSubmit(event, this.FormStore);
        this.Submit(result);
    }

    render() {
        return <form
            ref={this.SetElementRef}
            onSubmit={this.FormSubmitHandler}
        >
            {this.props.children}
        </form>;
    }
}
