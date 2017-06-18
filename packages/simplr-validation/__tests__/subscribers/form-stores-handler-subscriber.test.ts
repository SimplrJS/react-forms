import { FSHContainer, FormStoresHandler } from "simplr-forms/stores";
import { FormRegistered, FormUnregistered } from "simplr-forms/actions";
import * as Sinon from "sinon";

import { FormStoresHandlerSubscriber, FormStoresSubscribers } from "../../src/subscribers/form-stores-handler-subscriber";
import { FormStoreSubscriber } from "../../src/subscribers/form-store-subscriber";

class FormStoreHandlerSubscriberTest extends FormStoresHandlerSubscriber {
    public get TestFormStoresSubscribers(): FormStoresSubscribers {
        return this.FormStoresSubscribers;
    }
}

let sandbox: Sinon.SinonSandbox;
describe("FormStoreHandlerSubscriber", () => {
    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
        FSHContainer.SetFormStoresHandler(new FormStoresHandler());
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("add listeners on form stores handler", () => {
        const callback = sandbox.spy(FormStoresHandler.prototype, "addListener");
        const formStoreHandler = FSHContainer.FormStoresHandler;

        expect(formStoreHandler.listeners(FormRegistered).length).toBe(0);
        expect(formStoreHandler.listeners(FormUnregistered).length).toBe(0);

        new FormStoresHandlerSubscriber(FSHContainer);

        expect(callback.called).toBe(true);

        expect(formStoreHandler.listeners(FormRegistered).length).toBe(1);
        expect(formStoreHandler.listeners(FormUnregistered).length).toBe(1);
    });

    it("create FormStoreSubscriber when form registers", () => {
        const formId = "form-id";
        const subscriber = new FormStoreHandlerSubscriberTest(FSHContainer);
        const formStoreHandler = FSHContainer.FormStoresHandler;

        expect(subscriber.TestFormStoresSubscribers.has(formId)).toBe(false);

        formStoreHandler.RegisterForm(formId);
        expect(subscriber.TestFormStoresSubscribers.has(formId)).toBe(true);

        const formStoreSubscription = subscriber.TestFormStoresSubscribers.get(formId);
        expect(formStoreSubscription).toBeDefined();
    });

    it("remove FormStoreSubscriber and it listeners when form unregisters", () => {
        const formId = "form-id";
        const callback = sandbox.spy(FormStoreSubscriber.prototype, "RemoveFormListeners");
        new FormStoresHandlerSubscriber(FSHContainer);
        const formStoreHandler = FSHContainer.FormStoresHandler;

        formStoreHandler.RegisterForm(formId);
        formStoreHandler.UnregisterForm(formId);
        expect(callback.called).toBe(true);
    });
});
