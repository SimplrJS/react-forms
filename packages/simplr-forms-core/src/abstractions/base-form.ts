import * as React from "react";

export abstract class BaseForm<TProps, TState> extends React.Component<TProps, TState> {
    abstract render(): JSX.Element | null;
}