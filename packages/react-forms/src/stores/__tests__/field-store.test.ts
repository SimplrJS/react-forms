import { FieldStore } from "../field-store";

const FAKE_FORMID = "fake-id";

it("Update value", () => {
    const store = new FieldStore(FAKE_FORMID);
    expect(store.getValue()).toMatchSnapshot();

    const nextValue = "Hello World!";
    store.updateValue(nextValue);

    expect(store.getValue()).toBe(nextValue);
});
