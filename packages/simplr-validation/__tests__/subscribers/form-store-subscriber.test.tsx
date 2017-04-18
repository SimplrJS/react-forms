import * as React from "react";
import { Stores } from "simplr-forms-core";
import * as Sinon from "sinon";

import { ContainsValidator } from "../../src/validators/index";
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
        expect(callback.called).toEqual(true);
    });

    it("remove listeners from form store", () => {
        // TODO
    });

    fit("MUST validate when value changed with an error", async (done) => {
        const fieldId = "field-id";
        const nextValue = "next value";
        const fieldChildren = [<ContainsValidator value="ok" errorMessage="error message" />];
        const formStore = new Stores.FormStore("form-id");
        const callback = sandbox.stub(Stores.FormStore.prototype, "Validate");
        new FormStoreSubscriber(formStore);

        formStore.RegisterField(fieldId, "initial", { name: "field-name", children: fieldChildren });
        console.warn(formStore.GetField(fieldId));
        formStore.ValueChanged(fieldId, nextValue);

        try {
            expect(callback.called).toBe(true);
            console.warn(formStore.GetField(fieldId).Error);
        } catch (error) {
            done.fail(error);
        }
        done();
    });
});
