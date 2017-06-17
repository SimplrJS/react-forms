import * as React from "react";

import { BaseField, BaseFieldState } from "../../src/abstractions/base-field";
import { FieldProps, FieldValue } from "../../src/contracts/field";

export interface MyFieldProps extends FieldProps {
    defaultValue?: string;
    initialValue?: string;
    value?: string;
    randomKey?: string;
    deepObject?: any;
}

export class MyTestField extends BaseField<MyFieldProps, BaseFieldState> {
    public render(): JSX.Element {
        return <input type="text" onChange={this.onChange} value={this.state.Value} />;
    }

    private onChange: React.FormEventHandler<HTMLInputElement> = event => {
        const target = event.target as EventTarget & HTMLInputElement;
        this.OnValueChange(target.value);
    }

    protected get RawInitialValue(): FieldValue {
        return "";
    }

    protected get RawValue(): FieldValue {
        return "";
    }

    protected get RawDefaultValue(): FieldValue {
        if (this.props.defaultValue != null) {
            return this.props.defaultValue;
        }
        return "";
    }
}
