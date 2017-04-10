import * as React from "react";
import * as ReactDOM from "react-dom";
import { shallow, mount, render } from "enzyme";

import { BaseForm } from "../../src/abstractions/base-form";
import { FormProps } from "../../src/contracts/form";
import { BaseField } from "../../src/abstractions/base-field";
import { FieldProps, FieldValueType } from "../../src/contracts/field";
import { FormStoresHandlerClass, FSHContainer } from "../../src/stores/form-stores-handler";

interface MyProps extends FormProps { }

interface MyState { }

class MyForm extends BaseForm<MyProps, MyState> {
    render(): JSX.Element {
        return <form>
            {this.props.children}
        </form>;
    }
}

describe("sth", () => {
    fit("should work", () => {
        const m = mount(<MyForm>

        </MyForm>);

        expect(true).toBe(true);
    });
});
