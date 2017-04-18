import * as React from "React";
import { Stores, Actions } from "simplr-forms-core";
import * as ActionEmitter from "action-emitter";

import { Validate } from "../validation";

export class FormStoreSubscriber {

    private formOnValueChangedSubscription: ActionEmitter.EventSubscription | undefined;
    private formOnPropsChangedSubscription: ActionEmitter.EventSubscription | undefined;

    constructor(private formStore: Stores.FormStore) {
        this.formOnValueChangedSubscription = this.formStore.addListener(Actions.ValueChanged, this.onValueChanged);
        this.formOnPropsChangedSubscription = this.formStore.addListener(Actions.PropsChanged, this.onPropsChanged);
    }

    public RemoveFormListeners() {
        if (this.formOnValueChangedSubscription != null) {
            this.formOnValueChangedSubscription.remove();
        }
        if (this.formOnPropsChangedSubscription != null) {
            this.formOnPropsChangedSubscription.remove();
        }
    }

    private onValueChanged = async (action: Actions.ValueChanged) => {
        const fieldState = this.formStore.GetField(action.FieldId);
        const fieldProps = fieldState.Props;

        const children = React.Children.toArray(fieldProps.children) as JSX.Element[];
        const validationPromise = Validate(children, action.NewValue);

        try {
            await validationPromise;
        } catch (err) {
            console.error("---", err);
        }

        this.formStore.Validate(action.FieldId, validationPromise, action.NewValue);
    }

    private onPropsChanged = (action: Actions.PropsChanged) => {
        // const fieldState = this.formStore.GetField(action.FieldId);
    }
}
