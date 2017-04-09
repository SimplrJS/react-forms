import * as React from "react";
import {
    FieldProps,
    FieldState,
    FieldValueType,
    FieldValidationType
} from "../contracts/field";
import * as FormContracts from "../contracts/form";

export interface BaseFieldState {
    Field?: FieldState;
    Form?: FormContracts.FormState;
    RenderValue?: FieldValueType;
}

export interface ParentContext {
    FormId: string;
    // FormProps: FormContracts.FormContextPropsObject;
    // FieldGroupId: string;
    // FieldGroupProps: FieldGroupContracts.FieldGroupContextPropsObject;
}

export abstract class BaseField<TProps extends FieldProps, TState extends BaseFieldState>
    extends React.Component<TProps, TState> {
    public context: ParentContext;

    static contextTypes: React.ValidationMap<ParentContext> = {
        FormId: React.PropTypes.string,
        // FormProps: React.PropTypes.object,
        // FieldGroupId: React.PropTypes.string,
        // FieldGroupProps: React.PropTypes.object
    };

    static defaultProps: FieldProps = {
        // Empty string checked to have value in componentWillMount
        name: "",
        validationType: FieldValidationType.OnChange,
        // By default, fields data should be retained, even if the field is unmounted
        destroyOnUnmount: false
    };

    componentWillMount() {
        // props.name MUST have a proper value
        if (this.props.name == null || this.props.name === "") {
            throw new Error("simplr-forms-core: A proper field name must be given (undefined and empty string are not valid).");
        }

        if (this.context.FormId == null) {
            throw new Error("simplr-forms-core: Field must be used inside a Form component.");
        }
    }

    abstract render(): JSX.Element | null;
}
