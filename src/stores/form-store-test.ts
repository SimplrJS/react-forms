import { produce, Draft } from "immer";

const fields: Dictionary<FieldState> = {
    personalInformation: {
        id: "form.personalInformation",
        name: "personalInformation",

        data: {
            defaultValue: "",
            initialValue: "",
            currentValue: ""
        },

        status: {
            focused: false,
            pristine: true,
            touched: false,
            disabled: false,
            readonly: false
        },

        fields: {
            text1: {
                id: "form.personalInformation.text1",
                name: "text1",

                data: {
                    defaultValue: "",
                    initialValue: "",
                    currentValue: ""
                },

                status: {
                    focused: false,
                    pristine: true,
                    touched: false,
                    disabled: false,
                    readonly: false
                },

                fields: {}
            }
        }
    },
    text2: {
        id: "form.text2",
        name: "text2",

        data: {
            defaultValue: "",
            initialValue: "",
            currentValue: ""
        },

        status: {
            focused: false,
            pristine: true,
            touched: false,
            disabled: false,
            readonly: false
        },

        fields: {}
    },

    radioGroup: {
        id: "form.radioGroup",
        name: "radioGroup",

        data: {},

        status: {
            focused: false,
            pristine: true,
            touched: false,
            disabled: false,
            readonly: false
        },

        fields: {
            abc123: {
                id: "form.radioGroup.abc123",
                name: "abc123",

                data: {
                    value: "Nu ir",
                    checked: true
                },

                status: {
                    focused: false,
                    pristine: true,
                    touched: false,
                    disabled: false,
                    readonly: false
                },

                fields: {}
            },
            abc124: {
                id: "form.radioGroup.abc124",
                name: "abc124",

                data: {
                    value: "Na ir",
                    checked: false
                },

                status: {
                    focused: false,
                    pristine: true,
                    touched: false,
                    disabled: false,
                    readonly: false
                },

                fields: {}
            }
        }
    },

    list: {
        id: "form.hobbies",
        name: "hobbies",

        data: {
            order: ["form.hobbies.abc123"]
        },

        status: {
            focused: false,
            pristine: true,
            touched: false,
            disabled: false,
            readonly: false
        },

        fields: {
            abc123: {
                id: "form.hobbies.abc123",
                name: "abc123",

                data: {},

                status: {
                    focused: false,
                    pristine: true,
                    touched: false,
                    disabled: false,
                    readonly: false
                },

                fields: {}
            }
        }
    }
};

const formState: FormState = {
    id: "form",
    name: "form",

    data: {},

    status: {
        focused: false,
        pristine: true,
        touched: false,
        disabled: false,
        readonly: false
    },

    fields: fields
};

console.info(fields, formState);

export interface GroupState {
    fields: Dictionary<FieldState>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FormStoreState extends GroupState {}

const emptyImmutable = produce({}, () => {});

export class FormStore {
    protected state: FormStoreState = emptyImmutable;
    protected dehydratedState: NestedDictionary = emptyImmutable;

    public getState(): FormStoreState {
        return this.state;
    }

    public mutateState(mutator: (state: Draft<FormStoreState>) => FormStoreState | void): void {
        this.state = produce(this.state, mutator);
    }
}
