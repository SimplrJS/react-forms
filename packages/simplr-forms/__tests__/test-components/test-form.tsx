import * as React from "react";

import { BaseForm } from "../../src/abstractions/base-form";
import { FormProps } from "../../src/contracts/form";

export interface MyFormProps extends FormProps {
    renderChildren?: boolean;
}

export class MyTestForm extends BaseForm<MyFormProps, {}> {
    public static defaultProps: MyFormProps = {
        ...BaseForm.defaultProps,
        renderChildren: true
    };

    public render(): JSX.Element {
        return <form>
            {this.props.renderChildren ? this.props.children : null}
        </form>;
    }
}
