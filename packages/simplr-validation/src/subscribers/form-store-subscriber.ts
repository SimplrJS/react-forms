import { Stores, Actions } from "simplr-forms-core";
import * as ActionEmitter from "action-emitter";

export class FormStoreSubscriber {

    private formOnValueChangedSubscription: ActionEmitter.EventSubscription | undefined;
    private formOnPropsChangedSubscription: ActionEmitter.EventSubscription | undefined;

    constructor(private formStore: Stores.FormStore) {
        this.formOnValueChangedSubscription = this.formStore.addListener(Actions.ValueChanged, this.onValueChanged);
        this.formOnPropsChangedSubscription = this.formStore.addListener(Actions.ValueChanged, this.onPropsChanged);
    }

    public RemoveFormListeners() {
        if (this.formOnValueChangedSubscription != null) {
            this.formOnValueChangedSubscription.remove();
        }
        if (this.formOnPropsChangedSubscription != null) {
            this.formOnPropsChangedSubscription.remove();
        }
    }

    private onValueChanged = (action: Actions.ValueChanged) => {
        const fieldState = this.formStore.GetField(action.FieldId);
    }

    private onPropsChanged = (action: Actions.PropsChanged) => {

    }
}
