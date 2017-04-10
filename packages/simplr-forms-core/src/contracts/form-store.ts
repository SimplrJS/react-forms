import * as Immutable from "immutable";
import { TypedRecord } from "typed-immutable-record";

import { FieldStateRecord } from "../contracts/field";
import { FieldGroupStoreState } from "../contracts/field-group";
import { FormStateRecord } from "../contracts/form";

export interface FormStoreState {
    Fields: Immutable.Map<string, FieldStateRecord>;
    FieldsGroups: Immutable.Map<string, FieldGroupStoreState>;
    Form?: FormStateRecord;
}

export interface FormStoreStateRecord extends TypedRecord<FormStoreStateRecord>, FormStoreState { }
