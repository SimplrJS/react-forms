import { createContext } from "react";
import { FieldStore } from "../stores/field-store";

export interface FieldContextObject {
    store: FieldStore;
}

export const FieldContext = createContext<FieldContextObject>({
    store: new FieldStore(),
});
