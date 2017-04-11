import * as React from "react";
import { shallow, mount } from "enzyme";

import { BaseForm } from "../../src/abstractions/base-form";
import { FormProps } from "../../src/contracts/form";
import { FSHContainer, FormStoresHandlerClass } from "../../src/stores/form-stores-handler";

interface MyProps extends FormProps { }

interface MyState { }

class MyForm extends BaseForm<MyProps, MyState> {
    render(): JSX.Element {
        return <form>
            {this.props.children}
        </form>;
    }
}

describe("Form base", () => {
    beforeEach(() => {
        FSHContainer.SetFormStoresHandler(new FormStoresHandlerClass(), true);
    });

    describe("registers when", () => {
        it("formId is undefined and destroyOnUnmount prop is false", () => {
            expect(() => shallow(
                <MyForm destroyOnUnmount={false}></MyForm>
            )).toThrow();
        });

        it("formId is undefined and destroyOnUnmount prop is true", () => {
            const FormStoresHandler = FSHContainer.FormStoresHandler;
            let form = shallow(<MyForm></MyForm>);
            let formId = (form.instance() as any).FormId;

            expect(FormStoresHandler.Exists(formId)).toBe(true);
        });

        it("formId is present and destroyOnUnmount is true", () => {
            const FormStoresHandler = FSHContainer.FormStoresHandler;
            const FORM_ID = "custom-form-id";
            shallow(
                <MyForm destroyOnUnmount={true} formId={FORM_ID}></MyForm>
            );

            expect(FormStoresHandler.Exists(FORM_ID)).toBe(true);
        });

        it("formId is present and destroyOnUnmount is true and already exists in FormStoresHandler", () => {
            // This is to check the case, when form is rendered with destroyOnUnmount false first
            // and destroyOnUnmount true second
            const FORM_ID = "custom-form-id";

            mount(<MyForm destroyOnUnmount={false} formId={FORM_ID}></MyForm>);
            expect(() => mount(<MyForm destroyOnUnmount={true} formId={FORM_ID}></MyForm>)).toThrow();
        });

        it("another FormBase registered with the same formId", () => {
            // This is to check the case, when form is rendered with destroyOnUnmount false first
            // and destroyOnUnmount true second
            const FORM_ID = "custom-form-id";
            const formComponent = <MyForm destroyOnUnmount={true} formId={FORM_ID}></MyForm>;

            shallow(formComponent);
            expect(() => shallow(formComponent)).toThrow();
        });
    });

    describe("unregisters when", () => {
        it("formId is undefined and destroyOnUnmount prop is true", () => {
            const FormStoresHandler = FSHContainer.FormStoresHandler;
            let form = shallow(<MyForm></MyForm>);
            let formId = (form.instance() as any).FormId;

            form.unmount();

            expect(FormStoresHandler.Exists(formId)).toBe(false);
            expect(FormStoresHandler.GetStore(formId)).toBeUndefined();
        });

        it("formId is present and destroyOnUnmount is true", () => {
            const FormStoresHandler = FSHContainer.FormStoresHandler;
            const formId = "custom-form-id";
            let form = mount(
                <MyForm destroyOnUnmount={true} formId={formId}></MyForm>
            );

            form.unmount();
            expect(FormStoresHandler.Exists(formId)).toBe(false);
            expect(FormStoresHandler.GetStore(formId)).toBeUndefined();
        });
    });
});
