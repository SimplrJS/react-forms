export enum ValidationType {
    None,
    OnFieldRegistered = 1 << 1,
    OnValueChange = 1 << 2,
    OnPropsChange = 1 << 3
}
