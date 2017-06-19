import { recordify } from "typed-immutable-record";
import * as Immutable from "immutable";

import { FormStore } from "../../src/stores/form-store";
import { FormError } from "../../src/contracts/error";
import { FieldStorePropsRecord, FieldStoreProps } from "../../src/contracts/field";
import { FormStoreHelpers } from "../../src/stores/form-store-helpers";

import { MyFieldProps } from "../test-components/test-field";

describe("Form store", () => {
    const formId = "form-id";
    let formStore: FormStore;

    beforeEach(() => {
        formStore = new FormStore(formId);
    });

    it("returns state", () => {
        expect(formStore.GetState()).not.toBeUndefined();
    });

    it("returns fieldId from fieldName and fieldGroupId", () => {
        const fieldName = "FIELD-NAME";
        const fieldGroupId = "FIELD-GROUP-ID";

        const fieldId = FormStoreHelpers.GetFieldId(fieldName, fieldGroupId);

        expect(typeof fieldId).toBe("string");
        expect(fieldId.indexOf(fieldName)).not.toBe(-1);
        expect(fieldId.indexOf(fieldGroupId)).not.toBe(-1);
    });

    describe("registers a field", () => {
        it("with default value", () => {
            const fieldId = "field-id";
            const defaultValue = "default value";
            formStore.RegisterField(fieldId, "field name", defaultValue);

            expect(formStore.HasField(fieldId)).toBe(true);

            const fieldState = formStore.GetField(fieldId);

            expect(fieldState).toBeDefined();
            expect(fieldState.DefaultValue).toBe(defaultValue);
        });

        it("with only initialValue", () => {
            const fieldId = "field-id";
            const initialValue = "initial value";
            formStore.RegisterField(fieldId, "field name", undefined, initialValue);

            const fieldState = formStore.GetField(fieldId);
            expect(fieldState).toBeDefined();
            expect(fieldState.InitialValue).toBe(initialValue);
            expect(fieldState.Value).toBe(initialValue);
        });

        it("with only value", () => {
            const fieldId = "field-id";
            const value = "value";
            formStore.RegisterField(fieldId, "field name", undefined, undefined, value);

            const fieldState = formStore.GetField(fieldId);
            expect(fieldState).toBeDefined();
            expect(fieldState.InitialValue).toBe(value);
            expect(fieldState.Value).toBe(value);
        });

        it("with value and initialValue", () => {
            const fieldId = "field-id";
            const value = "value";
            const initialValue = "initial value";
            formStore.RegisterField(fieldId, "field name", undefined, initialValue, value);

            const fieldState = formStore.GetField(fieldId);
            expect(fieldState).toBeDefined();
            expect(fieldState.InitialValue).toBe(initialValue);
            expect(fieldState.Value).toBe(value);
        });
    });

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

        formStore.RegisterField(fieldId, "field-name", undefined, undefined, value);
        expect(formStore.GetField(fieldId).Value).toBe(value);

        formStore.UpdateFieldValue(fieldId, { Value: nextValue });
        expect(formStore.GetField(fieldId).Value).toBe(nextValue);
    });

    it("validate field without error", async done => {
        const fieldId = "field-id";

        formStore.RegisterField(fieldId, "field-name", undefined, undefined, "value");
        const validationPromise = new Promise<never>((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 50);
        });

        formStore.ValidateField(fieldId, validationPromise);
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

    it("validate field with error", async done => {
        const fieldId = "FIELD-ID";
        const formError: FormError = { Message: "Error Message" };

        formStore.RegisterField(fieldId, "field-name", undefined, undefined, "value");
        const validationPromise = new Promise<never>((resolve, reject) => {
            setTimeout(() => {
                reject(formError);
            }, 50);
        });

        formStore.ValidateField(fieldId, validationPromise);
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

    it("skip validation when newValue has expired", async done => {
        const fieldId = "FIELD-ID";
        const formError = "field error";
        const value = "text";

        formStore.RegisterField(fieldId, "field-name", undefined, undefined, value);
        const validationPromise = new Promise<never>((resolve, reject) => {
            setTimeout(() => {
                reject(formError);
            }, 50);
        });

        formStore.ValidateField(fieldId, validationPromise);

        // Imitate removal of last letter
        formStore.UpdateFieldValue(fieldId, { Value: value.slice(0, value.length - 1) });

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

        formStore.RegisterField(fieldId, "field-name", undefined, undefined, undefined, undefined, fieldProps);

        const fieldPropsRecord = recordify<FieldStoreProps, FieldStorePropsRecord>(fieldProps);

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
        const fieldPropsNextRecord = recordify<FieldStoreProps, FieldStorePropsRecord>(fieldPropsNext);

        formStore.RegisterField(fieldId, "field-name", undefined, undefined, undefined, undefined, fieldProps);
        formStore.UpdateFieldProps(fieldId, fieldPropsNext);

        // Deep-check the updated props
        expect(Immutable.is(formStore.GetField(fieldId).Props, fieldPropsNextRecord)).toBe(true);
    });

    it("clears all fields values to default values", () => {
        const fieldsIds: string[] = [];
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
            formStore.RegisterField(fieldId, "field-name", fieldProps.defaultValue, undefined, fieldProps.value, fieldProps);
        }
        formStore.ClearFields();

        for (const fieldId of fieldsIds) {
            const fieldState = formStore.GetField(fieldId);
            expect(fieldState.Value).toBe(defaultValue);
        }
    });

    it("clears fields values by fieldsIds to default values", () => {
        const fieldsIds: string[] = [];
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
            formStore.RegisterField(fieldId, "field-name", fieldProps.defaultValue, undefined, fieldProps.value, fieldProps);
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
        const fieldsIds: string[] = [];
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
            formStore.RegisterField(fieldId, "field-name", undefined, fieldProps.initialValue, fieldProps.value, fieldProps);
            formStore.UpdateFieldValue(fieldId, { Value: nextValue });
        }
        formStore.ResetFields();

        for (const fieldId of fieldsIds) {
            const fieldState = formStore.GetField(fieldId);
            expect(fieldState.Value).toBe(initialValue);
        }
    });

    it("resets fields values by fieldsIds to initial values", () => {
        const fieldsIds: string[] = [];
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
            formStore.RegisterField(fieldId, "field-name", undefined, undefined, fieldProps.value, fieldProps);
            formStore.UpdateFieldValue(fieldId, { Value: nextValue });
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

    describe("state properties", () => {
        it("pristine false after field value changed", () => {
            const fieldId = "field id";

            formStore.RegisterField(fieldId, "field-name", "");
            expect(formStore.GetState().Pristine).toBe(true);

            formStore.UpdateFieldValue(fieldId, { Value: "next value" });
            expect(formStore.GetState().Pristine).toBe(false);
        });

        it("touched true after field value changed", () => {
            const fieldId = "field id";

            formStore.RegisterField(fieldId, "field-name", "");
            expect(formStore.GetState().Touched).toBe(false);

            formStore.UpdateFieldValue(fieldId, { Value: "next value" });
            expect(formStore.GetState().Touched).toBe(true);
        });

        it("touched false after value updated to identical one", () => {
            const fieldId = "field id";

            formStore.RegisterField(fieldId, "field-name", "");
            expect(formStore.GetState().Touched).toBe(false);

            formStore.UpdateFieldValue(fieldId, { Value: "" });
            expect(formStore.GetState().Touched).toBe(false);
        });

        it("error true is after field error ", async done => {
            const fieldId = "field id";
            try {
                formStore.RegisterField(fieldId, "field-name", "");
                expect(formStore.GetState().HasError).toBe(false);

                await formStore.ValidateField(fieldId, new Promise<void>((resolve, reject) => {
                    reject("error message");
                }));
                expect(formStore.GetState().HasError).toBe(true);
            } catch (error) {
                done.fail(error);
            }

            done();
        });

        it("validating true after field error ", () => {
            const fieldId = "field id";
            formStore.RegisterField(fieldId, "field-name", "");
            expect(formStore.GetState().Validating).toBe(false);

            formStore.ValidateField(fieldId, new Promise<void>((resolve, reject) => {
                reject("error message");
            }));

            expect(formStore.GetState().Validating).toBe(true);
        });
    });
});
