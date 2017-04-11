import * as React from "react";
import { shallow, mount } from "enzyme";

import { FSHContainer, FormStoresHandlerClass } from "../../src/stores/form-stores-handler";
import { BasicForm } from "../basic-components/basic-form";

describe("Form base", () => {
    beforeEach(() => {
        FSHContainer.SetFormStoresHandler(new FormStoresHandlerClass(), true);
    });

    describe("registers when", () => {
        it("formId is undefined and destroyOnUnmount prop is false", () => {
            expect(() => shallow(
                <BasicForm destroyOnUnmount={false}></BasicForm>
            )).toThrow();
        });

        it("formId is undefined and destroyOnUnmount prop is true", () => {
            const FormStoresHandler = FSHContainer.FormStoresHandler;
            let form = shallow(<BasicForm></BasicForm>);
            let formId = (form.instance() as any).FormId;

            expect(FormStoresHandler.Exists(formId)).toBe(true);
        });

        it("formId is present and destroyOnUnmount is true", () => {
            const FormStoresHandler = FSHContainer.FormStoresHandler;
            const FORM_ID = "custom-form-id";
            shallow(
                <BasicForm destroyOnUnmount={true} formId={FORM_ID}></BasicForm>
            );

            expect(FormStoresHandler.Exists(FORM_ID)).toBe(true);
        });

        it("formId is present and destroyOnUnmount is true and already exists in FormStoresHandler", () => {
            // This is to check the case, when form is rendered with destroyOnUnmount false first
            // and destroyOnUnmount true second
            const FORM_ID = "custom-form-id";

            mount(<BasicForm destroyOnUnmount={false} formId={FORM_ID}></BasicForm>);
            expect(() => mount(<BasicForm destroyOnUnmount={true} formId={FORM_ID}></BasicForm>)).toThrow();
        });

        it("another FormBase registered with the same formId", () => {
            // This is to check the case, when form is rendered with destroyOnUnmount false first
            // and destroyOnUnmount true second
            const FORM_ID = "custom-form-id";
            const formComponent = <BasicForm destroyOnUnmount={true} formId={FORM_ID}></BasicForm>;

            shallow(formComponent);
            expect(() => shallow(formComponent)).toThrow();
        });
    });

    describe("unregisters when", () => {
        it("formId is undefined and destroyOnUnmount prop is true", () => {
            const FormStoresHandler = FSHContainer.FormStoresHandler;
            let form = shallow(<BasicForm></BasicForm>);
            let formId = (form.instance() as any).FormId;

            form.unmount();

            expect(FormStoresHandler.Exists(formId)).toBe(false);
            expect(FormStoresHandler.GetStore(formId)).toBeUndefined();
        });

        it("formId is present and destroyOnUnmount is true", () => {
            const FormStoresHandler = FSHContainer.FormStoresHandler;
            const formId = "custom-form-id";
            let form = mount(
                <BasicForm destroyOnUnmount={true} formId={formId}></BasicForm>
            );

            form.unmount();
            expect(FormStoresHandler.Exists(formId)).toBe(false);
            expect(FormStoresHandler.GetStore(formId)).toBeUndefined();
        });
    });
});
