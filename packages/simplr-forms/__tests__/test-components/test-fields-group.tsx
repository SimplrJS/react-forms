import * as React from "react";
import { BaseFieldsGroup } from "../../src/abstractions/base-fields-group";
import { FieldsGroupProps, FieldsGroupState } from "../../src/contracts/fields-group";

export interface TestFieldsGroupProps extends FieldsGroupProps {

}

export class TestFieldsGroup extends BaseFieldsGroup<TestFieldsGroupProps, FieldsGroupState> {
    render() {
        return <div>{this.props.children}</div>;
    }
}
