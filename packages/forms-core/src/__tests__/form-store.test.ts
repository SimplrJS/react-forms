import { FormStore } from "../stores/form-store";
import { FormStateUpdater, FormState } from "../contracts/form-store";

describe("form-store", () => {
    let store: FormStore;
    beforeEach(() => {
        store = new FormStore();
    });

    it("update return-style", () => {
        const updater: FormStateUpdater<FormState> = state => {
            state.status.disabled = true;
        };
        store.update(updater);
    });
});
