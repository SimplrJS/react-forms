import { BaseStore } from "../abstractions/base-store";
import { StoreHydrated } from "../actions/store-actions";
import { FieldValueChanged } from "../actions/field-actions";

export interface FieldStoreState {
    value: string;
}

export interface FieldStoreData {
    value: string;
}

export class FieldStore extends BaseStore<FieldStoreState, FieldStoreData> {
    constructor(protected readonly formId: string, protected readonly fieldId: string) {
        super();
    }

    protected getInitialState(): FieldStoreState {
        return {
            value: ""
        };
    }

    public updateValue(value: string): void {
        this.setState(new FieldValueChanged(value), state => ({
            ...state,
            value: value
        }));
    }

    public getValue(): string {
        return this.getState().value;
    }

    public hydrate(data: FieldStoreData): void {
        this.setState(new StoreHydrated(), state => data);
    }

    public dehydrate(): FieldStoreData {
        return this.getState();
    }
}
