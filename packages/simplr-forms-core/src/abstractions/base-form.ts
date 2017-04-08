import * as React from "react";
import * as FormContracts from "../contracts/form";
import { FormStoresHandler } from "../stores/form-stores-handler";

export abstract class BaseForm<TProps extends FormContracts.FormProps, TState> extends React.Component<TProps, TState> {
    protected FormId: string;

    static childContextTypes = {
        FormId: React.PropTypes.string.isRequired
    };

    constructor(props: FormContracts.FormProps) {
        super();
        this.FormId = FormStoresHandler.RegisterForm(props.formId, props.formStore);
    }

    getChildContext(): FormContracts.FormChildContext {
        return {
            FormId: this.FormId,
        };
    }

    abstract render(): JSX.Element | null;
}
