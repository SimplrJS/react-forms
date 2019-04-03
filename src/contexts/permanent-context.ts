import { createContext } from "react";

export interface PermanentContextObject {
    permanent: boolean;
}

export const PermanentContext = createContext<PermanentContextObject>({
    permanent: false
});
