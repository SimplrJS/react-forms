import * as React from "react";
import * as ActionEmitter from "action-emitter";

import {
    FieldValue,
    FieldValidationType
} from "simplr-forms/contracts";
import { FormStore } from "simplr-forms/stores";
import {
    FieldRegistered,
    ValueChanged,
    FieldPropsChanged
} from "simplr-forms/actions";

import { ValidateField, ValidateForm } from "../utils/validation";

export class FormStoreSubscriber {

    private fieldOnRegisteredSubscription?: ActionEmitter.EventSubscription;
    private fieldOnValueChangedSubscription?: ActionEmitter.EventSubscription;
    private fieldOnPropsChangedSubscription?: ActionEmitter.EventSubscription;

    constructor(private formStore: FormStore) {
        this.fieldOnRegisteredSubscription = this.formStore.addListener(FieldRegistered, this.OnRegistered.bind(this));
        this.fieldOnValueChangedSubscription = this.formStore.addListener(ValueChanged, this.OnValueChanged.bind(this));
        this.fieldOnPropsChangedSubscription = this.formStore.addListener(FieldPropsChanged, this.OnPropsChanged.bind(this));
    }

    public RemoveFormListeners() {
        if (this.fieldOnRegisteredSubscription != null) {
            this.fieldOnRegisteredSubscription.remove();
        }

        if (this.fieldOnValueChangedSubscription != null) {
            this.fieldOnValueChangedSubscription.remove();
        }
        if (this.fieldOnPropsChangedSubscription != null) {
            this.fieldOnPropsChangedSubscription.remove();
        }
    }

    protected async ValidateField(
        fieldId: string,
        targetValidationType: FieldValidationType
    ) {
        const fieldState = this.formStore.GetField(fieldId);
        const formProps = this.formStore.GetState().Form.Props;
        const fieldProps = fieldState.Props;
        let validationType: FieldValidationType = FieldValidationType.None;

        if (formProps == null && fieldProps == null ||
            fieldProps == null) {
            return;
        }

        if (formProps != null && formProps.fieldsValidationType != null) {
            validationType = formProps.fieldsValidationType;
        }

        if (fieldProps.validationType != null) {
            validationType = fieldProps.validationType;
        }

        if (validationType == null ||
            !(validationType & targetValidationType)) {
            return;
        }

        const childrenArray = React.Children.toArray(fieldProps.children) as JSX.Element[];
        const validationPromise = ValidateField(childrenArray, fieldState.Value);
        await this.formStore.ValidateField(fieldId, validationPromise);
    }

    protected async ValidateForm(targetValidationType: FieldValidationType) {
        const formStoreState = this.formStore.GetState();
        const formProps = formStoreState.Form.Props;
        if (formStoreState.HasError ||
            formStoreState.Validating ||
            formProps.formValidationType != null &&
            !(formProps.formValidationType & targetValidationType)) {
            return;
        }

        const childrenArray = React.Children.toArray(formProps.children) as JSX.Element[];
        const validationPromise = ValidateForm(childrenArray, this.formStore.ToObject());
        await this.formStore.ValidateForm(validationPromise);
    }

    protected async OnRegistered(action: FieldRegistered) {
        await this.ValidateField(action.FieldId, FieldValidationType.OnFieldRegistered);
        await this.ValidateForm(FieldValidationType.OnFieldRegistered);
    }

    protected async OnValueChanged(action: ValueChanged) {
        await this.ValidateField(action.FieldId, FieldValidationType.OnValueChange);
        await this.ValidateForm(FieldValidationType.OnValueChange);
    }

    protected async OnPropsChanged(action: FieldPropsChanged) {
        await this.ValidateField(action.FieldId, FieldValidationType.OnValueChange);
        await this.ValidateForm(FieldValidationType.OnValueChange);
    }
}
