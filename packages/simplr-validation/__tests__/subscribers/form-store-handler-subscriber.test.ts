import { Stores, Actions } from "simplr-forms-core";
import * as Sinon from "sinon";

import { FormStoreHandlerSubscriber } from "../../src/subscribers/form-store-handler-subscriber";
import { FormStoreSubscriber } from "../../src/subscribers/form-store-subscriber";

const { FSHContainer } = Stores;

class FormStoreHandlerSubscriberTest extends FormStoreHandlerSubscriber {
    public get TestFormStoresSubscribers() {
        return this.FormStoresSubscribers;
    }
}

let sandbox: Sinon.SinonSandbox;
describe("FormStoreHandlerSubscriber", () => {
    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
        FSHContainer.SetFormStoresHandler(new Stores.FormStoresHandlerClass());
    });

    afterEach(function () {
        sandbox.restore();
    });

    it("add listeners on form stores handler", () => {
        const callback = sandbox.spy(Stores.FormStoresHandlerClass.prototype, "addListener");
        const formStoreHandler = FSHContainer.FormStoresHandler;

        expect(formStoreHandler.listeners(Actions.FormRegistered).length).toBe(0);
        expect(formStoreHandler.listeners(Actions.FormUnregistered).length).toBe(0);

        new FormStoreHandlerSubscriber(FSHContainer);

        expect(callback.called).toBe(true);

        expect(formStoreHandler.listeners(Actions.FormRegistered).length).toBe(1);
        expect(formStoreHandler.listeners(Actions.FormUnregistered).length).toBe(1);
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
        new FormStoreHandlerSubscriber(FSHContainer);
        const formStoreHandler = FSHContainer.FormStoresHandler;

        formStoreHandler.RegisterForm(formId);
        formStoreHandler.UnregisterForm(formId);
        expect(callback.called).toBe(true);
    });
});
