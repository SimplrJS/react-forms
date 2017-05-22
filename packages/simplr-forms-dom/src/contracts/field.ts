import * as React from "react";
import {
    FieldValue,
    FieldProps,
    FieldStoreState
} from "simplr-forms/contracts";
import { FormStore } from "simplr-forms/stores";

export interface FieldOnChangeCallback<TElement> extends React.EventHandler<React.FormEvent<TElement>> {
    (event: React.FormEvent<TElement> | undefined, newValue: FieldValue, fieldId: string, formId: string): void;
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
