import { Stores, Actions } from "simplr-forms-core";
import * as ActionEmitter from "action-emitter";
import * as Immutable from "immutable";
import { FormStoreSubscriber } from "./form-store-subscriber";

export class FormStoreHandlerSubscriber {
    private formStoresSubscribers = Immutable.Map<string, FormStoreSubscriber>();

    private formRegisterSubscription: ActionEmitter.EventSubscription;
    private formUnregisterSubscription: ActionEmitter.EventSubscription;

    private get formStoresHandler() {
        return this.fshContainer.FormStoresHandler;
    }

    constructor(private fshContainer = Stores.FSHContainer) {
        this.formRegisterSubscription = this.formStoresHandler.addListener(Actions.FormRegistered, this.onFormRegistered);
        this.formUnregisterSubscription = this.formStoresHandler.addListener(Actions.FormUnregistered, this.onFormUnregistered);
    }

    private onFormRegistered = (action: Actions.FormRegistered) => {
        const formStore = this.fshContainer.FormStoresHandler.GetStore(action.FormId);

        this.formStoresSubscribers = this.formStoresSubscribers
            .set(action.FormId, new FormStoreSubscriber(formStore));
    }

    private onFormUnregistered = (action: Actions.FormUnregistered) => {
        const formStoreSubscriber = this.formStoresSubscribers.get(action.FormId);
        formStoreSubscriber.RemoveFormListeners();

        this.formStoresSubscribers = this.formStoresSubscribers.remove(action.FormId);
    }
}
