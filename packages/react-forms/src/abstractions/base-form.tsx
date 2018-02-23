import * as React from "react";
import * as PropTypes from "prop-types";

import { BaseComponent } from "./base-component";
import { FormListStore } from "../stores/form-list-store";
import { Config } from "../config";
import { FormStore } from "../stores/form-store";

export interface BaseFormProps {
    formId?: string;
}

// tslint:disable-next-line:no-empty-interface
export interface BaseFormState {}

export interface BaseFormContext {
    formId: string;
}

export abstract class BaseForm extends BaseComponent<BaseFormProps, BaseFormState> {
    constructor(props: BaseFormProps, context?: BaseFormContext) {
        super(props, context);

        this.formId = this.getFormListStore().registerForm(props.formId);
    }

    public componentWillMount(): void {
        this.getFormListStore().unregisterForm(this.formId);
    }

    protected readonly formId: string;

    protected getFormStore(): FormStore | undefined {
        return Config.formList.getForm(this.formId);
    }

    public static childContextTypes: PropTypes.ValidationMap<BaseFormContext> = {
        formId: PropTypes.string.isRequired
    };

    public getChildContext(): BaseFormContext {
        return {
            formId: this.formId
        };
    }
}
