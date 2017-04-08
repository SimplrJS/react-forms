import { FormStoresHandlerClass } from "../../src/stores/form-stores-handler";

describe("Form stores handler", () => {
    it("should get next store unique formId", () => {
        let storesHandler = new FormStoresHandlerClass();
        let a = storesHandler.NextStoreId();
        let b = storesHandler.NextStoreId();

        expect(a).toBeTruthy();
        expect(typeof a).toBe("string");
        expect(a).not.toBe(b);
    });

    it("should register and get generated formId", () => {
        let storesHandler = new FormStoresHandlerClass();
        let generatedFormId = storesHandler.RegisterForm();

        expect(generatedFormId).toBeTruthy();
        expect(typeof generatedFormId).toBe("string");
        expect(storesHandler.Exists(generatedFormId)).toBe(true);
    });

    it("should register with custom formId", () => {
        let storesHandler = new FormStoresHandlerClass();
        const FORM_ID = "custom-form-id";

        expect(storesHandler.RegisterForm(FORM_ID)).toBe(FORM_ID);
        expect(storesHandler.Exists(FORM_ID)).toBe(true);
    });

    it("should return true if form store exists", () => {
        let storesHandler = new FormStoresHandlerClass();
        const FORM_ID = "custom-form-id";
        const ANOTHER_FORM_ID = "another-custom-form-id";
        storesHandler.RegisterForm(FORM_ID);

        expect(storesHandler.Exists(FORM_ID)).toBe(true);
        expect(storesHandler.Exists(ANOTHER_FORM_ID)).toBe(false);
    });

    it("should register and unregister form", () => {
        let storesHandler = new FormStoresHandlerClass();
        let generatedFormId = storesHandler.RegisterForm();

        expect(storesHandler.Exists(generatedFormId)).toBe(true);
        storesHandler.UnregisterForm(generatedFormId);
        expect(storesHandler.Exists(generatedFormId)).toBe(false);
    });

    it("should get store", () => {
        let storesHandler = new FormStoresHandlerClass();
        let generatedFormId = storesHandler.RegisterForm();

        expect(storesHandler.GetStore(generatedFormId)).toBeTruthy();
    });
});
