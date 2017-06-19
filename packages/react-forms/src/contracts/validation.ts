export enum FieldValidationType {
    None,
    OnFieldRegistered = 1 << 1,
    OnValueChange = 1 << 2,
    OnPropsChange = 1 << 3
}
