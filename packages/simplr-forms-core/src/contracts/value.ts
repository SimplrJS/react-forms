import { FieldValue } from "./field";

export interface Modifier {
    Format(value: FieldValue): FieldValue;
    Parse(value: FieldValue): FieldValue;
}

export interface Normalizer {
    Normalize(value: FieldValue): FieldValue;
}
