import { FSHContainer, FormStoresHandlerClass } from "../../src/stores/form-stores-handler";
import * as Actions from "../../src/actions/form-stores-handler-actions";
import * as sinon from "Sinon";

describe("Form stores handler", () => {
    it("returns next store unique formId", () => {
        let storesHandler = new FormStoresHandlerClass();
        let a = storesHandler.NextStoreId();
        let b = storesHandler.NextStoreId();

        expect(a).toBeTruthy();
        expect(typeof a).toBe("string");
        expect(a).not.toBe(b);
    });

    it("returns count of currently registered stores", () => {
        let storesHandler = new FormStoresHandlerClass();
        let id = storesHandler.NextStoreId();
        let id2 = storesHandler.NextStoreId();

        storesHandler.RegisterForm(id);
        let count = storesHandler.StoresCount;
        expect(typeof count).toBe("number");
        expect(count).toBeGreaterThan(0);

        storesHandler.RegisterForm(id2);
        let count2 = storesHandler.StoresCount;
        expect(count2).toBeGreaterThan(count);
    });

    it("registers and gets generated formId", () => {
        let storesHandler = new FormStoresHandlerClass();
        let generatedFormId = storesHandler.RegisterForm();

        expect(generatedFormId).toBeTruthy();
        expect(typeof generatedFormId).toBe("string");
        expect(storesHandler.Exists(generatedFormId)).toBe(true);
    });

    it("registers with custom formId", () => {
        let storesHandler = new FormStoresHandlerClass();
        const FORM_ID = "custom-form-id";

        expect(storesHandler.RegisterForm(FORM_ID)).toBe(FORM_ID);
        expect(storesHandler.Exists(FORM_ID)).toBe(true);
    });

    it("registers with custom formId and cleans up after container reset", () => {
        const storesHandler = FSHContainer.FormStoresHandler;
        const FORM_ID = "custom-form-id";

        expect(storesHandler.StoresCount).toBe(0);

        expect(storesHandler.RegisterForm(FORM_ID)).toBe(FORM_ID);

        expect(storesHandler.StoresCount).toBe(1);
        expect(storesHandler.Exists(FORM_ID)).toBe(true);

        FSHContainer.SetFormStoresHandler(new FormStoresHandlerClass(), true);

        expect(storesHandler.StoresCount).toBe(0);
    });

    it("returns true if form store exists", () => {
        let storesHandler = new FormStoresHandlerClass();
        const FORM_ID = "custom-form-id";
        const ANOTHER_FORM_ID = "another-custom-form-id";
        storesHandler.RegisterForm(FORM_ID);

        expect(storesHandler.Exists(FORM_ID)).toBe(true);
        expect(storesHandler.Exists(ANOTHER_FORM_ID)).toBe(false);
    });

    it("registers and unregisters form", () => {
        let storesHandler = new FormStoresHandlerClass();
        let generatedFormId = storesHandler.RegisterForm();

        expect(storesHandler.Exists(generatedFormId)).toBe(true);
        storesHandler.UnregisterForm(generatedFormId);
        expect(storesHandler.Exists(generatedFormId)).toBe(false);
    });

    it("returns store", () => {
        let storesHandler = new FormStoresHandlerClass();
        let generatedFormId = storesHandler.RegisterForm();

        expect(storesHandler.GetStore(generatedFormId)).toBeTruthy();
    });

    it("emits register action when registering a new form", () => {
        const storesHandler = new FormStoresHandlerClass();
        const callbackSpy = sinon.spy();

        storesHandler.addListener(Actions.FormRegistered, callbackSpy);
        storesHandler.RegisterForm("some-kind-of-id");

        expect(callbackSpy.called).toBe(true);
    });

    it("emits unregister action when unregistering a form", () => {
        const storesHandler = new FormStoresHandlerClass();
        const formId = "form-id";
        const callbackSpy = sinon.spy();

        storesHandler.RegisterForm(formId);
        storesHandler.addListener(Actions.FormUnregistered, callbackSpy);
        storesHandler.UnregisterForm(formId);

        expect(callbackSpy.called).toBe(true);
    });
});
