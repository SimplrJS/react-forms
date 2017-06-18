import * as React from "react";
import * as ReactDOM from "react-dom";
import { shallow, mount } from "enzyme";
import * as Sinon from "sinon";

import { FormStoresHandler, FSHContainer } from "../../src/stores/form-stores-handler";
import { FormStore } from "../../src/stores/form-store";
import { MyTestForm } from "../test-components/test-form";
import { MyTestField, MyFieldProps } from "../test-components/test-field";
import { FormChildContext } from "../../src/contracts/form";
import { FormStoreHelpers } from "../../src/stores/form-store-helpers";

describe("Field Base", () => {
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
        FSHContainer.SetFormStoresHandler(new FormStoresHandler(), true);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("is rendered outside of Form", () => {
        expect(() => shallow(
            <MyTestField name="fieldName"></MyTestField>
        )).toThrow();
    });

    it("registers when rendered inside of a form", () => {
        const FormStoresHandler = FSHContainer.FormStoresHandler;
        const formId = "FORM_ID";
        const fieldName = "fieldName";

        mount(<MyTestForm formId={formId} >
            <MyTestField name="fieldName"></MyTestField>
        </MyTestForm>);

        const formStore = FormStoresHandler.GetStore(formId);
        const fieldId = FormStoreHelpers.GetFieldId(fieldName);

        expect(formStore.HasField(fieldId)).toBe(true);
    });

    it("does not unregister itself when component is unmounted and destroyOnUnmount is false (default)", () => {
        const FormStoresHandler = FSHContainer.FormStoresHandler;
        const formId = "FORM_ID";
        const fieldName = "fieldName";

        const form = mount(<MyTestForm formId={formId}>
            <MyTestField name="fieldName"></MyTestField>
        </MyTestForm>);

        const formStore = FormStoresHandler.GetStore(formId);
        const fieldId = FormStoreHelpers.GetFieldId(fieldName);

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

        const form = mount(<MyTestForm formId={formId}>
            <MyTestField destroyOnUnmount={true} name="fieldName"></MyTestField>
        </MyTestForm>);

        const formStore = FormStoresHandler.GetStore(formId);
        const fieldId = FormStoreHelpers.GetFieldId(fieldName);

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

            mount(<MyTestForm>
                <MyTestField name={fieldName}></MyTestField>
                <MyTestField name={fieldName}></MyTestField>
            </MyTestForm>);
        }).toThrow();
    });

    it("throws when rendering an empty fieldName", () => {
        expect(() => {
            mount(<MyTestForm>
                <MyTestField name=""></MyTestField>
            </MyTestForm>);
        }).toThrow();
    });

    it("throws when rendering an undefined fieldName", () => {
        expect(() => {
            mount(<MyTestForm>
                <MyTestField name={undefined as any}></MyTestField>
            </MyTestForm>);
        }).toThrow();
    });

    it("throws when rendering a null fieldName", () => {
        expect(() => {
            mount(<MyTestForm>
                <MyTestField name={null as any}></MyTestField>
            </MyTestForm>);
        }).toThrow();
    });

    it("renders html without wrappers", () => {
        const formId = "FORM_ID";
        const form = mount(<MyTestForm formId={formId}>
            <MyTestField name="fieldName"></MyTestField>
        </MyTestForm>);

        const formDOM = ReactDOM.findDOMNode(form.instance());
        expect(formDOM.tagName).toEqual("FORM");
        expect(formDOM.children.item(0).tagName).toEqual("INPUT");
        // expect(form.type()).toEqual("<form><input type=\"text\"></form>");
    });

    it("adds event listener to form store when mounts", () => {
        const FormStoresHandler = FSHContainer.FormStoresHandler;
        const formId = "FORM_ID";
        mount(<MyTestForm formId={formId}>
            <MyTestField name="fieldName"></MyTestField>
        </MyTestForm>);

        const formStore = FormStoresHandler.GetStore(formId);

        expect(formStore.listenersCount()).toBe(1);
    });

    it("removes event listener form store when destroyOnUnmount is true and it is unmounted", () => {
        const FormStoresHandler = FSHContainer.FormStoresHandler;
        const formId = "FORM_ID";
        const form = mount(<MyTestForm formId={formId} >
            <MyTestField name="fieldName" destroyOnUnmount={true}></MyTestField>
        </MyTestForm>);

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

        sandbox.spy(FormStore.prototype, "UpdateFieldValue");

        const fieldName = "fieldName";
        const form = mount(<MyTestForm formId={formId}>
            <MyTestField name={fieldName}></MyTestField>
        </MyTestForm>);
        const formStore = FSHContainer.FormStoresHandler.GetStore(formId);

        expect((FormStore.prototype.UpdateFieldValue as any).callCount).toEqual(0);

        const input = form.find("input");

        // Initial value should be empty
        expect(input.props().value).toEqual("");

        // Simulate value change
        input.simulate("change", { target: { value: newValue } });

        expect((FormStore.prototype.UpdateFieldValue as any).callCount).toEqual(1);
        // Check if it really changed value in form store
        expect(formStore.GetField(fieldName).Value).toBe(newValue);
    });

    it("renders new value from store after input value change", () => {
        const newValue = "NEW_VALUE";
        const fieldName = "fieldName";

        const form = mount(<MyTestForm>
            <MyTestField name={fieldName}></MyTestField>
        </MyTestForm>);

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

        mount(<MyTestForm formId={formId}>
            <MyTestField {...fieldProps} />
        </MyTestForm>);
        const formStore = FSHContainer.FormStoresHandler.GetStore(formId);

        expect((formStore.GetField(fieldName).Props as MyFieldProps).value).toBe(fieldProps.value);
    });

    it("updates props when componentWillReceiveProps is called", () => {
        const formId = "FORM-ID";
        const fieldId = "field";
        const fieldProps: MyFieldProps = {
            name: "field",
            value: "initialValue"
        };
        const fieldPropsNext: MyFieldProps = {
            name: fieldProps.name,
            value: "Updated value"
        };

        // Set spies on methods
        sandbox.spy(FormStore.prototype, "UpdateFieldProps");
        sandbox.spy(MyTestField.prototype, "componentWillReceiveProps");

        // Render form to create FormStore
        shallow(<MyTestForm formId={formId}></MyTestForm>);

        const formStore = FSHContainer.FormStoresHandler.GetStore(formId);

        // Mount with formId as a context
        const field = mount<MyFieldProps>(<MyTestField {...fieldProps} />, {
            context: {
                FormId: formId
            } as FormChildContext
        });

        // Update MyTestField props
        field.setProps(fieldPropsNext);

        expect((FormStore.prototype.UpdateFieldProps as any).callCount).toEqual(1);
        expect((MyTestField.prototype.componentWillReceiveProps as any).callCount).toEqual(1);
        expect((formStore.GetField(fieldId).Props as MyFieldProps).value).toBe(fieldPropsNext.value);
    });

    it("updates props when componentWillReceiveProps is called with multi-level object", () => {
        const formId = "FORM-ID";
        const fieldId = "field";
        const fieldProps: MyFieldProps = {
            name: "field",
            value: "initialValue",
            deepObject: { value: "1" }
        };
        const fieldPropsNext: MyFieldProps = {
            name: fieldProps.name,
            value: "Updated value",
            deepObject: { value: "2" }
        };

        // Set spies on methods
        sandbox.spy(FormStore.prototype, "UpdateFieldProps");
        sandbox.spy(MyTestField.prototype, "componentWillReceiveProps");

        // Render form to create FormStore
        shallow(<MyTestForm formId={formId}></MyTestForm>);

        const formStore = FSHContainer.FormStoresHandler.GetStore(formId);

        // Mount with formId as a context
        const field = mount<MyFieldProps>(<MyTestField {...fieldProps} />, {
            context: {
                FormId: formId
            } as FormChildContext
        });

        // Update MyTestField props
        field.setProps(fieldPropsNext);

        expect((FormStore.prototype.UpdateFieldProps as any).callCount).toEqual(1);
        expect((MyTestField.prototype.componentWillReceiveProps as any).callCount).toEqual(1);
        expect((formStore.GetField(fieldId).Props as MyFieldProps).value).toBe(fieldPropsNext.value);
    });
});
