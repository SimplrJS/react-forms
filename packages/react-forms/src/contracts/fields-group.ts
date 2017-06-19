import { TypedRecord } from "typed-immutable-record";

export interface FieldsGroupProps {
    name: string;
    destroyOnUnmount?: boolean;
}

export type FieldsGroupState = {};

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

export type FieldsGroupPropsObject = {};

export type FieldsGroupContextProps = {};
