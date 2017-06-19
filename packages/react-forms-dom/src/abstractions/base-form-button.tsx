import * as React from "react";
import { recordify, TypedRecord } from "typed-immutable-record";
import { Iterable } from "immutable";

import { BaseContainer, BaseContainerProps } from "@simplr/react-forms";

export interface BaseFormButtonProps extends BaseContainerProps, React.HTMLProps<HTMLButtonElement> {
    disableOnError?: boolean;
    disableOnBusy?: boolean;
    disableOnPristine?: boolean;
    busy?: boolean;
    disabled?: boolean;
    busyClassName?: string;
}

export interface BaseFormButtonState {
    HasError: boolean;
    Validating: boolean;
    Submitting: boolean;
    Pristine: boolean;
    Disabled: boolean;
}

export interface BaseFormButtonStateRecord extends TypedRecord<BaseFormButtonStateRecord>, BaseFormButtonState { }

export abstract class BaseFormButton<TProps extends BaseFormButtonProps, TState extends BaseFormButtonStateRecord>
    extends BaseContainer<TProps, TState> {
    public static defaultProps: BaseFormButtonProps = {
        disableOnBusy: true,
        disableOnError: false,
        disableOnPristine: false,
        disabled: undefined,
        busyClassName: "busy"
    };

    protected OnStoreUpdated(): void {
        const formStore = this.FormStore.GetState();
        const newState: BaseFormButtonState = {
            HasError: formStore.HasError,
            Validating: formStore.Validating,
            Submitting: formStore.Submitting,
            Pristine: formStore.Pristine,
            Disabled: formStore.Form.Disabled
        };

        const newStateRecord = recordify<BaseFormButtonState, BaseFormButtonStateRecord>(newState);

        // Type 'Readonly<TState>' cannot be converted to type 'Iterable<string, any>'.
        const stateIterable = this.state as any as Iterable<string, any>;
        if (!newStateRecord.equals(stateIterable)) {
            // newStateRecord becomes an empty object after setState
            // This happens because of an underlying Immutable.Record
            // not enumerating properties in for..in
            this.setState(() => newState);
        }
    }

    protected get Disabled(): boolean {
        if (this.state == null) {
            return false;
        }

        if (this.state.Disabled === true) {
            return true;
        }

        const props = this.props as TProps;
        if (props.disabled != null) {
            return props.disabled;
        }

        if (props.disableOnError === true &&
            this.state.HasError) {
            return true;
        }

        if (props.disableOnBusy === true &&
            this.Busy) {
            return true;
        }

        if (props.disableOnPristine === true &&
            this.state.Pristine === true) {
            return true;
        }
        return false;
    }

    protected get Busy(): boolean {
        return this.props.busy === true ||
            this.state != null &&
            (this.state.Validating || this.state.Submitting);
    }

    protected get InlineStyles(): React.CSSProperties {
        let inlineStyles: React.CSSProperties = {};
        const props = this.props as TProps;
        if (props.style != null) {
            inlineStyles = props.style;
        }

        if (this.Busy && !props.disabled) {
            inlineStyles.cursor = "wait";
        }

        return inlineStyles;
    }

    protected get ClassName(): string | undefined {
        let className = "";
        if (this.props.className != null) {
            className += `${this.props.className} `;
        }
        if (this.Busy) {
            className += this.props.busyClassName;
        }
        return className.length > 0 ? className : undefined;
    }

    public abstract render(): JSX.Element | null;
}
