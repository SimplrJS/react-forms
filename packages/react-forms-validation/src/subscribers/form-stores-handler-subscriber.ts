import {
    FSHContainerClass,
    FSHContainer,
    FormStoresHandler
} from "simplr-forms/stores";
import { FormRegistered, FormUnregistered } from "simplr-forms/actions";
import * as ActionEmitter from "action-emitter";
import * as Immutable from "immutable";
import { FormStoreSubscriber } from "./form-store-subscriber";

export type FormStoresSubscribers = Immutable.Map<string, FormStoreSubscriber>;

export class FormStoresHandlerSubscriber {
    private formStoresSubscribers: FormStoresSubscribers = Immutable.Map<string, FormStoreSubscriber>();

    private formRegisterSubscription: ActionEmitter.EventSubscription;
    private formUnregisterSubscription: ActionEmitter.EventSubscription;

    protected get FormStoresSubscribers(): FormStoresSubscribers {
        return this.formStoresSubscribers;
    }

    private get formStoresHandler(): FormStoresHandler {
        return this.fshContainer.FormStoresHandler;
    }

    constructor(private fshContainer: FSHContainerClass = FSHContainer) {
        this.formRegisterSubscription = this.formStoresHandler
            .addListener(FormRegistered, this.onFormRegistered.bind(this));
        this.formUnregisterSubscription = this.formStoresHandler
            .addListener(FormUnregistered, this.onFormUnregistered.bind(this));
    }

    private onFormRegistered(action: FormRegistered): void {
        const formStore = this.fshContainer.FormStoresHandler.GetStore(action.FormId);

        this.formStoresSubscribers = this.formStoresSubscribers
            .set(action.FormId, new FormStoreSubscriber(formStore));
    }

    private onFormUnregistered(action: FormUnregistered): void {
        const formStoreSubscriber = this.formStoresSubscribers.get(action.FormId);
        formStoreSubscriber.RemoveFormListeners();

        this.formStoresSubscribers = this.formStoresSubscribers.remove(action.FormId);
    }
}
