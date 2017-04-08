import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";

import { BaseForm, FormProps } from "../../src/abstractions/base-form";
import { FormStoresHandler, FormStoresHandlerClass } from "../../src/stores/form-stores-handler";

interface MyProps extends FormProps { }

interface MyState { }

class MyForm extends BaseForm<MyProps, MyState> {
    public GetFormIdForTest() {
        return this.FormId;
    }

    render(): JSX.Element {
        return <form>
            {this.props.children}
        </form>;
    }
}

describe("Base form registering", () => {
    it("formId is undefined and destroyOnUnmount prop is false", () => {
        expect(() => TestUtils.renderIntoDocument(
            <MyForm destroyOnUnmount={false}></MyForm>
        )).toThrow();
    });

    it("formId is undefiend and destroyOnUnmount prop is true", () => {
        let form = TestUtils.renderIntoDocument(<MyForm></MyForm>) as MyForm;
        let formNode = ReactDOM.findDOMNode(form);
        let formId = form.GetFormIdForTest();

        expect(FormStoresHandler.Exists(formId)).toBe(true);

        form.componentWillUnmount();

        expect(FormStoresHandler.Exists(formId)).toBe(false);
    });

    it("formId is present and destroyOnUnmount is false", () => {
        const FORM_ID = "custom-form-id";

        // Mount first form and check if it's registered .
        let form = TestUtils.renderIntoDocument(
            <MyForm destroyOnUnmount={false} formId={FORM_ID}></MyForm>
        ) as MyForm;
        expect(FormStoresHandler.Exists(FORM_ID)).toBe(true);

        // Unmount first form and it should be still present in FormStoresHandler.
        expect(FormStoresHandler.Exists(FORM_ID)).toBe(true);
        form.componentWillUnmount();

        // Mount second form and check if it's registered.
        let form2 = TestUtils.renderIntoDocument(
            <MyForm destroyOnUnmount={false} formId={FORM_ID}></MyForm>
        ) as MyForm;
        expect(FormStoresHandler.Exists(FORM_ID)).toBe(true);

        // Unmount form and check if it's still registered.
        form2.componentWillUnmount();
        expect(FormStoresHandler.Exists(FORM_ID)).toBe(true);

        // Unregister manually from FormStoresHandler.
        FormStoresHandler.UnregisterForm(FORM_ID);
    });

    it("formId is present and destroyOnUnmount is true", () => {
        const FORM_ID = "custom-form-id";
        let form = TestUtils.renderIntoDocument(
            <MyForm destroyOnUnmount={true} formId={FORM_ID}></MyForm>
        ) as MyForm;

        expect(FormStoresHandler.Exists(FORM_ID)).toBe(true);
        form.componentWillUnmount();
        expect(FormStoresHandler.Exists(FORM_ID)).toBe(false);
    });
});
