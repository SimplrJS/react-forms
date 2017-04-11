import { FormStore } from "../../src/stores/form-store";
import { FormError } from "../../src/contracts/error";

describe("Form store", () => {
    it("returns state", () => {
        const formId = "FORM-ID";
        const formStore = new FormStore(formId);

        expect(formStore.GetState()).not.toBeUndefined();
    });

    it("returns fieldId from fieldName and fieldGroupId", () => {
        const formId = "FORM-ID";
        const fieldName = "FIELD-NAME";
        const fieldGroupId = "FIELD-GROUP-ID";
        const formStore = new FormStore(formId);

        const fieldId = formStore.GetFieldId(fieldName, fieldGroupId);

        expect(typeof fieldId).toBe("string");
        expect(fieldId.indexOf(fieldName)).not.toBe(-1);
        expect(fieldId.indexOf(fieldGroupId)).not.toBe(-1);
    });

    it("registers a field", () => {
        const formId = "FORM-ID";
        const fieldId = "FIELD-ID";
        const initialValue = "INITIAL-VALUE";
        const formStore = new FormStore(formId);

        formStore.RegisterField(fieldId, initialValue);
        expect(formStore.GetField(fieldId)).not.toBeUndefined();
        expect(formStore.HasField(fieldId)).toBe(true);
        expect(formStore.GetField(fieldId).InitialValue).toBe(initialValue);
    });

    it("unregisters a field", () => {
        const formId = "FORM-ID";
        const fieldId = "FIELD-ID";
        const initialValue = "INITIAL-VALUE";
        const formStore = new FormStore(formId);

        formStore.RegisterField(fieldId, initialValue);
        formStore.UnregisterField(fieldId);
        expect(formStore.GetField(fieldId)).toBeUndefined();
        expect(formStore.HasField(fieldId)).toBe(false);
    });

    it("has a field", () => {
        const formId = "FORM-ID";
        const fieldId = "FIELD-ID";
        const initialValue = "INITIAL-VALUE";
        const formStore = new FormStore(formId);

        expect(formStore.HasField(fieldId)).toBe(false);
        formStore.RegisterField(fieldId, initialValue);
        expect(formStore.HasField(fieldId)).toBe(true);
    });

    it("get a field", () => {
        const formId = "FORM-ID";
        const fieldId = "FIELD-ID";
        const initialValue = "INITIAL-VALUE";
        const formStore = new FormStore(formId);

        expect(formStore.GetField(fieldId)).toBeUndefined();
        formStore.RegisterField(fieldId, initialValue);
        expect(formStore.GetField(fieldId)).not.toBeUndefined();
    });

    it("value changed", () => {
        const formId = "FORM-ID";
        const fieldId = "FIELD-ID";
        const initialValue = "INITIAL-VALUE";
        const nextValue = "NEXT-VALUE";
        const formStore = new FormStore(formId);

        formStore.RegisterField(fieldId, initialValue);
        expect(formStore.GetField(fieldId).Value).toBe(initialValue);
        formStore.ValueChanged(fieldId, nextValue);
        expect(formStore.GetField(fieldId).Value).toBe(nextValue);
    });

    it("validate field without error", async (done) => {
        const formId = "FORM-ID";
        const fieldId = "FIELD-ID";
        const initialValue = "INITIAL-VALUE";
        const formStore = new FormStore(formId);

        formStore.RegisterField(fieldId, initialValue);
        const validationPromise = new Promise<void>((resolve, reject) => {
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

        setTimeout(() => {
            try {
                expect(formStore.GetField(fieldId).Validating).toBe(false);
                done();
            } catch (error) {
                done.fail(error);
            }
        }, 60);
    });

    it("validate field with error", async (done) => {
        const formId = "FORM-ID";
        const fieldId = "FIELD-ID";
        const initialValue = "INITIAL-VALUE";
        const formStore = new FormStore(formId);
        const formError: FormError = { Message: "Error Message" };

        formStore.RegisterField(fieldId, initialValue);
        const validationPromise = new Promise<void>((resolve, reject) => {
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

        setTimeout(() => {
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
        }, 60);
    });
});
