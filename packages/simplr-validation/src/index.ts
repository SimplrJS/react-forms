export * from "./validators/index";
export * from "./subscribers/index";

import { ValidationSubscriberContainer } from "./subscribers/index";

export function InitializeValidation() {
    // A shortcut function
    ValidationSubscriberContainer.Initialize();
}
