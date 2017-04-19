import { Stores } from "simplr-forms-core";
export declare class FormStoreSubscriber {
    private formStore;
    private formOnValueChangedSubscription;
    private formOnPropsChangedSubscription;
    constructor(formStore: Stores.FormStore);
    RemoveFormListeners(): void;
    private onValueChanged;
    private onPropsChanged;
}
