import * as Immutable from "immutable";

import { FieldValidationStatus } from "./validation";
import { FieldStoreState } from "./field";
import { FormState } from "./form";
import { FieldsGroupStoreState } from "./fields-group";

export interface FormStoreState extends FormStoreStateStatus {
    Fields: Immutable.Map<string, FieldStoreState>;
    FieldsGroups: Immutable.Map<string, FieldsGroupStoreState>;
    FieldsValidationStatuses: Immutable.Map<string, FieldValidationStatus>;
    Form: FormState;
}

export interface FormStoreStateStatus {
    Validating: boolean;
    Submitting: boolean;
    Disabled: boolean;
    HasError: boolean;
    Pristine: boolean;
    Touched: boolean;
}

export interface BuiltFormObject {
    Fields: Immutable.Map<string, FieldStoreState>;
    Object: any;
}
