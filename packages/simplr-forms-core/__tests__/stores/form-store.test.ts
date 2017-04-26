import { recordify } from "typed-immutable-record";
import * as Immutable from "immutable";

import { FormStore } from "../../src/stores/form-store";
import { FormError } from "../../src/contracts/error";
import { FieldStatePropsRecord, FieldStateProps } from "../../src/contracts/field";

import { MyFieldProps } from "../test-components/test-field";

describe("Form store", () => {
    const formId = "form-id";
    let formStore: FormStore;

    beforeEach(() => {
        formStore = new FormStore(formId);
    });

    it("returns state", () => {
        const formId = "FORM-ID";
        const formStore = new FormStore(formId);

        expect(formStore.GetState()).not.toBeUndefined();
    });

    it("returns fieldId from fieldName and fieldGroupId", () => {
        const fieldName = "FIELD-NAME";
        const fieldGroupId = "FIELD-GROUP-ID";

        const fieldId = formStore.GetFieldId(fieldName, fieldGroupId);

        expect(typeof fieldId).toBe("string");
        expect(fieldId.indexOf(fieldName)).not.toBe(-1);
        expect(fieldId.indexOf(fieldGroupId)).not.toBe(-1);
    });

    it("registers a field", () => {
        const fieldId = "FIELD-ID";
        const initialValue = "INITIAL-VALUE";
        const defaultValue = "DEFAULT-VALUE";

        formStore.RegisterField(fieldId, initialValue, defaultValue);
        expect(formStore.HasField(fieldId)).toBe(true);
        expect(formStore.GetField(fieldId)).not.toBeUndefined();
        expect(formStore.GetField(fieldId).Value).toBe(initialValue);
        expect(formStore.GetField(fieldId).DefaultValue).toBe(defaultValue);
    });

    it("unregisters a field", () => {
        const fieldId = "FIELD-ID";
        const initialValue = "INITIAL-VALUE";
        const defaultValue = "DEFAULT-VALUE";

        formStore.RegisterField(fieldId, initialValue, defaultValue);
        formStore.UnregisterField(fieldId);
        expect(formStore.GetField(fieldId)).toBeUndefined();
        expect(formStore.HasField(fieldId)).toBe(false);
    });

    it("has a field", () => {
        const fieldId = "FIELD-ID";
        const initialValue = "INITIAL-VALUE";
        const defaultValue = "DEFAULT-VALUE";

        expect(formStore.HasField(fieldId)).toBe(false);
        formStore.RegisterField(fieldId, initialValue, defaultValue);
        expect(formStore.HasField(fieldId)).toBe(true);
    });

    it("get a field", () => {
        const fieldId = "FIELD-ID";
        const initialValue = "INITIAL-VALUE";
        const defaultValue = "DEFAULT-VALUE";

        expect(formStore.GetField(fieldId)).toBeUndefined();
        formStore.RegisterField(fieldId, initialValue, defaultValue);
        expect(formStore.GetField(fieldId)).not.toBeUndefined();
    });

    it("value changed", () => {
        const fieldId = "FIELD-ID";
        const initialValue = "INITIAL-VALUE";
        const defaultValue = "DEFAULT-VALUE";
        const nextValue = "NEXT-VALUE";

        formStore.RegisterField(fieldId, initialValue, defaultValue);
        expect(formStore.GetField(fieldId).Value).toBe(initialValue);
        formStore.ValueChanged(fieldId, nextValue);
        expect(formStore.GetField(fieldId).Value).toBe(nextValue);
    });

    it("validate field without error", async (done) => {
        const fieldId = "FIELD-ID";
        const initialValue = "INITIAL-VALUE";
        const defaultValue = "DEFAULT-VALUE";

        formStore.RegisterField(fieldId, initialValue, defaultValue);
        const validationPromise = new Promise<never>((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 50);
        });

        formStore.Validate(fieldId, validationPromise);
        try {
            expect(formStore.GetField(fieldId).Validating).toBe(true);
        } catch (error) {
            done.fail(error);
        }

        try {
            await validationPromise;
            expect(formStore.GetField(fieldId).Validating).toBe(false);
            done();
        } catch (error) {
            done.fail(error);
        }
    });

    it("validate field with error", async (done) => {
        const fieldId = "FIELD-ID";
        const initialValue = "INITIAL-VALUE";
        const defaultValue = "DEFAULT-VALUE";
        const formError: FormError = { Message: "Error Message" };

        formStore.RegisterField(fieldId, initialValue, defaultValue);
        const validationPromise = new Promise<never>((resolve, reject) => {
            setTimeout(() => {
                reject(formError);
            }, 50);
        });

        formStore.Validate(fieldId, validationPromise);
        try {
            expect(formStore.GetField(fieldId).Validating).toBe(true);
        } catch (error) {
            done.fail(error);
        }

        try {
            await validationPromise;
        } catch (err) {
            // Validation promise was rejected
            // Expects in the subsequent try block
        }

        try {
            const error = formStore.GetField(fieldId).Error;
            expect(formStore.GetField(fieldId).Validating).toBe(false);
            expect(error).not.toBeUndefined();
            expect(error).not.toBeNull();
            expect(error!.Message).toBe(formError.Message);

            done();
        } catch (error) {
            done.fail(error);
        }
    });

    it("skip validation when newValue has expired", async (done) => {
        const fieldId = "FIELD-ID";
        const initialValue = "INITIAL-VALUE";
        const defaultValue = "DEFAULT-VALUE";
        const formError = "field error";

        formStore.RegisterField(fieldId, initialValue, defaultValue);
        const validationPromise = new Promise<never>((resolve, reject) => {
            setTimeout(() => {
                reject(formError);
            }, 50);
        });

        formStore.Validate(fieldId, validationPromise);

        // Imitate removal of last letter
        formStore.ValueChanged(fieldId, initialValue.slice(0, initialValue.length - 1));

        try {
            expect(formStore.GetField(fieldId).Validating).toBe(true);
        } catch (error) {
            done.fail(error);
        }

        try {
            await validationPromise;
        } catch (err) {
            // Validation promise was rejected
            // Expects in the subsequent try block
        }

        try {
            // It SHOULD still validating to be true because validation was skipped of expired value
            expect(formStore.GetField(fieldId).Validating).toBe(true);
            expect(formStore.GetField(fieldId).Error).toBeUndefined();
        } catch (err) {
            done.fail(err);
        }

        done();
    });

    it("registers field with props", () => {
        const fieldId = "FIELD-ID";
        const defaultValue = "DEFAULT-VALUE";
        const fieldProps: MyFieldProps = {
            name: "fieldName",
            value: "initial-value",
            defaultValue: defaultValue,
            randomKey: "random value"
        };

        formStore.RegisterField(fieldId, fieldProps.value, fieldProps.defaultValue, fieldProps);

        const fieldPropsRecord = recordify<FieldStateProps, FieldStatePropsRecord>(fieldProps);

        // Deep-check the updated props
        expect(Immutable.is(formStore.GetField(fieldId).Props, fieldPropsRecord)).toBe(true);
    });

    it("updates field props", () => {
        const fieldId = "FIELD-ID";
        const defaultValue = "DEFAULT-VALUE";
        const fieldProps: MyFieldProps = {
            name: "field-name",
            value: "initialValue",
            defaultValue: defaultValue,
            randomKey: "random value"
        };

        // Changed value and removed randomKey prop
        const fieldPropsNext: MyFieldProps = {
            name: fieldProps.name,
            value: "Updated value"
        };
        const fieldPropsNextRecord = recordify<FieldStateProps, FieldStatePropsRecord>(fieldPropsNext);

        formStore.RegisterField(fieldId, fieldProps.value, fieldProps.defaultValue, fieldProps);
        formStore.UpdateProps(fieldId, fieldPropsNext);

        // Deep-check the updated props
        expect(Immutable.is(formStore.GetField(fieldId).Props, fieldPropsNextRecord)).toBe(true);
    });

    it("clears all fields values", () => {
        let fieldsIds: string[] = [];
        for (let i = 0; i < 5; i++) {
            fieldsIds.push(`field-id-${i}`);
        }

        const defaultValue = "default value";
        const fieldProps: MyFieldProps = {
            name: "field-name",
            value: "initial value",
            defaultValue: defaultValue,
            randomKey: "random value"
        };

        for (const fieldId of fieldsIds) {
            formStore.RegisterField(fieldId, fieldProps.value, fieldProps.defaultValue, fieldProps);
        }
        formStore.ClearFields();

        for (const fieldId of fieldsIds) {
            const fieldState = formStore.GetField(fieldId);
            expect(fieldState.Value).toBe(defaultValue);
        }
    });

    it("clears fields values by fieldsIds", () => {
        let fieldsIds: string[] = [];
        for (let i = 0; i < 5; i++) {
            fieldsIds.push(`field-id-${i}`);
        }
        const clearedFieldId = fieldsIds[0];
        const defaultValue = "default value";
        const fieldProps: MyFieldProps = {
            name: "field-name",
            value: "initial value",
            defaultValue: defaultValue,
            randomKey: "random value"
        };

        for (const fieldId of fieldsIds) {
            formStore.RegisterField(fieldId, fieldProps.value, fieldProps.defaultValue, fieldProps);
        }
        formStore.ClearFields([clearedFieldId]);

        for (const fieldId of fieldsIds) {
            const fieldState = formStore.GetField(fieldId);
            if (fieldId === clearedFieldId) {
                expect(fieldState.Value).toBe(defaultValue);
            } else {
                expect(fieldState.Value).not.toBe(defaultValue);
            }
        }
    });

    it("resets all fields values", () => {
        let fieldsIds: string[] = [];
        for (let i = 0; i < 5; i++) {
            fieldsIds.push(`field-id-${i}`);
        }
        const initialValue = "initial value";
        const nextValue = "next value";
        const fieldProps: MyFieldProps = {
            name: "field-name",
            value: initialValue,
            defaultValue: "default value",
            randomKey: "random value"
        };

        for (const fieldId of fieldsIds) {
            formStore.RegisterField(fieldId, fieldProps.value, fieldProps.defaultValue, fieldProps);
            formStore.ValueChanged(fieldId, nextValue);
        }
        formStore.ResetFields();

        for (const fieldId of fieldsIds) {
            const fieldState = formStore.GetField(fieldId);
            expect(fieldState.Value).toBe(initialValue);
        }
    });

    it("resets fields values by fieldsIds", () => {
        let fieldsIds: string[] = [];
        for (let i = 0; i < 5; i++) {
            fieldsIds.push(`field-id-${i}`);
        }
        const resetedFieldId = fieldsIds[0];
        const initialValue = "initial value";
        const nextValue = "next value";
        const fieldProps: MyFieldProps = {
            name: "field-name",
            value: initialValue,
            defaultValue: "default value",
            randomKey: "random value"
        };

        for (const fieldId of fieldsIds) {
            formStore.RegisterField(fieldId, fieldProps.value, fieldProps.defaultValue, fieldProps);
            formStore.ValueChanged(fieldId, nextValue);
        }
        formStore.ResetFields([resetedFieldId]);

        for (const fieldId of fieldsIds) {
            const fieldState = formStore.GetField(fieldId);
            if (fieldId === resetedFieldId) {
                expect(fieldState.Value).toBe(initialValue);
            } else {
                expect(fieldState.Value).toBe(nextValue);
            }
        }
    });
});
