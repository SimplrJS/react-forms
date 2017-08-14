import { FieldValue } from "./field";
import { TypedRecord } from "typed-immutable-record";

export interface ModifierValue {
    Value: FieldValue;
    TransitionalValue?: FieldValue;
}

export interface ModifierValueRecord extends TypedRecord<ModifierValueRecord>, ModifierValue { }

export interface Modifier {
    Format(value: FieldValue): FieldValue;
    Parse(value: ModifierValueRecord): ModifierValueRecord;
}

export interface Normalizer {
    Normalize(value: FieldValue): FieldValue;
}
