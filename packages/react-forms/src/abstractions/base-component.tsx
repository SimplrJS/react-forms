import * as React from "react";

import { FormListStore } from "../stores/form-list-store";
import { Config } from "../config";

export abstract class BaseComponent<TProps, TState> extends React.Component<TProps, TState> {
    protected getFormListStore(): FormListStore {
        return Config.formList;
    }

    public abstract render(): React.ReactNode;
}
