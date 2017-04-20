import { FormStoresHandlerSubscriber } from "./form-stores-handler-subscriber";
import { SubscriberType } from "../contracts";

export class Subscriber {
    private formStoreHandlerSubscriber: FormStoresHandlerSubscriber;

    constructor(private type: SubscriberType = SubscriberType.Automatically) {
        this.formStoreHandlerSubscriber = new FormStoresHandlerSubscriber();
    }
}

export class SubscriberContainerClass {
    private instance: Subscriber;

    SetSubscriber(newHandler: Subscriber, disposeOldOne: boolean = true) {
        if (disposeOldOne) {
            if (this.instance != null) {
                delete this.instance;
            }
        }
        this.instance = newHandler;
    }

    get Subscriber() {
        if (this.instance == null) {
            this.instance = new Subscriber();
        }
        return this.instance;
    }
}


export const SubscriberContainer = new SubscriberContainerClass();
