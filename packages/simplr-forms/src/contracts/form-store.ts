import * as Immutable from "immutable";
import { TypedRecord } from "typed-immutable-record";

import { FieldStateRecord } from "../contracts/field";
import { FieldsGroupStoreState } from "../contracts/fields-group";
import { FormStateRecord } from "../contracts/form";

export interface FormStoreState extends FormStoreStateStatus {
    Fields: Immutable.Map<string, FieldStateRecord>;
    FieldsGroups: Immutable.Map<string, FieldsGroupStoreState>;
    Form: FormStateRecord;
}

export interface FormStoreStateStatus {
    Validating: boolean;
    HasError: boolean;
    Pristine: boolean;
    Touched: boolean;
}

export interface FormStoreStateRecord extends TypedRecord<FormStoreStateRecord>, FormStoreState { }

export interface BuiltFormObject {
    Fields: Immutable.Map<string, FieldStateRecord>;
    Object: any;
}
