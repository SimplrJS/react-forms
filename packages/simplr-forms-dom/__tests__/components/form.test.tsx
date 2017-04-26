import * as React from "react";
import { mount } from "enzyme";
import * as sinon from "sinon";

import { FormStore, FSHContainer, FormStoresHandler } from "simplr-forms-core/stores";

import { Form } from "../../src/components/form";
import { Text } from "../../src/components/text";
import { FormOnSubmitCallback } from "../../src/contracts/form";

describe("Form", () => {
    beforeEach(() => {
        FSHContainer.SetFormStoresHandler(new FormStoresHandler(), true);
    });

    it("calls submit callback when submit button is clicked", () => {
        const submitCallback = sinon.stub();

        const wrapper = mount(<Form onSubmit={submitCallback}>
            <button type="submit">Submit</button>
        </Form>);

        wrapper.find("button").simulate("submit");

        expect(submitCallback.called).toBe(true);
    });

    it("calls submit callback when submit called from FormStore", () => {
        const formId = "form-id";
        const submitCallback = sinon.stub();

        const wrapper = mount(<Form formId={formId} onSubmit={submitCallback}></Form>);

        const formStore = FSHContainer.FormStoresHandler.GetStore(formId);
        formStore.InitiateSubmit();

        expect(submitCallback.called).toBe(true);
    });
});
