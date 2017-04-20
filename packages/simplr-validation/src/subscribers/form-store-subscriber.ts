import * as React from "React";
import { Stores, Actions, Contracts as FormsCoreContracts } from "simplr-forms-core";
import * as ActionEmitter from "action-emitter";

import { Validate } from "../utils/validation";

const { FieldValidationType } = FormsCoreContracts;

export class FormStoreSubscriber {

    private formOnValueChangedSubscription: ActionEmitter.EventSubscription | undefined;
    private formOnPropsChangedSubscription: ActionEmitter.EventSubscription | undefined;

    constructor(private formStore: Stores.FormStore) {
        this.formOnValueChangedSubscription = this.formStore.addListener(Actions.ValueChanged, this.OnValueChanged.bind(this));
        this.formOnPropsChangedSubscription = this.formStore.addListener(Actions.PropsChanged, this.OnPropsChanged.bind(this));
    }

    public RemoveFormListeners() {
        if (this.formOnValueChangedSubscription != null) {
            this.formOnValueChangedSubscription.remove();
        }
        if (this.formOnPropsChangedSubscription != null) {
            this.formOnPropsChangedSubscription.remove();
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
            fieldProps.validationType ^ validationType) {
            return;
        }

        const children = React.Children.toArray(fieldProps.children) as JSX.Element[];
        const validationPromise = Validate(children, value);

        await this.formStore.Validate(fieldId, validationPromise);
    }

    protected OnValueChanged(action: Actions.ValueChanged) {
        this.ValidateField(action.FieldId, action.NewValue, FieldValidationType.OnValueChange);
    }

    private async OnPropsChanged(action: Actions.PropsChanged) {
        const fieldState = this.formStore.GetField(action.FieldId);
        this.ValidateField(action.FieldId, fieldState.Value, FieldValidationType.OnValueChange);
    }
}
