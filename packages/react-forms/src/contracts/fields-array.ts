import { TypedRecord } from "typed-immutable-record";
import { FormContextPropsObject } from "./form";
import { FieldsGroupProps, FieldsGroupPropsObject } from "./fields-group";

export interface FieldsArrayProps extends FieldsGroupProps {
    index: number;
}

export interface FieldsArrayData {
    Index: number;
}

export type FieldsArrayState = {};

export type FieldsArrayPropsObject = {};
