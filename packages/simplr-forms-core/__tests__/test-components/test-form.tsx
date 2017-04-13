import * as React from "react";

import { BaseForm } from "../../src/abstractions/base-form";
import { FormProps } from "../../src/contracts/form";

export interface MyFormProps extends FormProps {
    renderChildren?: boolean;
}

export interface MyFormState { }

export class MyTestForm extends BaseForm<MyFormProps, MyFormState> {
    static defaultProps: MyFormProps = {
        ...BaseForm.defaultProps,
        renderChildren: true
    };

    render(): JSX.Element {
        return <form>
            {this.props.renderChildren ? this.props.children : null}
        </form>;
    }
}
