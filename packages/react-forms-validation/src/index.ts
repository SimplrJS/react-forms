export * from "./abstractions";
export * from "./contracts";
export * from "./utils";

// Validators
export * from "./validators/alpha";
export * from "./validators/alphanumeric";
export * from "./validators/ascii";
export * from "./validators/base64";
export * from "./validators/boolean";
export * from "./validators/byte-length";
export * from "./validators/contains";
export * from "./validators/credit-card";
export * from "./validators/currency";
export * from "./validators/equals";
export * from "./validators/required";

// Subscribers
export * from "./subscribers/form-stores-handler-subscriber";
export * from "./subscribers/form-store-subscriber";
export * from "./subscribers/subscriber";


import { ValidationSubscriberContainer } from "./subscribers/subscriber";

export function InitializeValidation(): void {
    // A shortcut function
    ValidationSubscriberContainer.Initialize();
}
