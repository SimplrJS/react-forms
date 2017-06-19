import * as React from "react";
import { mount } from "enzyme";
import * as Sinon from "sinon";

import { FSHContainer, FormStoresHandler } from "@simplr/react-forms/stores";
import { Form } from "../../src/components/form";
import { Text } from "../../src/components/text";

describe("Text field", () => {
    let sandbox: Sinon.SinonSandbox;
    beforeEach(() => {
        FSHContainer.SetFormStoresHandler(new FormStoresHandler(), true);
        sandbox = Sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("change value from input", () => {
        const formId = "formId";
        const fieldName = "field name";
        const nextValue = "next value";
        const wrapper = mount(<Form formId={formId}>
            <Text name={fieldName} />
        </Form>);

        const formStore = FSHContainer.FormStoresHandler.GetStore(formId);

        wrapper.find("input").simulate("change", { target: { value: nextValue } });

        expect(wrapper.find("input").props().value).toBe(nextValue);
        expect(formStore.GetField(fieldName).Value).toBe(nextValue);
    });

    it("change value triggers onChange callback", () => {
        const fieldName = "field name";
        const nextValue = "next value";
        const callback = Sinon.stub();
        const wrapper = mount(<Form>
            <Text name={fieldName} onChange={callback} />
        </Form>);

        wrapper.find("input").simulate("change", { target: { value: nextValue } });

        expect(callback.called).toBe(true);
    });

    it("render is defined", () => {
        const wrapper = mount(<Form>
            <Text name="field" />
        </Form>);

        expect(wrapper.find(Text).getDOMNode()).toBeDefined();
    });
});
