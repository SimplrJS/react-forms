import { FormStore } from "../../src/stores/form-store";

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
});
