import * as React from "React";
import { Stores, Actions, Contracts as FormsCoreContracts } from "simplr-forms-core";
import * as ActionEmitter from "action-emitter";

import { Validate } from "../utils/validation";

const { FieldValidationType } = FormsCoreContracts;

export class FormStoreSubscriber {

    private formOnValueChangedSubscription: ActionEmitter.EventSubscription | undefined;
    private formOnPropsChangedSubscription: ActionEmitter.EventSubscription | undefined;

    constructor(private formStore: Stores.FormStore) {
        this.formOnValueChangedSubscription = this.formStore.addListener(Actions.ValueChanged, this.onValueChanged.bind(this));
        this.formOnPropsChangedSubscription = this.formStore.addListener(Actions.PropsChanged, this.onPropsChanged.bind(this));
    }

    public RemoveFormListeners() {
        if (this.formOnValueChangedSubscription != null) {
            this.formOnValueChangedSubscription.remove();
        }
        if (this.formOnPropsChangedSubscription != null) {
            this.formOnPropsChangedSubscription.remove();
        }
    }

    protected async onValueChanged(action: Actions.ValueChanged) {
        const fieldState = this.formStore.GetField(action.FieldId);
        const fieldProps = fieldState.Props;

        if (fieldProps == null ||
            fieldProps != null &&
            fieldProps.validationType ^ FieldValidationType.OnPropsChange) {
            return;
        }

        const children = React.Children.toArray(fieldProps.children) as JSX.Element[];
        const validationPromise = Validate(children, action.NewValue);

        this.formStore.Validate(action.FieldId, validationPromise);
    }

    private async onPropsChanged(action: Actions.PropsChanged) {
        // const fieldState = this.formStore.GetField(action.FieldId);
        // TODO: OnPropsChanged
    }
}
