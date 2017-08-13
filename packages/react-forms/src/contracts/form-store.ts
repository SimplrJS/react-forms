import * as Immutable from "immutable";
import { TypedRecord } from "typed-immutable-record";

import { FieldStoreStateRecord } from "../contracts/field";
import { FieldsGroupStoreStateRecord } from "../contracts/fields-group";
import { FormStateRecord } from "../contracts/form";
import { FieldValidationStatus } from "./validation";

export interface FormStoreState extends FormStoreStateStatus {
    Fields: Immutable.Map<string, FieldStoreStateRecord>;
    FieldsGroups: Immutable.Map<string, FieldsGroupStoreStateRecord>;
    FieldsValidationStatuses: Immutable.Map<string, FieldValidationStatus>;
    Form: FormStateRecord;
}

export interface FormStoreStateStatus {
    Validating: boolean;
    Submitting: boolean;
    Disabled: boolean;
    HasError: boolean;
    Pristine: boolean;
    Touched: boolean;
}

export interface FormStoreStateRecord extends TypedRecord<FormStoreStateRecord>, FormStoreState { }

export interface BuiltFormObject {
    Fields: Immutable.Map<string, FieldStoreStateRecord>;
    Object: any;
}
