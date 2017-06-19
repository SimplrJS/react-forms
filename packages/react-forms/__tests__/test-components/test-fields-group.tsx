import * as React from "react";
import { BaseFieldsGroup } from "../../src/abstractions/base-fields-group";
import { FieldsGroupProps, FieldsGroupState } from "../../src/contracts/fields-group";

export class TestFieldsGroup extends BaseFieldsGroup<FieldsGroupProps, FieldsGroupState> {
    public render(): JSX.Element {
        return <div>{this.props.children}</div>;
    }
}
