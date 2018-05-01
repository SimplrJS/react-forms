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

    protected GetRawInitialValue(props: MyFieldProps): FieldValue {
        return "";
    }

    protected GetRawValue(props: MyFieldProps): FieldValue {
        return "";
    }

    protected GetRawDefaultValue(props: MyFieldProps): FieldValue {
        if (props.defaultValue != null) {
            return props.defaultValue;
        }
        return "";
    }
}
