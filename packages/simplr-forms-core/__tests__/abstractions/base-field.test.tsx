import * as React from "react";
import { shallow, mount } from "enzyme";

import { BaseForm } from "../../src/abstractions/base-form";
import { FormProps } from "../../src/contracts/form";
import { BaseField, BaseFieldState } from "../../src/abstractions/base-field";
import { FieldProps, FieldValue } from "../../src/contracts/field";
import { FormStoresHandlerClass, FSHContainer } from "../../src/stores/form-stores-handler";

interface MyFormProps extends FormProps {
    renderChildren?: boolean;
}

interface MyFormState { }

class MyForm extends BaseForm<MyFormProps, MyFormState> {
    static defaultProps: MyFormProps = {
        ...BaseForm.defaultProps,
        renderChildren: true
    };

    render(): JSX.Element {
        return <form>
            {this.props.renderChildren ? this.props.children : null}
        </form>;
    }
}


interface MyFieldProps extends FieldProps {

}

interface MyFieldState extends BaseFieldState { }

class MyField extends BaseField<MyFieldProps, MyFieldState> {
    render() {
        return <input type="text" onChange={this.onChange} value={this.state.Value} />;
    }

    onChange: React.FormEventHandler<HTMLInputElement> = (event) => {
        const target = event.target as EventTarget & HTMLInputElement;
        this.OnValueChange(target.value);
    }

    protected get RawInitialValue(): FieldValue {
        return "";
    }

    protected get DefaultValue(): FieldValue {
        return "";
    }
}

describe("Field Base", () => {
    beforeEach(() => {
        FSHContainer.SetFormStoresHandler(new FormStoresHandlerClass(), true);
    });

    it("works", () => {
        expect(true).toBe(true);
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

        mount(<MyForm formId={formId} >
            <MyField name="fieldName"></MyField>
        </MyForm>);

        const formStore = FormStoresHandler.GetStore(formId);
        const fieldId = formStore.GetFieldId(fieldName);

        expect(formStore.HasField(fieldId)).toBe(true);
    });

    it("does not unregister itself when component is unmounted and destroyOnUnmount is false (default)", () => {
        const FormStoresHandler = FSHContainer.FormStoresHandler;
        const formId = "FORM_ID";
        const fieldName = "fieldName";

        let form = mount(<MyForm formId={formId}>
            <MyField name="fieldName"></MyField>
        </MyForm>);

        let formStore = FormStoresHandler.GetStore(formId);
        const fieldId = formStore.GetFieldId(fieldName);

        expect(formStore.HasField(fieldId)).toBe(true);

        form.setProps({
            ...form.props(),
            renderChildren: false
        });

        expect(formStore.HasField(fieldId)).toBe(true);
    });

    it("unregisters when component is unmounted and destroyOnUnmount is true", () => {
        const FormStoresHandler = FSHContainer.FormStoresHandler;
        const formId = "FORM_ID";
        const fieldName = "fieldName";

        let form = mount(<MyForm formId={formId}>
            <MyField destroyOnUnmount={true} name="fieldName"></MyField>
        </MyForm>);

        let formStore = FormStoresHandler.GetStore(formId);
        const fieldId = formStore.GetFieldId(fieldName);

        expect(formStore.HasField(fieldId)).toBe(true);

        form.setProps({
            ...form.props(),
            renderChildren: false
        });

        expect(formStore.HasField(fieldId)).toBe(false);
    });

    it("throws when rendering duplicate fieldName", () => {
        expect(() => {
            const fieldName = "fieldName";

            mount(<MyForm>
                <MyField name={fieldName}></MyField>
                <MyField name={fieldName}></MyField>
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
                <MyField name={undefined as any}></MyField>
            </MyForm>);
        }).toThrow();
    });

    it("throws when rendering a null fieldName", () => {
        expect(() => {
            mount(<MyForm>
                <MyField name={null as any}></MyField>
            </MyForm>);
        }).toThrow();
    });

    it("renders html without wrappers", () => {
        const formId = "FORM_ID";
        let form = mount(<MyForm formId={formId}>
            <MyField name="fieldName"></MyField>
        </MyForm>);
        expect(form.html()).toEqual("<form><input type=\"text\"></form>");
    });

    it("adds event listener to form store when mounts", () => {
        const FormStoresHandler = FSHContainer.FormStoresHandler;
        const formId = "FORM_ID";
        mount(<MyForm formId={formId}>
            <MyField name="fieldName"></MyField>
        </MyForm>);

        const formStore = FormStoresHandler.GetStore(formId);

        expect(formStore.listenersCount()).toBe(1);
    });

    it("removes event listener form store when destroyOnUnmount is true and it is unmounted", () => {
        const FormStoresHandler = FSHContainer.FormStoresHandler;
        const formId = "FORM_ID";
        const form = mount(<MyForm formId={formId} >
            <MyField name="fieldName" destroyOnUnmount={true}></MyField>
        </MyForm>);

        const formStore = FormStoresHandler.GetStore(formId);
        expect(formStore.listenersCount()).toBe(1);

        form.setProps({
            ...form.props(),
            renderChildren: false
        });

        expect(formStore.listenersCount()).toBe(0);
    });

    fit("informs store on value change", () => {
        const fieldName = "fieldName";
        const form = mount(<MyForm>
            <MyField name={fieldName}></MyField>
        </MyForm>);

        const newValue = "NEW_VALUE";

        const input = form.find("input");

        // Initial value should be empty
        expect(input.props().value).toEqual("");

        // Simulate value change
        input.simulate("change", { target: { value: newValue } });

        // Value should be updated
        expect(input.props().value).toEqual(newValue);
    });
});
