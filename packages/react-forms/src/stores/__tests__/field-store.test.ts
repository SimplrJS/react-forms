import { FieldStore } from "../field-store";

const FAKE_FORM_ID = "fake-form-id";
const FAKE_FIELD_ID = "fake-field-id";

it("Update value", () => {
    const store = new FieldStore(FAKE_FORM_ID, FAKE_FIELD_ID);
    expect(store.getValue()).toMatchSnapshot();

    const nextValue = "Hello World!";
    store.updateValue(nextValue);

    expect(store.getValue()).toBe(nextValue);
});
