import * as React from "react";
import {
    FieldValue,
    FieldProps,
    FieldStoreState
} from "@simplr/react-forms/contracts";
import { FormStore } from "@simplr/react-forms/stores";

/**
 * Base HTML element props with proper onChange.
 *
 * @public
 */
export interface HTMLElementProps<TElement> extends React.HTMLProps<TElement> {
    /**
     * When extending HTMLProps interface, there is:
     * ref?: Ref<TElement>;
     * We override it with Ref<any> here to losen the type.
     * Later on, we assign ref with component type to have a correct type exposed to the end user, e.g. in Text:
     * ref?: React.Ref<Text>;
     */
    ref?: React.Ref<any>;
    value?: any;
    defaultValue?: any;
    onChange?: FieldOnChangeInternalCallback;
    children?: React.ReactNode;
}

/**
 * Internal representation of field `onChange` callback.
 * Used for onChage from React.HTMLProps override.
 *
 * @internal
 */
export type FieldOnChangeInternalCallback = (event: React.FormEvent<any>, ...parameters: any[]) => void;

/**
 * Field `onChange` callback.
 *
 * @public
 */
export type FieldOnChangeCallback<TElement> = (
    event: React.FormEvent<TElement>,
    newValue: FieldValue,
    fieldId: string,
    store: FormStore
) => void;

/**
 * DOM field specific props.
 *
 * @public
 */
export interface DomFieldProps extends FieldProps {
    template?: DomFieldTemplateCallback;
    onFocus?: React.FocusEventHandler<any>;
    onBlur?: React.FocusEventHandler<any>;
    children?: React.ReactNode;
    errorClassName?: string;
}

/**
 * All values for field identification.
 * For both code (id, fieldGroupId) and humans (name).
 *
 * @public
 */
export interface DomFieldDetails {
    id: string;
    name: string;
    fieldGroupId: string;
}

/**
 * Field component data.
 * Props and state.
 *
 * @public
 */
export interface DomComponentData {
    props: FieldProps;
    state: FieldStoreState;
}

/**
 * DOM field `template` callback.
 *
 * @public
 */
export type DomFieldTemplateCallback = (
    renderField: () => JSX.Element | null,
    fieldDetails: DomFieldDetails,
    store: FormStore,
    componentData: DomComponentData
) => JSX.Element | null;
