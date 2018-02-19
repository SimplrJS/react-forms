import { BaseStore } from "../abstractions/base-store";

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
        throw new Error("Method not implemented.");
    }

    public dehydrate(): FieldStoreData {
        throw new Error("Method not implemented.");
    }
}
