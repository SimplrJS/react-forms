import * as React from "react";
import { mount } from "enzyme";
import * as Sinon from "sinon";

import { FormStore } from "simplr-forms/stores";

import { Form } from "../../src/components/form";
import { Text } from "../../src/components/text";
import { Reset } from "../../src/components/reset";

describe("Reset button", () => {
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it("reset all fields", () => {
        const callback = sandbox.spy(FormStore.prototype, "ResetFields");

        const wrapper = mount(<Form>
            <Text name="field" />
            <Reset>Clear form</Reset>
        </Form>);

        wrapper.find("button").simulate("click");

        expect(callback.called).toBe(true);
    });

    it("reset fields by fieldsIds", () => {
        const callback = sandbox.spy(FormStore.prototype, "ResetFields");
        let fieldsIds: string[] = [];
        for (let i = 0; i < 5; i++) {
            fieldsIds.push(`text-${i}`);
        }
        let fields: JSX.Element[] = [];
        fieldsIds.forEach(value => {
            fields.push(<Text name={value} key={value} />);
        });

        const wrapper = mount(<Form>
            {fields}
            <Reset fieldIds={fieldsIds}>Clear form</Reset>
        </Form>);

        wrapper.find("button").simulate("click");

        expect(callback.called).toBe(true);
        // first click, first argument(fieldIds)
        expect(callback.args[0][0]).toBe(fieldsIds);
    });
});
