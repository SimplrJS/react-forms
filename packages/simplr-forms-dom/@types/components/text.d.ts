/// <reference types="react" />
import * as React from "react";
import { Contracts as CoreContracts } from "simplr-forms-core";
import { BaseDomField, BaseDomFieldState } from "../abstractions/base-dom-field";
import { OnChangeCallback } from "../contracts/field";
/**
 * Override the differences between extended interfaces.
 *
 * @export
 * @interface Props
 * @extends {CoreContracts.FieldProps}
 * @extends {React.HTMLProps<HTMLInputElement>}
 */
export interface Props extends CoreContracts.FieldProps, React.HTMLProps<HTMLInputElement> {
    name: string;
    onFocus?: React.EventHandler<React.FocusEvent<HTMLInputElement>>;
    onBlur?: React.EventHandler<React.FocusEvent<HTMLInputElement>>;
    ref?: any;
}
export interface TextProps extends Props {
    onChange?: OnChangeCallback<HTMLInputElement>;
}
export declare class Text extends BaseDomField<TextProps, BaseDomFieldState> {
    protected GetValueFromEvent(event: React.FormEvent<HTMLInputElement>): CoreContracts.FieldValue;
    protected OnChangeHandler: React.FormEventHandler<HTMLInputElement>;
    protected readonly IsDisabled: boolean | undefined;
    renderField(): JSX.Element | null;
}
