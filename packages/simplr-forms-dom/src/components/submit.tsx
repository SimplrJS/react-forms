import * as React from "react";
import { recordify, TypedRecord } from "typed-immutable-record";

import { BaseContainer, BaseContainerProps } from "simplr-forms-core";
import { FormError } from "simplr-forms-core/contracts";

export interface SubmitProps extends BaseContainerProps, React.HTMLProps<HTMLButtonElement> {
    /**
     * Disable when form is submitting.
     *
     * Default: false
     * @type {boolean}
     * @memberOf SubmitProps
     */
    disableOnSubmitting?: boolean;
    /**
     * Disable when at least one field has error.
     *
     * Default: true
     * @type {boolean}
     * @memberOf SubmitProps
     */
    disableOnError?: boolean;
    /**
     * Disable when at least one field is validating.
     *
     * Default: true
     * @type {boolean}
     * @memberOf SubmitProps
     */
    disableOnWaiting?: boolean;
    /**
     * Disable when all fields are pristine.
     *
     * Default: false
     * @type {boolean}
     * @memberOf SubmitProps
     */
    disableOnPristine?: boolean;
    waiting?: boolean;
}

export interface SubmitState {
    Error?: FormError;
    Validating: boolean;
    Submitting: boolean;
    Pristine: boolean;
}

export interface SubmitStateRecord extends TypedRecord<SubmitStateRecord>, SubmitState { }

export class Submit extends BaseContainer<SubmitProps, SubmitStateRecord> {
    protected OnStoreUpdated(): void {
        const formStore = this.FormStore.GetState();
        const newState = recordify({
            Error: formStore.Form.Error,
            Validating: formStore.Form.Validating,
            Submitting: formStore.Form.Submitting,
            Pristine: formStore.Form.Pristine
        });

        if (!newState.equals(this.state)) {
            this.setState(() => newState);
        }
    }

    protected get Disabled() {
        // TODO: Disabled....
        return false;
    }

    render() {
        return <button
            type="submit"
            disabled={this.Disabled}
        >
            {this.props.children}
        </button>;
    }
}
