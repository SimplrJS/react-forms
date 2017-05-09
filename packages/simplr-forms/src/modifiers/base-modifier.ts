import * as React from "react";
import { Modifier } from "../contracts/value";
import { FieldValue } from "../contracts/field";
import { ValueOfType } from "../utils/value-helpers";

export abstract class BaseModifier<TProps, TState> extends React.Component<TProps, TState> implements Modifier {
    // Indentifier function
    static SimplrFormsCoreModifier() { }
    abstract Format(value: FieldValue): FieldValue;
    abstract Parse(value: FieldValue): FieldValue;
    render() {
        return null;
    }
}
