import { FormListStore } from "./stores/form-list-store";

export class ConfigClass {
    private formListStore: FormListStore = new FormListStore();

    public get formList(): FormListStore {
        return this.formListStore;
    }

    public setFormList(store: FormListStore): void {
        this.formListStore = store;
    }
}

export const Config = new ConfigClass();
