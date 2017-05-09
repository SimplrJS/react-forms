import * as React from "react";
import { mount } from "enzyme";
import * as Sinon from "sinon";

import { FormStore } from "simplr-forms/stores";

import { Form } from "../../src/components/form";
import { Text } from "../../src/components/text";
import { Clear } from "../../src/components/clear";

describe("Clear button", () => {
    let sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it("clears all fields", () => {
        const callback = sandbox.spy(FormStore.prototype, "ClearFields");

        const wrapper = mount(<Form>
            <Text name="field" />
            <Clear>Clear form</Clear>
        </Form>);

        wrapper.find("button").simulate("click");

        expect(callback.called).toBe(true);
    });

    it("clears fields by fieldsIds", () => {
        const callback = sandbox.spy(FormStore.prototype, "ClearFields");
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
            <Clear fieldIds={fieldsIds}>Clear form</Clear>
        </Form>);

        wrapper.find("button").simulate("click");

        expect(callback.called).toBe(true);
        // first click, first argument(fieldIds)
        expect(callback.args[0][0]).toBe(fieldsIds);
    });
});
