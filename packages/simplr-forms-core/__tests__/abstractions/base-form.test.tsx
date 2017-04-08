import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";

import { BaseForm } from "../../src/abstractions/base-form";

interface MyProps {

}

interface MyState {

}

class MyForm extends BaseForm<MyProps, MyState> {
    render(): JSX.Element {
        return <form>
            {this.props.children}
        </form>;
    }
}

it("should render form element", function () {
    let form = TestUtils.renderIntoDocument(<MyForm></MyForm>) as MyForm;

    let formNode = ReactDOM.findDOMNode(form);
    expect(formNode.tagName).toEqual("FORM");
});