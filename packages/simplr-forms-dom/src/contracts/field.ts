import * as React from "react";
import {
    FieldValue,
    FieldProps,
    FieldStoreState
} from "simplr-forms/contracts";
import { FormStore } from "simplr-forms/stores";

export interface FieldOnChangeInternalCallback {
    (event: React.FormEvent<any>, ...parameters: any[]): void;
}

export interface FieldOnChangeCallback<TElement> {
    (event: React.FormEvent<TElement>, newValue: FieldValue, fieldId: string, formId: string): void;
}

export interface DomFieldProps extends FieldProps {
    template?: DomFieldTemplateCallback;
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

export interface DomFieldTemplateCallback {
    (
        renderField: () => JSX.Element | null,
        fieldDetails: DomFieldDetails,
        store: FormStore,
        componentData: DomComponentData
    ): JSX.Element | null;
}
