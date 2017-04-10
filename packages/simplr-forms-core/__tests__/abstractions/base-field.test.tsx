import * as React from "react";
import * as ReactDOM from "react-dom";
import { shallow, mount, render } from "enzyme";
import "react-dom/test-utils";

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
        expect(() => shallow(
            <MyField name="fieldName"></MyField>
        )).toThrow();
    });
    it("registers when rendered inside of a form", () => {
        const FormStoresHandler = FSHContainer.FormStoresHandler;
        const formId = "FORM_ID";
        const fieldName = "fieldName";

        let form = mount(<MyForm formId={formId}>
            <MyField name="fieldName"></MyField>
        </MyForm>);

        const formStore = FormStoresHandler.GetStore(formId);
        const fieldId = formStore.GetFieldId(fieldName);

        expect(formStore.HasField(fieldId)).toBe(true);
    });
    it("unregisters when componentWillUnmount is called", () => {
        const FormStoresHandler = FSHContainer.FormStoresHandler;
        const formId = "FORM_ID";
        const fieldName = "fieldName";

        let form = mount(<MyForm formId={formId}>
            <MyField name="fieldName"></MyField>
        </MyForm>);

        const formStore = FormStoresHandler.GetStore(formId);
        const fieldId = formStore.GetFieldId(fieldName);

        form.unmount();

        // const field = React.Children.only(.props.children);
        // console.log(field.componentWillUnmount);

        expect(formStore.HasField(fieldId)).toBe(false);
    });
    it("throws when rendering duplicate fieldName", () => {
        expect(() => {
            const fieldName = "fieldName";

            mount(<MyForm>
                <MyField name="fieldName"></MyField>
                <MyField name="fieldName"></MyField>
            </MyForm>);
        }).toThrow();
    });
    it("throws when rendering an empty fieldName", () => {
        expect(() => {
            mount(<MyForm>
                <MyField name=""></MyField>
            </MyForm>);
        }).toThrow();
    });
    it("throws when rendering an undefined fieldName", () => {
        expect(() => {
            mount(<MyForm>
                <MyField name={undefined}></MyField>
            </MyForm>);
        }).toThrow();
    });
    it("throws when rendering a null fieldName", () => {
        expect(() => {
            mount(<MyForm>
                <MyField name={null}></MyField>
            </MyForm>);
        }).toThrow();
    });
    it("renders html without wrappers", () => {
        const FormStoresHandler = FSHContainer.FormStoresHandler;
        const formId = "FORM_ID";
        let form = mount(<MyForm formId={formId}>
            <MyField name="fieldName"></MyField>
        </MyForm>);
        expect(form.html()).toEqual("<form><input type=\"text\"></form>");
    });
});
