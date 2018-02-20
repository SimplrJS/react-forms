import { FormStore } from "../form-store";

const FAKE_FORM_ID = "fake-form-id";
const FAKE_FIELD_ID = "fake-field-id";

it("Register a field", () => {
    const store = new FormStore(FAKE_FORM_ID);
    store.registerField(FAKE_FIELD_ID);

    expect(store.getFields()).toMatchSnapshot();
});

it("Dehydration", () => {
    const store = new FormStore(FAKE_FORM_ID);
    store.registerField(FAKE_FIELD_ID);

    expect(store.dehydrate()).toMatchSnapshot();
});
