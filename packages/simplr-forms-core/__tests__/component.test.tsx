import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";

import { TestComponent } from "../src/component";

it("Check component container innnerHtml text", function () {
    let component = TestUtils.renderIntoDocument(<TestComponent />) as React.Component<{}, {}>;

    let componentNode = ReactDOM.findDOMNode(component);
    expect(componentNode.innerHTML).toEqual("My name is slim shady");
});
