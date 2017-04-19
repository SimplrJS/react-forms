/// <reference types="react" />
import { Contracts as CoreContracts } from "simplr-forms-core";
export interface OnChangeCallback<TElement> extends React.EventHandler<React.FormEvent<TElement>> {
    (event: React.FormEvent<TElement> | undefined, newValue: CoreContracts.FieldValue, fieldId: string, formId: string): void;
}
