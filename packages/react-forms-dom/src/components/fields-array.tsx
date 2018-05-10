import * as React from "react";
import {
    FieldsArrayProps as CoreProps,
    FieldsArrayState as CoreState,
    BaseFieldsArray
} from "@simplr/react-forms";
import { HTMLElementProps } from "../contracts/field";

export interface FieldsArrayProps extends CoreProps, HTMLElementProps<HTMLDivElement> {
    name: string;

    ref?: React.Ref<FieldsArray>;
}

export type FieldsArrayState = CoreState;

export class FieldsArray extends BaseFieldsArray<FieldsArrayProps, FieldsArrayState> {
    public Element: HTMLDivElement | null = null;

    protected SetElementRef = (element: HTMLDivElement | null): void => {
        this.Element = element;
    }

    protected GetHTMLProps(props: FieldsArrayProps): {} {
        const {
            name,
            indexWeight,
            arrayKey,
            destroyOnUnmount,
            children,
            ...restProps } = this.props;
        return restProps;
    }

    public render(): JSX.Element {
        return <div
            ref={this.SetElementRef}
            {...this.GetHTMLProps(this.props) }
        >
            {this.props.children}
        </div>;
    }
}
