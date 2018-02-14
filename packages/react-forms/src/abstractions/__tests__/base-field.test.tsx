import * as React from "react";
import { shallow } from "enzyme";

import { BaseField } from "../base-field";

export class TextField extends BaseField {
    public render(): JSX.Element {
        return <div />;
    }
}

it("Simple test.", () => {
    const render = shallow(<TextField />);

    expect(render.html()).toMatchSnapshot();
});
