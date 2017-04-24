import * as React from "react";
import { Abstractions as CoreAbstractions, Contracts as CoreContracts } from "simplr-forms-core";
import { OnChangeCallback } from "../contracts/field";
import { FormOnSubmitCallback } from "../contracts/form";

export interface FormProps extends CoreContracts.FormProps, React.HTMLProps<HTMLFormElement> {
    onSubmit?: FormOnSubmitCallback;
    onChange?: OnChangeCallback<any>;
}

export class Form extends CoreAbstractions.BaseForm<FormProps, {}> {
    render() {
        return <form>
            {this.props.children}
        </form>;
    }
}
