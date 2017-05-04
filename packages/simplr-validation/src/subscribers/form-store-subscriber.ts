import * as React from "react";
import * as ActionEmitter from "action-emitter";

import {
    FieldValue,
    FieldValidationType
} from "simplr-forms-core/contracts";
import { FormStore } from "simplr-forms-core/stores";
import {
    FieldRegistered,
    ValueChanged,
    FieldPropsChanged
} from "simplr-forms-core/actions";

import { ValidateField } from "../utils/validation";

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
        value: FieldValue,
        validationType: FieldValidationType
    ) {
        const fieldState = this.formStore.GetField(fieldId);
        const fieldProps = fieldState.Props;

        if (fieldProps == null ||
            fieldProps != null &&
            fieldProps.validationType != null &&
            fieldProps.validationType ^ validationType) {
            return;
        }

        const childrenArray = React.Children.toArray(fieldProps.children) as JSX.Element[];
        const validationPromise = ValidateField(childrenArray, value);
        await this.formStore.ValidateField(fieldId, validationPromise);
    }

    protected OnRegistered(action: FieldRegistered) {
        this.ValidateField(action.FieldId, action.InitialValue, FieldValidationType.OnFieldRegistered);
    }

    protected OnValueChanged(action: ValueChanged) {
        this.ValidateField(action.FieldId, action.NewValue, FieldValidationType.OnValueChange);
    }

    protected OnPropsChanged(action: FieldPropsChanged) {
        const fieldState = this.formStore.GetField(action.FieldId);
        this.ValidateField(action.FieldId, fieldState.Value, FieldValidationType.OnValueChange);
    }
}
