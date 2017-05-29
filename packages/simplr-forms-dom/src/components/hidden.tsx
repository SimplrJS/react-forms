import * as React from "react";
import { BaseField, BaseFieldState } from "simplr-forms";
import { FieldProps } from "simplr-forms/contracts";

export interface HiddenProps extends FieldProps {
    defaultValue: any;
    value: any;
}

export class Hidden extends BaseField<HiddenProps, BaseFieldState> {
    protected get IsControlled(): boolean {
        return true;
    }

    protected get RawDefaultValue() {
        return this.props.defaultValue;
    }

    render() {
        return null;
    }
}
