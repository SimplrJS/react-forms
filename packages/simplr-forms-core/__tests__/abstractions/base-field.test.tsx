import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";

import { BaseForm } from "../../src/abstractions/base-form";
import { FormProps } from "../../src/contracts/form";
import { BaseField } from "../../src/abstractions/base-field";
import { FieldProps, FieldValueType } from "../../src/contracts/field";
import { FormStoresHandlerClass, FSHContainer } from "../../src/stores/form-stores-handler";

interface MyProps extends FormProps { }

interface MyState { }

class MyForm extends BaseForm<MyProps, MyState> {
    render(): JSX.Element {
        return <form>
            {this.props.children}
        </form>;
    }
}


interface MyFieldProps extends FieldProps {

}

interface MyFieldState { }

class MyField extends BaseField<MyFieldProps, MyFieldState> {
    render() {
        return <input type="text" />;
    }

    protected get RawInitialValue(): FieldValueType {
        return "";
    }

    protected get DefaultValue(): FieldValueType {
        return "";
    }
}



describe("Field Base", () => {
    beforeEach(() => {
        FSHContainer.SetFormStoresHandler(new FormStoresHandlerClass(), true);
    });

    it("is rendered outside of Form", () => {
        expect(() => TestUtils.renderIntoDocument(
            <MyField name="fieldName"></MyField>
        )).toThrow();
    });
    it("registers when rendered inside of form", () => {
        const FormStoresHandler = FSHContainer.FormStoresHandler;
        const formId = "FORM_ID";
        const fieldName = "fieldName";

        let form = TestUtils.renderIntoDocument(<MyForm formId={formId}>
            <MyField name="fieldName"></MyField>
        </MyForm>) as MyForm;
        let formNode = ReactDOM.findDOMNode(form);

        const formStore = FormStoresHandler.GetStore(formId);
        const fieldId = formStore.GetFieldId(fieldName);

        expect(formStore.HasField(fieldId)).toBe(true);


        form.componentWillUnmount();

        expect(FormStoresHandler.Exists(formId)).toBe(false);
    });
    it("renders html without wrappers", () => {
        const FormStoresHandler = FSHContainer.FormStoresHandler;
        const formId = "FORM_ID";
        let form = TestUtils.renderIntoDocument(<MyForm formId={formId}>
            <MyField name="fieldName"></MyField>
        </MyForm>) as MyForm;
        const formNode = ReactDOM.findDOMNode(form);
        expect(formNode.innerHTML).toEqual("<input type=\"text\">");
    });
});
