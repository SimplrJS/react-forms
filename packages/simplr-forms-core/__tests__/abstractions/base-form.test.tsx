import * as React from "react";
import * as ReactDOM from "react-dom";
import { shallow, mount, render } from "enzyme";

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

    it("formId is undefined and destroyOnUnmount prop is false, it should throw", () => {
        expect(() => mount(
            <MyForm destroyOnUnmount={false}></MyForm>
        )).toThrow();
    });

    it("formId is undefined and destroyOnUnmount prop is true", () => {
        const FormStoresHandler = FSHContainer.FormStoresHandler;
        let form = mount(<MyForm></MyForm>);
        let formId = (form.instance() as any).FormId;

        expect(FormStoresHandler.Exists(formId)).toBe(true);

        form.unmount();

        expect(FormStoresHandler.Exists(formId)).toBe(false);
        expect(FormStoresHandler.GetStore(formId)).toBeUndefined();
    });

    it("formId is present and destroyOnUnmount is false", () => {
        const FormStoresHandler = FSHContainer.FormStoresHandler;
        const FORM_ID = "custom-form-id";

        // Mount first form and check if it's registered .
        let form = mount(
            <MyForm destroyOnUnmount={false} formId={FORM_ID}></MyForm>
        );
        expect(FormStoresHandler.Exists(FORM_ID)).toBe(true);

        // Unmount first form and it should be still present in FormStoresHandler.
        expect(FormStoresHandler.Exists(FORM_ID)).toBe(true);
        form.unmount();

        // Mount second form and check if it's registered.
        let form2 = mount(
            <MyForm destroyOnUnmount={false} formId={FORM_ID}></MyForm>
        );
        expect(FormStoresHandler.Exists(FORM_ID)).toBe(true);

        // Unmount form and check if it's still registered.
        form2.unmount();
        expect(FormStoresHandler.Exists(FORM_ID)).toBe(true);
    });

    it("formId is present and destroyOnUnmount is true", () => {
        const FormStoresHandler = FSHContainer.FormStoresHandler;
        const FORM_ID = "custom-form-id";
        let form = mount(
            <MyForm destroyOnUnmount={true} formId={FORM_ID}></MyForm>
        );

        expect(FormStoresHandler.Exists(FORM_ID)).toBe(true);
        form.unmount();
        expect(FormStoresHandler.Exists(FORM_ID)).toBe(false);
    });
});
