import * as React from "react";
import {
    FieldValue,
    FieldProps,
    FieldStoreState
} from "simplr-forms/contracts";
import { FormStore } from "simplr-forms/stores";

export interface HTMLElementProps<TElement> extends React.HTMLProps<TElement> {
    // When extending HTMLProps interface there is an Element ref and it is not overriden by component ref.
    ref?: React.Ref<any>;
    value?: any;
    defaultValue?: any;
    onChange?: FieldOnChangeInternalCallback;
    children?: React.ReactNode;
}

export type FieldOnChangeInternalCallback = (event: React.FormEvent<any>, ...parameters: any[]) => void;

export type FieldOnChangeCallback<TElement> = (
    event: React.FormEvent<TElement>,
    newValue: FieldValue,
    fieldId: string,
    formId: string
) => void;


export interface DomFieldProps extends FieldProps {
    template?: DomFieldTemplateCallback;
    onFocus?: React.FocusEventHandler<any>;
    onBlur?: React.FocusEventHandler<any>;
    children?: React.ReactNode;
}

export interface DomFieldDetails {
    id: string;
    name: string;
    fieldGroupId: string;
}

export interface DomComponentData {
    props: FieldProps;
    state: FieldStoreState;
}

export type DomFieldTemplateCallback = (
    renderField: () => JSX.Element | null,
    fieldDetails: DomFieldDetails,
    store: FormStore,
    componentData: DomComponentData
) => JSX.Element | null;
