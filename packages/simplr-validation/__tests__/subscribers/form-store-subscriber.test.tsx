import * as React from "react";
import * as Sinon from "sinon";

import {
    FieldValue,
    FieldStateProps,
    FormStateProps,
    FieldValidationType
} from "simplr-forms-core/contracts";
import { FormStore } from "simplr-forms-core/stores";
import {
    FieldRegistered,
    FieldPropsChanged,
    ValueChanged,
} from "simplr-forms-core/actions";

import { BaseFormValidator, BaseFormValidatorProps } from "../../src/abstractions/base-form-validator";
import { ValidationResult } from "../../src/contracts";

import { ContainsValidator } from "../../src/validators/index";
import { FormStoreSubscriber } from "../../src/subscribers/form-store-subscriber";

class MySubscriber extends FormStoreSubscriber {
    public ValidateField(
        fieldId: string,
        value: FieldValue,
        targetValidationType: FieldValidationType
    ) {
        return super.ValidateField(fieldId, value, targetValidationType);
    }

    public ValidateForm(targetValidationType: FieldValidationType) {
        return super.ValidateForm(targetValidationType);
    }
}

// TODO Move this type
export type FormValueType = { [key: string]: FormValueType | any };

interface TestFormValidatorProps extends BaseFormValidatorProps {
    minLength: number;
}

class TestFormValidator extends BaseFormValidator<TestFormValidatorProps> {
    Validate(value: FormValueType): ValidationResult {
        for (const key in value) {
            if (value.hasOwnProperty(key)) {
                const val = value[key] as string;
                if (typeof val === "string" &&
                    val.length < this.props.minLength) {
                    return this.InvalidSync(this.props.error);
                }
            }
        }
        return this.ValidSync();
    }
}

describe("FormStoreSubscriber", () => {
    let sandbox: Sinon.SinonSandbox;
    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("add listeners to form store", () => {
        const formStore = new FormStore("form-id");
        const callback = sandbox.spy(FormStore.prototype, "addListener");

        expect(callback.called).toEqual(false);

        expect(formStore.listeners(FieldRegistered).length).toBe(0);
        expect(formStore.listeners(FieldPropsChanged).length).toBe(0);
        expect(formStore.listeners(ValueChanged).length).toBe(0);

        new FormStoreSubscriber(formStore);
        expect(callback.called).toEqual(true);

        expect(formStore.listeners(FieldRegistered).length).toBe(1);
        expect(formStore.listeners(FieldPropsChanged).length).toBe(1);
        expect(formStore.listeners(ValueChanged).length).toBe(1);
    });

    it("remove listeners from form store", () => {
        const formStore = new FormStore("form-id");

        const formSubscriber = new MySubscriber(formStore);

        formSubscriber.RemoveFormListeners();

        expect(formStore.listeners(FieldRegistered).length).toBe(0);
        expect(formStore.listeners(FieldPropsChanged).length).toBe(0);
        expect(formStore.listeners(ValueChanged).length).toBe(0);

    });

    describe("field validation", () => {
        it("MUST validate when specific validationType flag is present without error", async done => {
            const fieldId = "field-id";
            const initialValue = "initial valid value";
            const errorMessage = "error message";

            const validatorValidateCallback = sandbox.spy(ContainsValidator.prototype, "Validate");
            const fieldChildren = [<ContainsValidator value="valid" error={errorMessage} />];
            const formStore = new FormStore("form-id");
            const formStoreValidateCallback = sandbox.spy(FormStore.prototype, "ValidateField");
            const subscriber = new MySubscriber(formStore);

            const fieldProps: FieldStateProps = {
                name: "field-name",
                children: fieldChildren,
                validationType: FieldValidationType.OnValueChange
            };

            formStore.RegisterField(fieldId, undefined, initialValue, undefined, fieldProps);
            try {
                await subscriber.ValidateField(fieldId, initialValue, FieldValidationType.OnValueChange);
                expect(validatorValidateCallback.called).toBe(true);
                expect(formStoreValidateCallback.called).toBe(true);
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
            const formStore = new FormStore("form-id");
            const formStoreValidateCallback = sandbox.spy(FormStore.prototype, "ValidateField");
            const subscriber = new MySubscriber(formStore);

            const fieldProps: FieldStateProps = {
                name: "field-name",
                children: fieldChildren,
                validationType: FieldValidationType.OnValueChange
            };

            formStore.RegisterField(fieldId, undefined, initialValue, undefined, fieldProps);
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
            const formStore = new FormStore("form-id");
            const formStoreValidateCallback = sandbox.spy(FormStore.prototype, "ValidateField");
            const subscriber = new MySubscriber(formStore);

            const fieldProps: FieldStateProps = {
                name: "field-name",
                children: fieldChildren,
                validationType: FieldValidationType.OnPropsChange
            };

            formStore.RegisterField(fieldId, undefined, initialValue, undefined, fieldProps);
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
            const formStore = new FormStore("form-id");
            const formStoreValidateCallback = sandbox.spy(FormStore.prototype, "ValidateField");
            const subscriber = new MySubscriber(formStore);

            // Validation is skipped because props are undefined
            formStore.RegisterField(fieldId, undefined, initialValue);
            subscriber.ValidateField(fieldId, initialValue, FieldValidationType.OnValueChange);

            expect(formStoreValidateCallback.called).toBe(false);
            expect(validatorValidateCallback.called).toBe(false);
            expect(formStore.GetField(fieldId).Error).toBeUndefined();
        });
    });

    describe("form validation", () => {
        fit("validate formState object with an error", async done => {
            const fieldId = "field-id";
            const initialValue = "initial value";
            const errorMessage = "error message";
            const formValidationType = FieldValidationType.OnValueChange;

            const validatorValidateCallback = sandbox.spy(TestFormValidator.prototype, "Validate");
            const formChildren = [<TestFormValidator minLength={1000} error={errorMessage} />];
            const formStore = new FormStore("form-id");

            const formProps: FormStateProps = {
                children: formChildren,
                formValidationType: formValidationType
            };

            formStore.UpdateFormProps(formProps);

            const formStoreValidateCallback = sandbox.spy(FormStore.prototype, "ValidateForm");
            const subscriber = new MySubscriber(formStore);

            try {
                // Validation is skipped because props are undefined
                formStore.RegisterField(fieldId, undefined, initialValue);
                await subscriber.ValidateForm(formValidationType);

                expect(formStoreValidateCallback.called).toBe(true);
                expect(validatorValidateCallback.called).toBe(true);
                expect(formStore.GetState().Form.Error).toBeDefined();
                expect(formStore.GetState().Form.Error!.Message).toBe(errorMessage);
            } catch (error) {
                done.fail(error);
            }

            done();
        });
    });
});
