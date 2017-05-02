import * as Immutable from "immutable";
import { TypedRecord } from "typed-immutable-record";

import { FieldStateRecord } from "../contracts/field";
import { FieldsGroupStoreState } from "../contracts/fields-group";
import { FormStateRecord, FormPropsRecord } from "../contracts/form";

export interface FormStoreState {
    Fields: Immutable.Map<string, FieldStateRecord>;
    FieldsGroups: Immutable.Map<string, FieldsGroupStoreState>;
    Form: FormStateRecord;
    FormProps: FormPropsRecord;
}

export interface FormStoreStateRecord extends TypedRecord<FormStoreStateRecord>, FormStoreState { }

export interface BuiltFormObject {
    Fields: Immutable.Map<string, FieldStateRecord>;
    Object: any;
}
