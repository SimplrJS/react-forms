import * as React from "react";
import { mount } from "enzyme";
import * as Sinon from "sinon";

import { FSHContainer, FormStoresHandler } from "simplr-forms/stores";

import { Form } from "../../src/components/form";

describe("Form", () => {
    beforeEach(() => {
        FSHContainer.SetFormStoresHandler(new FormStoresHandler(), true);
    });

    it("calls submit callback when submit button is clicked", () => {
        const submitCallback = Sinon.stub();

        const wrapper = mount(<Form onSubmit={submitCallback}>
            <button type="submit">Submit</button>
        </Form>);

        wrapper.find("button").simulate("submit");

        expect(submitCallback.called).toBe(true);
    });

    it("calls submit callback when submit called from FormStore", () => {
        const formId = "form-id";
        const submitCallback = Sinon.stub();

        mount(<Form formId={formId} onSubmit={submitCallback}></Form>);

        const formStore = FSHContainer.FormStoresHandler.GetStore(formId);
        formStore.InitiateFormSubmit();

        expect(submitCallback.called).toBe(true);
    });
});
