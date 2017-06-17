import * as React from "react";
import {
    Modifier,
    ModifierValue
} from "../contracts/value";
import { FieldValue } from "../contracts/field";
import { ValueOfType } from "../utils/value-helpers";

export abstract class BaseModifier<TProps, TState> extends React.Component<TProps, TState> implements Modifier {
    // Indentifier function
    static SimplrFormsCoreModifier() { }
    abstract Format(value: FieldValue): FieldValue;
    abstract Parse(value: ModifierValue): ModifierValue;
    render() {
        return null;
    }
}
