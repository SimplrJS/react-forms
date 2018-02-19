import { BaseStore } from "../abstractions/base-store";

export interface FormStoreState {
    Fields: { [key: string]: any };
}

export interface FormStoreData {
    Fields: { [key: string]: any };
}

export class FormStore extends BaseStore<FormStoreState, FormStoreData> {
    constructor(private formId: string) {
        super();
    }

    protected getInitialState(): FormStoreState {
        return {
            Fields: {}
        };
    }

    public hydrate(data: FormStoreData): void {
        throw new Error("Method not implemented.");
    }

    public dehydrate(): FormStoreData {
        throw new Error("Method not implemented.");
    }
}
