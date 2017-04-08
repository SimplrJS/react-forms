import * as React from "react";
import * as FieldContracts from "../contracts/field";
import * as FormContracts from "../contracts/form";

export interface BaseFieldState {
    Field?: FieldContracts.FieldStoreState<FieldContracts.ValueType>;
    Form?: FormContracts.FormStoreState;
    RenderValue?: FieldContracts.ValueType;
}

export interface ParentContext {
    FormId: string;
    // FormProps: FormContracts.FormContextPropsObject;
    // FieldGroupId: string;
    // FieldGroupProps: FieldGroupContracts.FieldGroupContextPropsObject;
}

export abstract class BaseField<TProps extends FieldContracts.FieldProps, TState extends BaseFieldState>
    extends React.Component<TProps, TState> {
    public context: ParentContext;

    static contextTypes = {
        FormId: React.PropTypes.string,
        // FormProps: React.PropTypes.object,
        // FieldGroupId: React.PropTypes.string,
        // FieldGroupProps: React.PropTypes.object
    };

    static defaultProps: FieldContracts.FieldProps = {
        // Empty string checked to have value in componentWillMount
        name: "",
        validationType: FieldContracts.ValidationType.OnChange,
        destroyOnUnmount: false
    };

    componentWillMount() {
        // props.name MUST have a proper value
        if (this.props.name == null || this.props.name === "") {
            throw new Error("simplr-forms-core: Field name prop must be given (not undefined or empty string).");
        }
    }

    abstract render(): JSX.Element | null;
}
