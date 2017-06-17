import { FormStoresHandlerSubscriber } from "./form-stores-handler-subscriber";
import { SubscriberType } from "../contracts";

export class ValidationSubscriber {
    private formStoreHandlerSubscriber: FormStoresHandlerSubscriber;

    constructor(private type: SubscriberType = SubscriberType.Automatically) {
        this.formStoreHandlerSubscriber = new FormStoresHandlerSubscriber();
    }
}

export class ValidationSubscriberContainerClass {
    private instance: ValidationSubscriber;

    SetSubscriber(newHandler: ValidationSubscriber, disposeOldOne: boolean = true): void {
        if (disposeOldOne) {
            if (this.instance != null) {
                delete this.instance;
            }
        }
        this.instance = newHandler;
    }

    get Subscriber(): ValidationSubscriber {
        return this.instance;
    }

    Initialize(): void {
        if (this.instance == null) {
            this.instance = new ValidationSubscriber();
        }
    }
}

export const ValidationSubscriberContainer = new ValidationSubscriberContainerClass();
