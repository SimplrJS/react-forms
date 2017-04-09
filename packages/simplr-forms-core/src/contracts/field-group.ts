import { TypedRecord } from "typed-immutable-record";

export interface FieldGroupState { }

export interface FieldGroupStoreState {
    Parent?: string;
    ArrayName?: string;
}

export interface FieldGroupStateRecord extends TypedRecord<FieldGroupStateRecord>, FieldGroupState { }