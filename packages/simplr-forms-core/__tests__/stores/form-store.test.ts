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
        const value = "value";
        const defaultValue = "DEFAULT-VALUE";

        formStore.RegisterField(fieldId, defaultValue, undefined, value);

        expect(formStore.HasField(fieldId)).toBe(true);

        const fieldState = formStore.GetField(fieldId);

        expect(fieldState).not.toBeUndefined();
        expect(fieldState.Value).toBe(value);
        expect(fieldState.InitialValue).toBe(value);
        expect(fieldState.DefaultValue).toBe(defaultValue);
    });

    // TODO: Write test with initial value

    it("unregisters a field", () => {
        const fieldId = "field-id";

        formStore.RegisterField(fieldId, "", undefined, "value");
        formStore.UnregisterField(fieldId);

        expect(formStore.GetField(fieldId)).toBeUndefined();
        expect(formStore.HasField(fieldId)).toBe(false);
    });

    it("has a field", () => {
        const fieldId = "field-id";
        expect(formStore.HasField(fieldId)).toBe(false);
        formStore.RegisterField(fieldId, "", undefined, "");
        expect(formStore.HasField(fieldId)).toBe(true);
    });

    it("get a field", () => {
        const fieldId = "field-id";

        expect(formStore.GetField(fieldId)).toBeUndefined();
        formStore.RegisterField(fieldId, "", undefined, "");
        expect(formStore.GetField(fieldId)).not.toBeUndefined();
    });

    it("value changed", () => {
        const fieldId = "field-id";
        const value = "value";
        const nextValue = "NEXT-VALUE";

        formStore.RegisterField(fieldId, undefined, undefined, value);
        expect(formStore.GetField(fieldId).Value).toBe(value);

        formStore.ValueChanged(fieldId, nextValue);
        expect(formStore.GetField(fieldId).Value).toBe(nextValue);
    });

    it("validate field without error", async (done) => {
        const fieldId = "field-id";

        formStore.RegisterField(fieldId, undefined, undefined, "value");
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
        const formError: FormError = { Message: "Error Message" };

        formStore.RegisterField(fieldId, undefined, undefined, "value");
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
        const formError = "field error";
        const value = "text";

        formStore.RegisterField(fieldId, undefined, undefined, value);
        const validationPromise = new Promise<never>((resolve, reject) => {
            setTimeout(() => {
                reject(formError);
            }, 50);
        });

        formStore.Validate(fieldId, validationPromise);

        // Imitate removal of last letter
        formStore.ValueChanged(fieldId, value.slice(0, value.length - 1));

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
        const fieldId = "field-id";
        const fieldProps: MyFieldProps = {
            name: "fieldName",
            randomKey: "random value"
        };

        formStore.RegisterField(fieldId, undefined, undefined, undefined, fieldProps);

        const fieldPropsRecord = recordify<FieldStateProps, FieldStatePropsRecord>(fieldProps);

        // Deep-check the updated props
        expect(Immutable.is(formStore.GetField(fieldId).Props, fieldPropsRecord)).toBe(true);
    });

    it("updates field props", () => {
        const fieldId = "FIELD-ID";
        const fieldProps: MyFieldProps = {
            name: "field-name",
            randomKey: "random value"
        };

        // Removed randomKey prop
        const fieldPropsNext: MyFieldProps = {
            name: fieldProps.name,
        };
        const fieldPropsNextRecord = recordify<FieldStateProps, FieldStatePropsRecord>(fieldPropsNext);

        formStore.RegisterField(fieldId, undefined, undefined, undefined, fieldProps);
        formStore.UpdateProps(fieldId, fieldPropsNext);

        // Deep-check the updated props
        expect(Immutable.is(formStore.GetField(fieldId).Props, fieldPropsNextRecord)).toBe(true);
    });

    it("clears all fields values to default values", () => {
        let fieldsIds: string[] = [];
        for (let i = 0; i < 5; i++) {
            fieldsIds.push(`field-id-${i}`);
        }

        const defaultValue = "default value";
        const fieldProps: MyFieldProps = {
            name: "field-name",
            defaultValue: defaultValue,
            value: "value"
        };

        for (const fieldId of fieldsIds) {
            formStore.RegisterField(fieldId, fieldProps.defaultValue, undefined, fieldProps.value, fieldProps);
        }
        formStore.ClearFields();

        for (const fieldId of fieldsIds) {
            const fieldState = formStore.GetField(fieldId);
            expect(fieldState.Value).toBe(defaultValue);
        }
    });

    it("clears fields values by fieldsIds to default values", () => {
        let fieldsIds: string[] = [];
        for (let i = 0; i < 5; i++) {
            fieldsIds.push(`field-id-${i}`);
        }
        const fieldToClearId = fieldsIds[0];
        const defaultValue = "default value";
        const fieldProps: MyFieldProps = {
            name: "field-name",
            defaultValue: defaultValue,
            value: "value",
        };

        for (const fieldId of fieldsIds) {
            formStore.RegisterField(fieldId, fieldProps.defaultValue, undefined, fieldProps.value, fieldProps);
        }
        formStore.ClearFields([fieldToClearId]);

        for (const fieldId of fieldsIds) {
            const fieldState = formStore.GetField(fieldId);
            if (fieldId === fieldToClearId) {
                expect(fieldState.Value).toBe(defaultValue);
            } else {
                expect(fieldState.Value).not.toBe(defaultValue);
            }
        }
    });

    it("resets all fields values to initial values", () => {
        let fieldsIds: string[] = [];
        for (let i = 0; i < 5; i++) {
            fieldsIds.push(`field-id-${i}`);
        }
        const initialValue = "initial value";
        const nextValue = "next value";
        const fieldProps: MyFieldProps = {
            name: "field-name",
            initialValue: initialValue,
            value: "value",
            randomKey: "random value"
        };

        for (const fieldId of fieldsIds) {
            formStore.RegisterField(fieldId, undefined, fieldProps.initialValue, fieldProps.value, fieldProps);
            formStore.ValueChanged(fieldId, nextValue);
        }
        formStore.ResetFields();

        for (const fieldId of fieldsIds) {
            const fieldState = formStore.GetField(fieldId);
            expect(fieldState.Value).toBe(initialValue);
        }
    });

    it("resets fields values by fieldsIds to initial values", () => {
        let fieldsIds: string[] = [];
        for (let i = 0; i < 5; i++) {
            fieldsIds.push(`field-id-${i}`);
        }
        const fieldToResetId = fieldsIds[0];
        const value = "value";
        const nextValue = "next value";
        const fieldProps: MyFieldProps = {
            name: "field-name",
            value: value,
            randomKey: "random value"
        };

        for (const fieldId of fieldsIds) {
            formStore.RegisterField(fieldId, undefined, undefined, fieldProps.value, fieldProps);
            formStore.ValueChanged(fieldId, nextValue);
        }
        formStore.ResetFields([fieldToResetId]);

        for (const fieldId of fieldsIds) {
            const fieldState = formStore.GetField(fieldId);
            if (fieldId === fieldToResetId) {
                expect(fieldState.Value).toBe(value);
            } else {
                expect(fieldState.Value).toBe(nextValue);
            }
        }
    });
});
