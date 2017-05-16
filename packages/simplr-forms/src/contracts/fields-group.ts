import { TypedRecord } from "typed-immutable-record";
import { FormContextPropsObject } from "./form";

export interface FieldsGroupProps {
    name: string;
    destroyOnUnmount?: boolean;
}

export interface FieldsGroupState { }

export interface FieldsGroupStoreState {
    Name: string;
    Parent?: string;
    ArrayName?: string;
}

export interface FieldsGroupStoreStateRecord extends TypedRecord<FieldsGroupStoreStateRecord>, FieldsGroupStoreState { }

export interface FieldsGroupChildContext {
    FieldsGroupId: string;
    FieldsGroupProps: FieldsGroupPropsObject;
}

export interface FieldsGroupPropsObject { }

export interface FieldsGroupContextProps { }
