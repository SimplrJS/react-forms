import * as React from "React";
import { Stores, Actions, Contracts as FormsCoreContracts } from "simplr-forms-core";
import * as ActionEmitter from "action-emitter";

import { Validate } from "../utils/validation";

const { FieldValidationType } = FormsCoreContracts;

export class FormStoreSubscriber {

    private fieldOnRegisteredSubscription?: ActionEmitter.EventSubscription;
    private fieldOnValueChangedSubscription?: ActionEmitter.EventSubscription;
    private fieldOnPropsChangedSubscription?: ActionEmitter.EventSubscription;

    constructor(private formStore: Stores.FormStore) {
        this.fieldOnRegisteredSubscription = this.formStore.addListener(Actions.FieldRegistered, this.OnRegistered.bind(this));
        this.fieldOnValueChangedSubscription = this.formStore.addListener(Actions.ValueChanged, this.OnValueChanged.bind(this));
        this.fieldOnPropsChangedSubscription = this.formStore.addListener(Actions.PropsChanged, this.OnPropsChanged.bind(this));
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
        value: FormsCoreContracts.FieldValue,
        validationType: FormsCoreContracts.FieldValidationType
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
        const validationPromise = Validate(childrenArray, value);

        await this.formStore.Validate(fieldId, validationPromise);
    }

    protected OnRegistered(action: Actions.FieldRegistered) {
        this.ValidateField(action.FieldId, action.InitialValue, FieldValidationType.OnFieldRegistered);
    }

    protected OnValueChanged(action: Actions.ValueChanged) {
        this.ValidateField(action.FieldId, action.NewValue, FieldValidationType.OnValueChange);
    }

    protected OnPropsChanged(action: Actions.PropsChanged) {
        const fieldState = this.formStore.GetField(action.FieldId);
        this.ValidateField(action.FieldId, fieldState.Value, FieldValidationType.OnValueChange);
    }
}
