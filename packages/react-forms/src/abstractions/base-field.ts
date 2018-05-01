import {
    FieldValue,
    FieldProps
} from "../contracts/field";
import { CoreField, CoreFieldState } from "./core-field";

export type BaseFieldState = CoreFieldState;

export abstract class BaseField<TProps extends FieldProps, TState extends BaseFieldState> extends CoreField<TProps, TState> {
    public componentWillReceiveProps(nextProps: TProps): void {
        super.componentWillReceiveProps(nextProps);

        if (this.IsControlled) {
            const newValue = this.ProcessValueBeforeStore(nextProps.value);
            this.FormStore.UpdateFieldValue(this.FieldId, newValue);
        }
    }

    protected abstract GetRawDefaultValue(props: TProps): FieldValue;

    protected GetRawInitialValue(props: TProps): FieldValue {
        return props.initialValue;
    }

    protected GetRawValue(props: TProps): FieldValue {
        return props.value;
    }

    protected get IsControlled(): boolean {
        return this.props.value !== undefined;
    }

    protected get ControlledValue(): FieldValue {
        return this.props.value;
    }

    protected get Value(): FieldValue {
        if (this.IsControlled) {
            return this.ControlledValue;
        }

        // If state is defined
        if (this.state != null && this.state.Value != null) {
            // Return its value
            return this.state.Value;
        }

        // Return default value
        return this.GetRawDefaultValue(this.props);
    }

    protected get Disabled(): boolean | undefined {
        // FormStore can only enforce disabling
        if (this.FormStore.GetState().Disabled === true) {
            return true;
        }

        if (this.props.disabled != null) {
            return this.props.disabled;
        }
    }
}
