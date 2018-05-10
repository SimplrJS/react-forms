import { FieldsGroupProps } from "./fields-group";

export interface FieldsArrayProps extends FieldsGroupProps {
    formId?: string;
    arrayKey: string;
    indexWeight?: number;
}

export type FieldsArrayState = {};

export type FieldsArrayPropsObject = {};
