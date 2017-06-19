import * as React from "react";
import { shallow, mount } from "enzyme";
import * as Sinon from "sinon";

import { TestFieldsGroup } from "../test-components/test-fields-group";
import { FSHContainer, FormStoresHandler } from "../../src/stores/form-stores-handler";
import { MyTestForm } from "../test-components/test-form";

describe("Fields Group Base", () => {
    let sandbox: Sinon.SinonSandbox;
    const formId = "FORM_ID";

    beforeEach(() => {
        sandbox = Sinon.sandbox.create();
        FSHContainer.SetFormStoresHandler(new FormStoresHandler(), true);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("is rendered outside of Form", () => {
        expect(() => shallow(
            <TestFieldsGroup name="name"></TestFieldsGroup>
        )).toThrow();
    });

    it("registers when rendered inside of a form", () => {
        const FormStoresHandler = FSHContainer.FormStoresHandler;
        const fieldsGroupName = "group name";

        mount(<MyTestForm formId={formId} >
            <TestFieldsGroup name={fieldsGroupName}></TestFieldsGroup>
        </MyTestForm>);

        const formStore = FormStoresHandler.GetStore(formId);

        expect(formStore.GetState().FieldsGroups.has(fieldsGroupName)).toBe(true);
    });

    it("throws when registering an already existing id", () => {
        const fieldsGroupName = "group name";

        expect(() => mount(
            <MyTestForm formId={formId} >
                <TestFieldsGroup name={fieldsGroupName}></TestFieldsGroup>
                <TestFieldsGroup name={fieldsGroupName}></TestFieldsGroup>
            </MyTestForm>
        )).toThrow();
    });
});
