import * as React from "react";
import { BaseForm } from "simplr-forms-core";
import { FormProps } from "simplr-forms-core/contracts";
import { OnChangeCallback } from "../contracts/field";
import { FormOnSubmitCallback } from "../contracts/form";

export interface FormProps extends FormProps, React.HTMLProps<HTMLFormElement> {
    onSubmit?: FormOnSubmitCallback;
    onChange?: OnChangeCallback<any>;
}

export class Form extends BaseForm<FormProps, {}> {
    render() {
        return <form>
            {this.props.children}
        </form>;
    }
}
