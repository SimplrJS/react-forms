import * as React from "react";
import { Normalizer } from "../contracts/value";
import { FieldValue } from "../contracts/field";
import { ValueOfType } from "../utils/value-helpers";

export abstract class BaseNormalizer<TProps, TState> extends React.Component<TProps, TState> implements Normalizer {
    // Indentifier function
    static SimplrFormsCoreNormalizer() { }
    abstract Normalize(value: FieldValue): FieldValue;
    render() {
        return null;
    }
}
