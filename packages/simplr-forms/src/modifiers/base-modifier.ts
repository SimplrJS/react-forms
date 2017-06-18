import * as React from "react";
import {
    Modifier,
    ModifierValue
} from "../contracts/value";
import { FieldValue } from "../contracts/field";
import { ValueOfType } from "../utils/value-helpers";

export abstract class BaseModifier<TProps, TState> extends React.Component<TProps, TState> implements Modifier {
    // Indentifier function
    // tslint:disable-next-line:no-empty
    public static SimplrFormsCoreModifier(): void { }
    public abstract Format(value: FieldValue): FieldValue;
    public abstract Parse(value: ModifierValue): ModifierValue;
    public render(): null {
        return null;
    }
}
