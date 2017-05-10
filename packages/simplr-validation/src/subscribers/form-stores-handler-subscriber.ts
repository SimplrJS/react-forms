import { FSHContainerClass, FSHContainer } from "simplr-forms/stores";
import { FormRegistered, FormUnregistered } from "simplr-forms/actions";
import * as ActionEmitter from "action-emitter";
import * as Immutable from "immutable";
import { FormStoreSubscriber } from "./form-store-subscriber";

export class FormStoresHandlerSubscriber {
    private formStoresSubscribers = Immutable.Map<string, FormStoreSubscriber>();

    private formRegisterSubscription: ActionEmitter.EventSubscription;
    private formUnregisterSubscription: ActionEmitter.EventSubscription;

    protected get FormStoresSubscribers() {
        return this.formStoresSubscribers;
    }

    private get formStoresHandler() {
        return this.fshContainer.FormStoresHandler;
    }

    constructor(private fshContainer: FSHContainerClass = FSHContainer) {
        this.formRegisterSubscription = this.formStoresHandler
            .addListener(FormRegistered, this.onFormRegistered.bind(this));
        this.formUnregisterSubscription = this.formStoresHandler
            .addListener(FormUnregistered, this.onFormUnregistered.bind(this));
    }

    private onFormRegistered(action: FormRegistered) {
        const formStore = this.fshContainer.FormStoresHandler.GetStore(action.FormId);

        this.formStoresSubscribers = this.formStoresSubscribers
            .set(action.FormId, new FormStoreSubscriber(formStore));
    }

    private onFormUnregistered(action: FormUnregistered) {
        const formStoreSubscriber = this.formStoresSubscribers.get(action.FormId);
        formStoreSubscriber.RemoveFormListeners();

        this.formStoresSubscribers = this.formStoresSubscribers.remove(action.FormId);
    }
}
