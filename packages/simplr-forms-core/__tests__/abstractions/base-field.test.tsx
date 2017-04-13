import * as React from "react";
import * as ReactDOM from "react-dom";
import { shallow, mount } from "enzyme";
import { spy } from "sinon";

import { FormStoresHandlerClass, FSHContainer } from "../../src/stores/form-stores-handler";
import { FormStore } from "../../src/stores/form-store";
import { BasicForm } from "../basic-components/basic-form";
import { BasicField } from "../basic-components/basic-field";
import { FormChildContext } from "../../src/contracts/form";
import { MyFieldProps } from "../basic-components/basic-field";

describe("Field Base", () => {
    beforeEach(() => {
        FSHContainer.SetFormStoresHandler(new FormStoresHandlerClass(), true);
    });

    it("works", () => {
        expect(true).toBe(true);
    });

    it("is rendered outside of Form", () => {
        expect(() => shallow(
            <BasicField name="fieldName"></BasicField>
        )).toThrow();
    });

    it("registers when rendered inside of a form", () => {
        const FormStoresHandler = FSHContainer.FormStoresHandler;
        const formId = "FORM_ID";
        const fieldName = "fieldName";

        mount(<BasicForm formId={formId} >
            <BasicField name="fieldName"></BasicField>
        </BasicForm>);

        const formStore = FormStoresHandler.GetStore(formId);
        const fieldId = formStore.GetFieldId(fieldName);

        expect(formStore.HasField(fieldId)).toBe(true);
    });

    it("does not unregister itself when component is unmounted and destroyOnUnmount is false (default)", () => {
        const FormStoresHandler = FSHContainer.FormStoresHandler;
        const formId = "FORM_ID";
        const fieldName = "fieldName";

        let form = mount(<BasicForm formId={formId}>
            <BasicField name="fieldName"></BasicField>
        </BasicForm>);

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

        let form = mount(<BasicForm formId={formId}>
            <BasicField destroyOnUnmount={true} name="fieldName"></BasicField>
        </BasicForm>);

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

            mount(<BasicForm>
                <BasicField name={fieldName}></BasicField>
                <BasicField name={fieldName}></BasicField>
            </BasicForm>);
        }).toThrow();
    });

    it("throws when rendering an empty fieldName", () => {
        expect(() => {
            mount(<BasicForm>
                <BasicField name=""></BasicField>
            </BasicForm>);
        }).toThrow();
    });

    it("throws when rendering an undefined fieldName", () => {
        expect(() => {
            mount(<BasicForm>
                <BasicField name={undefined as any}></BasicField>
            </BasicForm>);
        }).toThrow();
    });

    it("throws when rendering a null fieldName", () => {
        expect(() => {
            mount(<BasicForm>
                <BasicField name={null as any}></BasicField>
            </BasicForm>);
        }).toThrow();
    });

    it("renders html without wrappers", () => {
        const formId = "FORM_ID";
        let form = mount(<BasicForm formId={formId}>
            <BasicField name="fieldName"></BasicField>
        </BasicForm>);

        const formDOM = ReactDOM.findDOMNode(form.instance());
        expect(formDOM.tagName).toEqual("FORM");
        expect(formDOM.children.item(0).tagName).toEqual("INPUT");
        // expect(form.type()).toEqual("<form><input type=\"text\"></form>");
    });

    it("adds event listener to form store when mounts", () => {
        const FormStoresHandler = FSHContainer.FormStoresHandler;
        const formId = "FORM_ID";
        mount(<BasicForm formId={formId}>
            <BasicField name="fieldName"></BasicField>
        </BasicForm>);

        const formStore = FormStoresHandler.GetStore(formId);

        expect(formStore.listenersCount()).toBe(1);
    });

    it("removes event listener form store when destroyOnUnmount is true and it is unmounted", () => {
        const FormStoresHandler = FSHContainer.FormStoresHandler;
        const formId = "FORM_ID";
        const form = mount(<BasicForm formId={formId} >
            <BasicField name="fieldName" destroyOnUnmount={true}></BasicField>
        </BasicForm>);

        const formStore = FormStoresHandler.GetStore(formId);
        expect(formStore.listenersCount()).toBe(1);

        form.setProps({
            ...form.props(),
            renderChildren: false
        });

        expect(formStore.listenersCount()).toBe(0);
    });

    it("informs store on value change", () => {
        const newValue = "NEW_VALUE";
        const formId = "FORM_ID";

        spy(FormStore.prototype, "ValueChanged");

        const fieldName = "fieldName";
        const form = mount(<BasicForm formId={formId}>
            <BasicField name={fieldName}></BasicField>
        </BasicForm>);
        const formStore = FSHContainer.FormStoresHandler.GetStore(formId);

        expect((FormStore.prototype.ValueChanged as any).callCount).toEqual(0);

        const input = form.find("input");

        // Initial value should be empty
        expect(input.props().value).toEqual("");

        // Simulate value change
        input.simulate("change", { target: { value: newValue } });

        expect((FormStore.prototype.ValueChanged as any).callCount).toEqual(1);
        // Check if it really changed value in form store
        expect(formStore.GetField(fieldName).Value).toBe(newValue);
    });

    it("renders new value from store after input value change", () => {
        const newValue = "NEW_VALUE";
        const fieldName = "fieldName";

        const form = mount(<BasicForm>
            <BasicField name={fieldName}></BasicField>
        </BasicForm>);

        const input = form.find("input");

        // Initial value should be empty
        expect(input.props().value).toEqual("");

        // Simulate value change
        input.simulate("change", { target: { value: newValue } });

        // Value should be updated
        expect(input.props().value).toEqual(newValue);
    });

    it("registers and passes props", () => {
        const fieldName = "fieldName";
        const formId = "form-id";
        const fieldProps: MyFieldProps = {
            name: fieldName,
            value: "initialValue"
        };

        mount(<BasicForm formId={formId}>
            <BasicField {...fieldProps} />
        </BasicForm>);
        const formStore = FSHContainer.FormStoresHandler.GetStore(formId);

        expect((formStore.GetField(fieldName).Props as MyFieldProps).value).toBe(fieldProps.value);
    });

    it("updates props when componentWillReceiveProps is called", () => {
        const fieldName = "fieldName";
        const formId = "form-id";
        const fieldProps: MyFieldProps = {
            name: fieldName,
            value: "initialValue"
        };
        const fieldPropsNext: MyFieldProps = {
            name: fieldName,
            value: "Updated value"
        };

        // Set spies on methods
        spy(FormStore.prototype, "UpdateProps");
        spy(BasicField.prototype, "componentWillReceiveProps");

        // Render form to create FormStore
        shallow(<BasicForm formId={formId}></BasicForm>);

        const formStore = FSHContainer.FormStoresHandler.GetStore(formId);

        // Mount with formId as a context
        const field = mount<MyFieldProps>(<BasicField {...fieldProps} />, {
            context: {
                FormId: formId
            } as FormChildContext
        });

        // Update BasicField props
        field.setProps(fieldPropsNext);

        expect((FormStore.prototype.UpdateProps as any).callCount).toEqual(1);
        expect((BasicField.prototype.componentWillReceiveProps as any).callCount).toEqual(1);
        expect((formStore.GetField(fieldName).Props as MyFieldProps).value).toBe(fieldPropsNext.value);
    });
});
