import * as React from "react";
import * as ActionEmitter from "action-emitter";

import {
    FieldValue,
    FieldValidationType
} from "@simplr/react-forms/contracts";
import { FormStore } from "@simplr/react-forms/stores";
import {
    FieldRegistered,
    ValueChanged,
    FieldPropsChanged,
    FieldActive,
    FieldBlurred
} from "@simplr/react-forms/actions";

import { ValidateField, ValidateForm } from "../utils/validation";

export class FormStoreSubscriber {

    private fieldOnRegisteredSubscription?: ActionEmitter.EventSubscription;
    private fieldOnValueChangedSubscription?: ActionEmitter.EventSubscription;
    private fieldOnPropsChangedSubscription?: ActionEmitter.EventSubscription;
    private fieldsOnBlurSubscription?: ActionEmitter.EventSubscription;

    constructor(private formStore: FormStore) {
        this.fieldOnRegisteredSubscription = this.formStore.addListener(FieldRegistered, this.OnRegistered.bind(this));
        this.fieldOnValueChangedSubscription = this.formStore.addListener(ValueChanged, this.OnValueChanged.bind(this));
        this.fieldOnPropsChangedSubscription = this.formStore.addListener(FieldPropsChanged, this.OnPropsChanged.bind(this));
        this.fieldsOnBlurSubscription = this.formStore.addListener(FieldBlurred, this.OnBlur.bind(this));
    }

    public RemoveFormListeners(): void {
        if (this.fieldOnRegisteredSubscription != null) {
            this.fieldOnRegisteredSubscription.remove();
        }
        if (this.fieldOnValueChangedSubscription != null) {
            this.fieldOnValueChangedSubscription.remove();
        }
        if (this.fieldOnPropsChangedSubscription != null) {
            this.fieldOnPropsChangedSubscription.remove();
        }
        if (this.fieldsOnBlurSubscription != null) {
            this.fieldsOnBlurSubscription.remove();
        }
    }

    protected async ValidateField(
        fieldId: string,
        targetValidationType: FieldValidationType
    ): Promise<void> {
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

    protected async ValidateForm(targetValidationType: FieldValidationType): Promise<void> {
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

    protected async OnRegistered(action: FieldRegistered): Promise<void> {
        await this.ValidateField(action.FieldId, FieldValidationType.OnFieldRegistered);
        await this.ValidateForm(FieldValidationType.OnFieldRegistered);
    }

    protected async OnValueChanged(action: ValueChanged): Promise<void> {
        await this.ValidateField(action.FieldId, FieldValidationType.OnValueChange);
        await this.ValidateForm(FieldValidationType.OnValueChange);
    }

    protected async OnPropsChanged(action: FieldPropsChanged): Promise<void> {
        await this.ValidateField(action.FieldId, FieldValidationType.OnValueChange);
        await this.ValidateForm(FieldValidationType.OnValueChange);
    }

    protected async OnBlur(action: FieldBlurred): Promise<void> {
        await this.ValidateField(action.FieldId, FieldValidationType.OnBlur);
        await this.ValidateForm(FieldValidationType.OnBlur);
    }
}
