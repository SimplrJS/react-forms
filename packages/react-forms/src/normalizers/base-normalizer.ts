import * as React from "react";
import { Normalizer } from "../contracts/value";
import { FieldValue } from "../contracts/field";

export abstract class BaseNormalizer<TProps, TState> extends React.Component<TProps, TState> implements Normalizer {
    // Indentifier function
    // tslint:disable-next-line:no-empty
    public static SimplrFormsCoreNormalizer(): void { }
    public abstract Normalize(value: FieldValue): FieldValue;
    public render(): null {
        return null;
    }
}
