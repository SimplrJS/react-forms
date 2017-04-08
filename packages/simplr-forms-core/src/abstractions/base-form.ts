import * as React from "react";
import { FormStore } from "../stores/form-store";
import { FormStoresHandler } from "../stores/form-stores-handler";

export interface FormProps {
    formId?: string;
    formStore?: FormStore;
}

export interface FormChildContext {
    FormId: string;
}

export abstract class BaseForm<TProps extends FormProps, TState> extends React.Component<TProps, TState> {
    protected FormId: string;

    static childContextTypes = {
        FormId: React.PropTypes.string.isRequired
    };

    constructor() {
        super();
        this.FormId = FormStoresHandler.RegisterForm(this.props.formId, this.props.formStore);
    }

    getChildContext(): FormChildContext {
        return {
            FormId: this.FormId,
        };
    }

    abstract render(): JSX.Element | null;
}
