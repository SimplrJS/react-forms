import * as React from "react";
import * as PropTypes from "prop-types";

import { BaseComponent } from "./base-component";
import { BaseFormContext } from "./base-form";
import { FormStore } from "../stores/form-store";

export interface BaseFieldProps {
    name: string;
}

// tslint:disable-next-line:no-empty-interface
export interface BaseFieldState {}

// tslint:disable-next-line:no-empty-interface
export interface BaseFieldParentContext extends BaseFormContext {}

export interface BaseFieldContext {
    fieldId: string;
}

export abstract class BaseField extends BaseComponent<BaseFieldProps, BaseFieldState> {
    constructor(props: BaseFieldProps, context?: BaseFieldContext) {
        super(props, context);

        // TODO: Check name.
        this.fieldId = props.name;
        const formStore = this.getFormStore();
        if (formStore == null) {
            throw `Tried to register on non existent form "${this.context.formId}"`;
        }
        formStore.registerField(this.fieldId);
    }

    private readonly fieldId: string;

    //#region Component context
    public context!: BaseFieldParentContext;

    public static contextTypes: PropTypes.ValidationMap<BaseFieldParentContext> = {
        formId: PropTypes.string,
    };

    public static childContextTypes: PropTypes.ValidationMap<BaseFieldContext> = {
        fieldId: PropTypes.string.isRequired
    };

    public getChildContext(): BaseFieldContext {
        return {
            fieldId: this.fieldId
        };
    }
    //#endregion

    protected getFormStore(): FormStore | undefined {
        return this.getFormListStore().getForm(this.context.formId);
    }
}
