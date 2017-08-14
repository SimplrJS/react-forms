import * as React from "react";
import { recordify, TypedRecord } from "typed-immutable-record";
import {
    Modifier,
    ModifierValue
} from "../contracts/value";
import { FieldValue } from "../contracts/field";
import { ModifierValueRecord } from "../contracts/value";
import { ValueOfType, RecordifyModifierValue } from "../utils/value-helpers";

export abstract class BaseModifier<TProps, TState> extends React.Component<TProps, TState> implements Modifier {
    // Identifier function
    // tslint:disable-next-line:no-empty
    public static SimplrFormsCoreModifier(): void { }

    public abstract Format(value: FieldValue): FieldValue;

    public abstract Parse(value: ModifierValueRecord): ModifierValueRecord;

    public render(): null {
        return null;
    }

    protected Recordify<TValue extends ModifierValue>(value: TValue): ModifierValueRecord {
        return RecordifyModifierValue(value);
    }
}
