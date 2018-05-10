import * as React from "react";
import * as PropTypes from "prop-types";

import {
    BaseContainer,
    BaseContainerParentContext,
    BaseContainerProps,
    FormStoreStateRecord,
    FieldStoreState
} from "@simplr/react-forms";
import {
    RadioGroupChildContext,
    RadioGroupProps,
    RadioValue
} from "./radio-group";
import {
    HTMLElementProps,
    DomFieldTemplateCallback,
    DomFieldDetails,
    DomComponentData
} from "../contracts/field";

export interface RadioProps extends BaseContainerProps, HTMLElementProps<HTMLInputElement> {
    value: string;

    template?: DomFieldTemplateCallback;
    ref?: React.Ref<Radio>;
}

export interface RadioState {
    FormStoreState?: FormStoreStateRecord;
    Value?: RadioValue;
}

export interface RadioParentContext extends RadioGroupChildContext, BaseContainerParentContext {
    FieldId: string;
    FormId: string;
}

export class Radio extends BaseContainer<RadioProps, RadioState> {
    public Element: HTMLInputElement | null = null;
    public state: RadioState = {};
    public context!: RadioParentContext;

    // TODO: Fix me. PropTypes.ValidationMap<RadioParentContext>
    public static contextTypes: any = {
        ...BaseContainer.contextTypes,
        FieldId: PropTypes.string.isRequired,
        RadioGroupOnChangeHandler: PropTypes.func.isRequired,
        RadioGroupOnBlur: PropTypes.func.isRequired,
        RadioGroupOnFocus: PropTypes.func.isRequired
    };

    public componentWillMount(): void {
        super.componentWillMount();

        this.setState(state => {
            return {
                FormStoreState: this.FormStore.GetState(),
                Value: this.FieldState.Value
            };
        });
    }

    protected OnChangeHandler: React.ChangeEventHandler<HTMLInputElement> = event => {
        this.context.RadioGroupOnChangeHandler(event, this.props.value);
    }

    protected OnFocus: React.FocusEventHandler<HTMLInputElement> = event => {
        this.context.RadioGroupOnFocus(event);
    }

    protected OnBlur: React.FocusEventHandler<HTMLInputElement> = event => {
        this.context.RadioGroupOnBlur(event);
    }

    protected get FieldState(): FieldStoreState {
        if (this.FieldId == null) {
            throw new Error("@simplr/react-forms-dom: Radio must be in RadioGroup component.");
        }
        return this.FormStore.GetField(this.FieldId);
    }

    protected get FieldsGroupId(): string | undefined {
        if (this.FieldState.FieldsGroup != null) {
            return this.FieldState.FieldsGroup.Id;
        }
    }

    protected get Disabled(): boolean | undefined {
        // FormStore can only enforce disabling
        if (this.FormStore.GetState().Disabled === true) {
            return true;
        }
        if (this.FieldId != null) {
            const fieldProps = this.FieldState.Props as any as RadioGroupProps;

            if (fieldProps != null && fieldProps.disabled != null) {
                return fieldProps.disabled;
            }
        }

        if (this.props.disabled != null) {
            return this.props.disabled;
        }
    }

    protected get FieldTemplate(): DomFieldTemplateCallback | undefined {
        const radioGroupProps = this.FieldState.Props as any as RadioGroupProps;
        if (this.props.template != null) {
            return this.props.template;
        }

        if (radioGroupProps.radioTemplate) {
            return radioGroupProps.radioTemplate;
        }
    }

    protected OnStoreUpdated(): void {
        const newFormStoreState = this.FormStore.GetState();
        const isStateDifferent = this.state == null ||
            this.state.FormStoreState !== newFormStoreState;

        if (isStateDifferent) {
            this.setState(state => {
                const nextState: RadioState = {};
                if (state == null) {
                    return {
                        FormStoreState: newFormStoreState
                    };
                } else {
                    nextState.FormStoreState = newFormStoreState;
                }

                if (this.FieldId != null) {
                    const newFieldState = this.FormStore.GetField(this.FieldId);
                    nextState.Value = newFieldState.Value;
                }

                return nextState;
            });
        }
    }

    protected GetHTMLProps(props: RadioProps): {} {
        const { ref, template, ...otherProps } = props;
        return otherProps;
    }

    protected SetElementRef = (element: HTMLInputElement | null) => {
        this.Element = element;
    }

    public renderField(): JSX.Element {
        return <input
            ref={this.SetElementRef}
            {...this.GetHTMLProps(this.props)}
            type="radio"
            checked={(this.state.Value === this.props.value)}
            onChange={this.OnChangeHandler}
            onFocus={this.OnFocus}
            onBlur={this.OnBlur}
            disabled={this.Disabled}
        />;
    }

    public render(): JSX.Element | null {
        if (this.FieldTemplate == null) {
            return this.renderField();
        }
        return this.FieldTemplate(
            this.renderField.bind(this),
            {
                name: this.FieldState.Name,
                fieldGroupId: this.FieldsGroupId,
                id: this.FieldId
            } as DomFieldDetails,
            this.FormStore,
            {
                props: this.props,
                state: this.FieldState
            } as DomComponentData);
    }
}
