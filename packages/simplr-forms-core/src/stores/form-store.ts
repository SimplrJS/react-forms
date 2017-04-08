export interface FormsState {

}

export class FormStore {
    constructor(formId: string) {
        this.FormId = formId;
    }

    protected FormId: string;
}