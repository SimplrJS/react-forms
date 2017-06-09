import { FieldValue } from "./field";

export interface ModifierValue {
    Value: FieldValue;
    TransitionalValue?: FieldValue;
}

export interface Modifier {
    Format(value: FieldValue): FieldValue;
    Parse(value: ModifierValue): ModifierValue;
}

export interface Normalizer {
    Normalize(value: FieldValue): FieldValue;
}
