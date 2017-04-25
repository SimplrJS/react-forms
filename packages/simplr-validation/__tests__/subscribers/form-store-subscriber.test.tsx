import * as React from "react";
import { Stores, Actions, Contracts as FormsCoreContracts } from "simplr-forms-core";
import * as Sinon from "sinon";

import { ContainsValidator } from "../../src/validators/index";
import { FormStoreSubscriber } from "../../src/subscribers/form-store-subscriber";

const { FieldValidationType } = FormsCoreContracts;

class MySubscriber extends FormStoreSubscriber {
    public ValidateField(
        fieldId: string,
        value: FormsCoreContracts.FieldValue,
        validationType: FormsCoreContracts.FieldValidationType
    ) {
        return super.ValidateField(fieldId, value, validationType);
    }
}

let sandbox: Sinon.SinonSandbox;
describe("FormStoreSubscriber", () => {
    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("add listeners to form store", () => {
        const formStore = new Stores.FormStore("form-id");
        const callback = sandbox.spy(Stores.FormStore.prototype, "addListener");

        expect(callback.called).toEqual(false);

        expect(formStore.listeners(Actions.FieldRegistered).length).toBe(0);
        expect(formStore.listeners(Actions.PropsChanged).length).toBe(0);
        expect(formStore.listeners(Actions.ValueChanged).length).toBe(0);

        new FormStoreSubscriber(formStore);
        expect(callback.called).toEqual(true);

        expect(formStore.listeners(Actions.FieldRegistered).length).toBe(1);
        expect(formStore.listeners(Actions.PropsChanged).length).toBe(1);
        expect(formStore.listeners(Actions.ValueChanged).length).toBe(1);
    });

    it("remove listeners from form store", () => {
        const formStore = new Stores.FormStore("form-id");

        const formSubscriber = new MySubscriber(formStore);

        formSubscriber.RemoveFormListeners();

        expect(formStore.listeners(FieldRegistered).length).toBe(0);
        expect(formStore.listeners(PropsChanged).length).toBe(0);
        expect(formStore.listeners(ValueChanged).length).toBe(0);

    });

    it("MUST validate when specific validationType flag is present without error", async (done) => {
        const fieldId = "field-id";
        const initialValue = "initial valid value";
        const errorMessage = "error message";

        const validatorValidateCallback = sandbox.spy(ContainsValidator.prototype, "Validate");
        const fieldChildren = [<ContainsValidator value="valid" error={errorMessage} />];
        const formStore = new Stores.FormStore("form-id");
        const formStoreValidateCallback = sandbox.spy(Stores.FormStore.prototype, "Validate");
        const subscriber = new MySubscriber(formStore);

        const fieldProps: FormsCoreContracts.FieldStateProps = {
            name: "field-name",
            children: fieldChildren,
            validationType: FieldValidationType.OnValueChange
        };

        formStore.RegisterField(fieldId, initialValue, fieldProps);
        try {
            await subscriber.ValidateField(fieldId, initialValue, FieldValidationType.OnValueChange);
            expect(formStoreValidateCallback.called).toBe(true);
            expect(validatorValidateCallback.called).toBe(true);
            expect(formStore.GetField(fieldId).Error).toBeUndefined();

            done();
        } catch (error) {
            done.fail(error);
        }
    });

    it("MUST validate when specific validationType flag is present with error", async (done) => {
        const fieldId = "field-id";
        const initialValue = "initial value";
        const errorMessage = "error message";

        const validatorValidateCallback = sandbox.spy(ContainsValidator.prototype, "Validate");
        const fieldChildren = [<ContainsValidator value="valid" error={errorMessage} />];
        const formStore = new Stores.FormStore("form-id");
        const formStoreValidateCallback = sandbox.spy(Stores.FormStore.prototype, "Validate");
        const subscriber = new MySubscriber(formStore);

        const fieldProps: FormsCoreContracts.FieldStateProps = {
            name: "field-name",
            children: fieldChildren,
            validationType: FieldValidationType.OnValueChange
        };

        formStore.RegisterField(fieldId, initialValue, fieldProps);
        try {
            await subscriber.ValidateField(fieldId, initialValue, FieldValidationType.OnValueChange);
            expect(formStoreValidateCallback.called).toBe(true);
            expect(validatorValidateCallback.called).toBe(true);
            expect(formStore.GetField(fieldId).Error).toBeDefined();

            done();
        } catch (error) {
            done.fail(error);
        }
    });

    it("MUST NOT validate when specific validationType flag is missing", () => {
        const fieldId = "field-id";
        const initialValue = "initial value";
        const errorMessage = "error message";

        const validatorValidateCallback = sandbox.spy(ContainsValidator.prototype, "Validate");
        const fieldChildren = [<ContainsValidator value="valid" error={errorMessage} />];
        const formStore = new Stores.FormStore("form-id");
        const formStoreValidateCallback = sandbox.spy(Stores.FormStore.prototype, "Validate");
        const subscriber = new MySubscriber(formStore);

        const fieldProps: FormsCoreContracts.FieldStateProps = {
            name: "field-name",
            children: fieldChildren,
            validationType: FieldValidationType.OnPropsChange
        };

        formStore.RegisterField(fieldId, initialValue, fieldProps);
        // ValidateField should skip this validation because OnValueChange flag is missing
        subscriber.ValidateField(fieldId, initialValue, FieldValidationType.OnValueChange);

        expect(formStoreValidateCallback.called).toBe(false);
        expect(validatorValidateCallback.called).toBe(false);
        expect(formStore.GetField(fieldId).Error).toBeUndefined();
    });

    it("MUST NOT validate when field props is undefined", () => {
        const fieldId = "field-id";
        const initialValue = "initial value";

        const validatorValidateCallback = sandbox.spy(ContainsValidator.prototype, "Validate");
        const formStore = new Stores.FormStore("form-id");
        const formStoreValidateCallback = sandbox.spy(Stores.FormStore.prototype, "Validate");
        const subscriber = new MySubscriber(formStore);

        // Validation is skipped because props are undefined
        formStore.RegisterField(fieldId, initialValue, undefined);
        subscriber.ValidateField(fieldId, initialValue, FieldValidationType.OnValueChange);

        expect(formStoreValidateCallback.called).toBe(false);
        expect(validatorValidateCallback.called).toBe(false);
        expect(formStore.GetField(fieldId).Error).toBeUndefined();
    });
});
