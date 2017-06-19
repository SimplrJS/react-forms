import * as React from "react";
import { shallow, mount } from "enzyme";

import { FSHContainer, FormStoresHandler } from "../../src/stores/form-stores-handler";
import { MyTestForm } from "../test-components/test-form";

describe("Form base", () => {
    beforeEach(() => {
        FSHContainer.SetFormStoresHandler(new FormStoresHandler(), true);
    });

    describe("registers when", () => {
        it("formId is undefined and destroyOnUnmount prop is false", () => {
            expect(() => shallow(
                <MyTestForm destroyOnUnmount={false}></MyTestForm>
            )).toThrow();
        });

        it("formId is undefined and destroyOnUnmount prop is true", () => {
            const FormStoresHandler = FSHContainer.FormStoresHandler;
            const form = shallow(<MyTestForm></MyTestForm>);
            const formId = (form.instance() as any).FormId;

            expect(FormStoresHandler.Exists(formId)).toBe(true);
        });

        it("formId is present and destroyOnUnmount is true", () => {
            const FormStoresHandler = FSHContainer.FormStoresHandler;
            const FORM_ID = "custom-form-id";
            shallow(
                <MyTestForm destroyOnUnmount={true} formId={FORM_ID}></MyTestForm>
            );

            expect(FormStoresHandler.Exists(FORM_ID)).toBe(true);
        });

        it("formId is present and destroyOnUnmount is true and already exists in FormStoresHandler", () => {
            // This is to check the case, when form is rendered with destroyOnUnmount false first
            // and destroyOnUnmount true second
            const FORM_ID = "custom-form-id";

            mount(<MyTestForm destroyOnUnmount={false} formId={FORM_ID}></MyTestForm>);
            expect(() => mount(<MyTestForm destroyOnUnmount={true} formId={FORM_ID}></MyTestForm>)).toThrow();
        });

        it("another FormBase registered with the same formId", () => {
            // This is to check the case, when form is rendered with destroyOnUnmount false first
            // and destroyOnUnmount true second
            const FORM_ID = "custom-form-id";
            const formComponent = <MyTestForm destroyOnUnmount={true} formId={FORM_ID}></MyTestForm>;

            shallow(formComponent);
            expect(() => shallow(formComponent)).toThrow();
        });
    });

    describe("unregisters when", () => {
        it("formId is undefined and destroyOnUnmount prop is true", () => {
            const FormStoresHandler = FSHContainer.FormStoresHandler;
            const form = shallow(<MyTestForm></MyTestForm>);
            const formId = (form.instance() as any).FormId;

            form.unmount();

            expect(FormStoresHandler.Exists(formId)).toBe(false);
            expect(FormStoresHandler.GetStore(formId)).toBeUndefined();
        });

        it("formId is present and destroyOnUnmount is true", () => {
            const FormStoresHandler = FSHContainer.FormStoresHandler;
            const formId = "custom-form-id";
            const form = mount(
                <MyTestForm destroyOnUnmount={true} formId={formId}></MyTestForm>
            );

            form.unmount();
            expect(FormStoresHandler.Exists(formId)).toBe(false);
            expect(FormStoresHandler.GetStore(formId)).toBeUndefined();
        });
    });
});
