import * as React from "react";
import { FieldValue } from "simplr-forms/contracts";

export interface FieldOnChangeCallback<TElement> extends React.EventHandler<React.FormEvent<TElement>> {
    (event: React.FormEvent<TElement> | undefined, newValue: FieldValue, fieldId: string, formId: string): void;
}
