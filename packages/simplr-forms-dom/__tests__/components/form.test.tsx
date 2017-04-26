import * as React from "react";
import { mount } from "enzyme";
import * as sinon from "sinon";

import { FormStore } from "simplr-forms-core/stores";

import { Form } from "../../src/components/form";
import { Text } from "../../src/components/text";
import { FormOnSubmitCallback } from "../../src/contracts/form";

describe("Form", () => {
    it("calls submit callback", () => {
        const submitCallback = sinon.stub();

        const wrapper = mount(<Form onSubmit={submitCallback}>
            <Text name="username" />
            <button type="submit">Submit</button>
        </Form>);

        wrapper.find("button").simulate("submit");

        expect(submitCallback.called).toBe(true);
    });
});
