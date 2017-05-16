import { TypedRecord } from "typed-immutable-record";
import { FormContextPropsObject } from "./form";
import { FieldsGroupPropsObject } from "./fields-group";

export interface FieldsArrayProps {
    name: string;
    index: number;
    destroyOnUnmount?: boolean;
}

export interface FieldsArrayState { }

export interface FieldsArrayPropsObject { }
