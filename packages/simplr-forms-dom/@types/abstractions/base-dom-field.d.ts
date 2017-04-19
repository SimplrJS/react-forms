import { Abstractions as CoreAbstractions, Contracts as CoreContracts } from "simplr-forms-core";
export interface BaseDomFieldState extends CoreAbstractions.BaseFieldState {
}
export declare abstract class BaseDomField<TProps extends CoreContracts.FieldProps, TState extends BaseDomFieldState> extends CoreAbstractions.BaseField<TProps, TState> {
    protected RawInitialValue: any;
    protected DefaultValue: any;
    abstract renderField(): JSX.Element | null;
    render(): JSX.Element | null;
}
