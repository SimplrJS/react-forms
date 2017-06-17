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

    public SetSubscriber(newHandler: Subscriber, disposeOldOne: boolean = true): void {
        if (disposeOldOne) {
            if (this.instance != null) {
                delete this.instance;
            }
        }
        this.instance = newHandler;
    }

    public get Subscriber(): Subscriber {
        if (this.instance == null) {
            this.instance = new Subscriber();
        }
        return this.instance;
    }
}

export const SubscriberContainer = new SubscriberContainerClass();
