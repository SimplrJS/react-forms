import * as React from "react";
import * as PropTypes from "prop-types";

import { BaseContainer, BaseContainerParentContext } from "simplr-forms";
import {
    FormStoreStateRecord,
    FieldValue,
    FieldStoreState
} from "simplr-forms/contracts";
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

export interface RadioProps extends HTMLElementProps<HTMLInputElement> {
    value: string;

    template?: DomFieldTemplateCallback;
    ref?: React.Ref<Radio>;
}

export interface RadioState {
    FormStoreState?: FormStoreStateRecord;
    Value?: RadioValue;
}

export type RadioParentContext = RadioGroupChildContext & BaseContainerParentContext;

export class Radio extends BaseContainer<RadioProps, RadioState> {
    public Element: HTMLInputElement | undefined;
    state: RadioState = {};
    public context: RadioParentContext;

    static contextTypes: PropTypes.ValidationMap<RadioParentContext> = {
        ...BaseContainer.contextTypes,
        FieldId: PropTypes.string.isRequired,
        RadioGroupOnChangeHandler: PropTypes.func.isRequired,
        RadioGroupOnBlur: PropTypes.func.isRequired,
        RadioGroupOnFocus: PropTypes.func.isRequired
    };

    componentWillMount(): void {
        super.componentWillMount();

        this.setState(state => {
            state.FormStoreState = this.FormStore.GetState();
            state.Value = this.FieldState.Value;
            return state;
        });
    }

    protected OnChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        this.context.RadioGroupOnChangeHandler(event, this.props.value);
    }

    protected OnFocus: React.FocusEventHandler<HTMLInputElement> = (event) => {
        this.context.RadioGroupOnFocus(event);
    }

    protected OnBlur: React.FocusEventHandler<HTMLInputElement> = (event) => {
        this.context.RadioGroupOnBlur(event);
    }

    protected get FieldState(): FieldStoreState {
        if (this.FieldId == null) {
            throw new Error("simplr-forms-dom: Radio must be in RadioGroup component.");
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
        if (radioGroupProps.radioTemplate) {
            return radioGroupProps.radioTemplate;
        }

        if (this.props.template != null) {
            return this.props.template;
        }
    }

    protected OnStoreUpdated(): void {
        const newFormStoreState = this.FormStore.GetState();
        const isStateDifferent = this.state == null ||
            this.state.FormStoreState !== newFormStoreState;

        if (isStateDifferent) {
            this.setState(state => {
                if (state == null) {
                    state = {
                        FormStoreState: newFormStoreState
                    };
                } else {
                    state.FormStoreState = newFormStoreState;
                }

                if (this.FieldId != null) {
                    const newFieldState = this.FormStore.GetField(this.FieldId);
                    state.Value = newFieldState.Value;
                }
                return state;
            });
        }
    }

    protected GetHTMLProps(props: RadioProps): {} {
        const { ref, ...otherProps } = props;
        return otherProps;
    }

    protected SetElementRef = (element: HTMLInputElement) => {
        this.Element = element;
    }

    renderField(): JSX.Element | null {
        return <input
            ref={this.SetElementRef}
            type="radio"
            checked={(this.state.Value === this.props.value)}
            onChange={this.OnChangeHandler}
            onFocus={this.OnFocus}
            onBlur={this.OnBlur}
            disabled={this.Disabled}
            {...this.GetHTMLProps(this.props) }
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
