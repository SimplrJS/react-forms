export * from "./validators/index";
export * from "./subscribers/index";

import { ValidationSubscriberContainer } from "./subscribers/index";

export function InitializeValidation(): void {
    // A shortcut function
    ValidationSubscriberContainer.Initialize();
}
