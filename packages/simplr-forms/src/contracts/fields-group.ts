import { TypedRecord } from "typed-immutable-record";

export interface FieldsGroupProps {
    name: string;
}

export interface FieldsGroupState { }

export interface FieldsGroupStoreState {
    Parent?: string;
    ArrayName?: string;
}

export interface FieldsGroupStateRecord extends TypedRecord<FieldsGroupStateRecord>, FieldsGroupState { }

export interface FieldsGroupContextProps { }
