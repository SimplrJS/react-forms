import { FormStore } from "../stores/form-store";
import { FormStateUpdater, FormState } from "../contracts/form-store";
import {
    registerField,
    generateFieldId,
    // updateField,
    // updateCurrentValue,
    getDefaultStatuses,
    hydrateField,
    getDefaultFieldData,
    dehydrateField
} from "../stores/form-store-helpers";
import { stringify } from "./test";

describe("form-store", () => {
    let store: FormStore;
    beforeEach(() => {
        store = new FormStore();
    });

    it("update by draft mutation", () => {
        // Arrange
        const oldState = store.getState();

        // TODO: Sanity check? Can this be done according to AAA testing?
        expect(oldState.status.disabled).toBe(false);

        const updater: FormStateUpdater<FormState> = state => {
            state.status.disabled = true;
        };

        // Act
        store.update(updater);

        // Assert
        const updatedState = store.getState();
        expect(updatedState).not.toBe(oldState);
        expect(updatedState.status.disabled).toBe(true);
    });

    it("update by returning new state", () => {
        // Arrange
        const oldState = store.getState();
        const updater: FormStateUpdater<FormState> = state => {
            return {
                ...state,
                status: {
                    ...state.status,
                    disabled: true
                }
            };
        };

        // Act
        store.update(updater);

        // Assert
        const updatedState = store.getState();
        expect(updatedState).not.toBe(oldState);
        expect(updatedState.status.disabled).toBe(true);
    });

    it("test", () => {
        // Arrange
        const oldState = store.getState();
        const name = "firstName";
        const id = generateFieldId(name, undefined);

        const updater: FormStateUpdater<FormState> = state => {
            registerField(state, id, {
                name: name,
                data: getDefaultFieldData("", ""),
                status: getDefaultStatuses(),
                hydrate: hydrateField,
                dehydrate: dehydrateField
            });

            registerField(state, id, {
                name: name,
                data: getDefaultFieldData("", ""),
                status: getDefaultStatuses(),
                hydrate: hydrateField,
                dehydrate: dehydrateField
            });

            // updateField(state, id, fieldState => {
            //     console.info(stringify(fieldState));

            //     updateCurrentValue(fieldState, "hello-again");
            // });
        };

        // Act
        store.update(updater);

        // Assert
        console.info(stringify(oldState));
        console.info(stringify(store.getState()));
    });
});
