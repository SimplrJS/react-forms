import * as React from "react";
import { mount } from "enzyme";

import { FSHContainer, FormStoresHandler } from "simplr-forms/stores";
import { Form } from "../../src/components/form";
import { Text } from "../../src/components/text";

describe("Text", () => {
    beforeEach(() => {
        FSHContainer.SetFormStoresHandler(new FormStoresHandler(), true);
    });

    it("change value", () => {
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
});
