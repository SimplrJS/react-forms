import { FieldStateRecord } from "../contracts/field";
import { FieldGroupStoreState } from "../contracts/field-group";
import { FormStateRecord } from "../contracts/form";
import * as Immutable from "immutable";

export interface FormStoreState {
    Fields: Immutable.Map<string, FieldStateRecord>;
    FieldsGroups: Immutable.Map<string, FieldGroupStoreState>;
    Form?: FormStateRecord;
}
