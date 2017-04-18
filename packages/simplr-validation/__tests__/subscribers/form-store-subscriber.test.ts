import { Stores, Actions } from "simplr-forms-core";
import * as Sinon from "sinon";
import * as ActionEmitter from "action-emitter";

import { FormStoreSubscriber } from "../../src/subscribers/form-store-subscriber";

let sandbox: Sinon.SinonSandbox;
describe("FormStoreSubscriber", () => {
    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it("add listeners to form store", () => {
        const formStore = new Stores.FormStore("form-id");
        const callback = sandbox.stub(Stores.FormStore.prototype, "addListener");

        expect(callback.called).toEqual(false);
        new FormStoreSubscriber(formStore);
        console.warn(formStore.listeners(Actions.PropsChanged).length);
        expect(callback.called).toEqual(true);
    });

    it("add listeners to form store", () => {
        const formStore = new Stores.FormStore("form-id");
        const callback = sandbox.stub(Stores.FormStore.prototype, "addListener");

        expect(callback.called).toEqual(false);
        new FormStoreSubscriber(formStore);
        expect(callback.called).toEqual(true);
    });
});
