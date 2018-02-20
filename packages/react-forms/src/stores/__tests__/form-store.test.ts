import { FormStore, FormStoreState, FormStoreData } from "../form-store";

class TestFormStore extends FormStore {
    public getTestState(): FormStoreState {
        return this.getState();
    }
}

const FAKE_FORM_ID = "fake-form-id";
const FAKE_FIELD_ID = "fake-field-id";

it("Register a field", () => {
    const store = new FormStore(FAKE_FORM_ID);
    store.registerField(FAKE_FIELD_ID);

    expect(store.getFields()).toMatchSnapshot();
});

it("Unregister a field", () => {
    const store = new FormStore(FAKE_FORM_ID);
    store.registerField(FAKE_FIELD_ID);
    expect(store.getFields()).toMatchSnapshot();

    store.unregisterField(FAKE_FIELD_ID);
    expect(store.getFields()).toMatchSnapshot(); 
});

it("Hydration", () => {
    const store = new TestFormStore(FAKE_FORM_ID);
    store.hydrate({
        fields: {
            "field-1": {
                value: "field value 1"
            }
        }
    });

    expect(store.getTestState()).toMatchSnapshot();
});

it("Dehydration", () => {
    const store = new FormStore(FAKE_FORM_ID);
    store.registerField(FAKE_FIELD_ID);

    expect(store.dehydrate()).toMatchSnapshot();
});
