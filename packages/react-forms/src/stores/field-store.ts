import { BaseStore } from "../abstractions/base-store";
import { StoreHydrated } from "../actions/store-actions";

export interface FieldStoreState {
    value: string;
}

export interface FieldStoreData {
    value: string;
}

export class FieldStore extends BaseStore<FieldStoreState, FieldStoreData> {
    constructor(private formId: string) {
        super();
    }

    protected getInitialState(): FieldStoreState {
        return {
            value: ""
        };
    }

    public hydrate(data: FieldStoreData): void {
        this.setState(new StoreHydrated(), state => data);
    }

    public dehydrate(): FieldStoreData {
        return this.getState();
    }
}
