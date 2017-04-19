import { FormStoreHandlerSubscriber } from "./form-store-handler-subscriber";
import { SubscriberType } from "../contracts";

export class SubscriberClass {
    private formStoreHandlerSubscriber: FormStoreHandlerSubscriber;

    constructor(private type: SubscriberType = SubscriberType.Automatically) {
        this.formStoreHandlerSubscriber = new FormStoreHandlerSubscriber();
    }
}

export class SubscriberContainerClass {
    private instance: SubscriberClass;

    SetSubscriber(newHandler: SubscriberClass, disposeOldOne: boolean = true) {
        if (disposeOldOne) {
            if (this.instance != null) {
                delete this.instance;
            }
        }
        this.instance = newHandler;
    }

    get Subscriber() {
        if (this.instance == null) {
            this.instance = new SubscriberClass();
        }
        return this.instance;
    }
}


export const SubscriberContainer = new SubscriberContainerClass();
