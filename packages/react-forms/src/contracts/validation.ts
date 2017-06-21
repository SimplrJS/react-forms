export enum FieldValidationType {
    None,
    OnFieldRegistered = 1 << 1,
    OnValueChange = 1 << 2,
    OnPropsChange = 1 << 3,
    OnBlur = 1 << 4
}

export enum FieldValidationStatus {
    Validating = 8,
    HasError = 16
}
