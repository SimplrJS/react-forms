import { Stores } from "simplr-forms-core";
export declare class FormStoreHandlerSubscriber {
    private fshContainer;
    private formStoresSubscribers;
    private formRegisterSubscription;
    private formUnregisterSubscription;
    private readonly formStoresHandler;
    constructor(fshContainer?: Stores.FSHContainerClass);
    private onFormRegistered;
    private onFormUnregistered;
}
