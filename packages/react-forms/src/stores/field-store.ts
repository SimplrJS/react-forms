import { BaseStore } from "../abstractions/base-store";
import { StoreHydrated } from "../actions/store-actions";
import { FieldValueChanged, FieldStoreHydrated } from "../actions/field-actions";

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
        this.setState(state => ({
            ...state,
            value: value
        }), new FieldValueChanged(this.fieldId, value));
    }

    public getValue(): string {
        return this.getState().value;
    }

    public hydrate(data: FieldStoreData): void {
        this.setState(() => data, new FieldStoreHydrated(this.fieldId));
    }

    public dehydrate(): FieldStoreData {
        return this.getState();
    }
}
