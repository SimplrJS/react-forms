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

    protected GetRawDefaultValue(props: HiddenProps): FieldValue {
        return props.defaultValue;
    }

    public render(): null {
        return null;
    }
}
