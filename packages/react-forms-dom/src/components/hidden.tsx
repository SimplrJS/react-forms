import * as React from "react";
import { BaseField, BaseFieldState } from "@simplr/react-forms";
import { FieldProps, FieldValue } from "@simplr/react-forms/contracts";

export interface HiddenProps extends FieldProps {
    defaultValue: FieldValue;
    value: FieldValue;
}

export class Hidden extends BaseField<HiddenProps, BaseFieldState> {
    protected get IsControlled(): boolean {
        return true;
    }

    protected get RawDefaultValue(): FieldValue {
        return this.props.defaultValue;
    }

    public render(): null {
        return null;
    }
}
