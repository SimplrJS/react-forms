import * as React from "react";
import { Stores, Actions } from "simplr-forms-core";
import * as Sinon from "sinon";

import { ContainsValidator } from "../../src/validators/index";
import { FormStoreSubscriber } from "../../src/subscribers/form-store-subscriber";

class MySubscriber extends FormStoreSubscriber {
    protected onValueChanged(action: Actions.ValueChanged) {
        return new Promise<any>((resolve, reject) => {
            super.onValueChanged(action).then(resolve).catch(reject);
        });
    }
}

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
        const callback = sandbox.spy(Stores.FormStore.prototype, "addListener");

        expect(callback.called).toEqual(false);

        expect(formStore.listeners(Actions.PropsChanged).length).toBe(0);
        expect(formStore.listeners(Actions.ValueChanged).length).toBe(0);

        new FormStoreSubscriber(formStore);
        expect(callback.called).toEqual(true);

        expect(formStore.listeners(Actions.PropsChanged).length).toBe(1);
        expect(formStore.listeners(Actions.ValueChanged).length).toBe(1);
    });

    it("remove listeners from form store", () => {
        const formStore = new Stores.FormStore("form-id");

        const formSubscriber = new MySubscriber(formStore);

        formSubscriber.RemoveFormListeners();

        expect(formStore.listeners(Actions.PropsChanged).length).toBe(0);
        expect(formStore.listeners(Actions.ValueChanged).length).toBe(0);

    });

    it("MUST validate when value changed without an error", async (done) => {
        const fieldId = "field-id";
        const nextValue = "valid value";
        const errorMessage = "error message";

        const validatorValidateCallback = sandbox.spy(ContainsValidator.prototype, "Validate");
        const fieldChildren = [<ContainsValidator value="valid" errorMessage={errorMessage} />];
        const formStore = new Stores.FormStore("form-id");
        const formStoreValidateCallback = sandbox.spy(Stores.FormStore.prototype, "Validate");
        const onValueChangedCallback = sandbox.spy(MySubscriber.prototype, "onValueChanged");
        new MySubscriber(formStore);

        formStore.RegisterField(fieldId, "initial", { name: "field-name", children: fieldChildren });
        formStore.ValueChanged(fieldId, nextValue);

        const [onValueChangedPromise] = onValueChangedCallback.returnValues;

        try {
            expect(onValueChangedPromise).toBeDefined();
            expect(onValueChangedPromise.then).toBeDefined();
        } catch (err) {
            done.fail(err);
        }

        await onValueChangedPromise;

        try {
            expect(formStoreValidateCallback.called).toBe(true);
            expect(validatorValidateCallback.called).toBe(true);
            expect(formStore.GetField(fieldId).Error).toBeUndefined();
        } catch (error) {
            done.fail(error);
        }
        done();
    });

    it("MUST validate when value changed with an error", async (done) => {
        const fieldId = "field-id";
        const nextValue = "next value";
        const errorMessage = "error message";

        const validatorValidateCallback = sandbox.spy(ContainsValidator.prototype, "Validate");
        const fieldChildren = [<ContainsValidator value="ok" errorMessage={errorMessage} />];
        const formStore = new Stores.FormStore("form-id");
        const formStoreValidateCallback = sandbox.spy(Stores.FormStore.prototype, "Validate");
        const onValueChangedCallback = sandbox.spy(MySubscriber.prototype, "onValueChanged");
        new MySubscriber(formStore);

        formStore.RegisterField(fieldId, "initial", { name: "field-name", children: fieldChildren });
        formStore.ValueChanged(fieldId, nextValue);

        const [onValueChangedPromise] = onValueChangedCallback.returnValues;

        try {
            expect(onValueChangedPromise).toBeDefined();
            expect(onValueChangedPromise.then).toBeDefined();
            expect(formStore.GetField(fieldId).Validating).toBe(true);
        } catch (err) {
            done.fail(err);
        }

        await onValueChangedPromise;

        try {
            const fieldState = formStore.GetField(fieldId);
            expect(fieldState.Validating).toBe(false);
            expect(formStoreValidateCallback.called).toBe(true);
            expect(validatorValidateCallback.called).toBe(true);
            expect(fieldState.Error).toBeDefined();
            expect(fieldState.Error!.Message).toEqual(errorMessage);
        } catch (error) {
            done.fail(error);
        }
        done();
    });

    // TODO: OnPropsChanged tests
    it("validate when props changed without an error", () => { });
    it("validate when props changed with an error", () => { });
});
