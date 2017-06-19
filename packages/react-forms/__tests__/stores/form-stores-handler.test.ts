import { FSHContainer, FormStoresHandler } from "../../src/stores/form-stores-handler";
import * as Actions from "../../src/actions/form-stores-handler";
import * as sinon from "sinon";

describe("Form stores handler", () => {
    it("returns next store unique formId", () => {
        const storesHandler = new FormStoresHandler();
        const a = storesHandler.NextStoreId();
        const b = storesHandler.NextStoreId();

        expect(a).toBeTruthy();
        expect(typeof a).toBe("string");
        expect(a).not.toBe(b);
    });

    it("returns count of currently registered stores", () => {
        const storesHandler = new FormStoresHandler();
        const id = storesHandler.NextStoreId();
        const id2 = storesHandler.NextStoreId();

        storesHandler.RegisterForm(id);
        const count = storesHandler.StoresCount;
        expect(typeof count).toBe("number");
        expect(count).toBeGreaterThan(0);

        storesHandler.RegisterForm(id2);
        const count2 = storesHandler.StoresCount;
        expect(count2).toBeGreaterThan(count);
    });

    it("registers and gets generated formId", () => {
        const storesHandler = new FormStoresHandler();
        const generatedFormId = storesHandler.RegisterForm();

        expect(generatedFormId).toBeTruthy();
        expect(typeof generatedFormId).toBe("string");
        expect(storesHandler.Exists(generatedFormId)).toBe(true);
    });

    it("registers with custom formId", () => {
        const storesHandler = new FormStoresHandler();
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

        FSHContainer.SetFormStoresHandler(new FormStoresHandler(), true);

        expect(storesHandler.StoresCount).toBe(0);
    });

    it("returns true if form store exists", () => {
        const storesHandler = new FormStoresHandler();
        const FORM_ID = "custom-form-id";
        const ANOTHER_FORM_ID = "another-custom-form-id";
        storesHandler.RegisterForm(FORM_ID);

        expect(storesHandler.Exists(FORM_ID)).toBe(true);
        expect(storesHandler.Exists(ANOTHER_FORM_ID)).toBe(false);
    });

    it("registers and unregisters form", () => {
        const storesHandler = new FormStoresHandler();
        const generatedFormId = storesHandler.RegisterForm();

        expect(storesHandler.Exists(generatedFormId)).toBe(true);
        storesHandler.UnregisterForm(generatedFormId);
        expect(storesHandler.Exists(generatedFormId)).toBe(false);
    });

    it("returns store", () => {
        const storesHandler = new FormStoresHandler();
        const generatedFormId = storesHandler.RegisterForm();

        expect(storesHandler.GetStore(generatedFormId)).toBeTruthy();
    });

    it("emits register action when registering a new form", () => {
        const storesHandler = new FormStoresHandler();
        const callbackSpy = sinon.spy();

        storesHandler.addListener(Actions.FormRegistered, callbackSpy);
        storesHandler.RegisterForm("some-kind-of-id");

        expect(callbackSpy.called).toBe(true);
    });

    it("emits unregister action when unregistering a form", () => {
        const storesHandler = new FormStoresHandler();
        const formId = "form-id";
        const callbackSpy = sinon.spy();

        storesHandler.RegisterForm(formId);
        storesHandler.addListener(Actions.FormUnregistered, callbackSpy);
        storesHandler.UnregisterForm(formId);

        expect(callbackSpy.called).toBe(true);
    });
});
