import { Stores } from "simplr-forms-core";
import { spy } from "sinon";

import { FormStoreSubscriber } from "../../src/subscribers/form-store-subscriber";

describe("FormStoreSubscriber", () => {
    it("add listeners to form store", () => {
        const formStore = new Stores.FormStore("form-id");
        const callback = spy(Stores.FormStore.prototype, "addListener");

        expect(callback.called).toEqual(false);
        new FormStoreSubscriber(formStore);
        expect(callback.called).toEqual(true);
    });
});
