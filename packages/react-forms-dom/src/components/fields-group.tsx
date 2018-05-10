import * as React from "react";
import {
    FieldsGroupProps as CoreProps,
    FieldsGroupState as CoreState,
    BaseFieldsGroup
} from "@simplr/react-forms";
import { HTMLElementProps } from "../contracts/field";

export interface FieldsGroupProps extends CoreProps, HTMLElementProps<HTMLDivElement> {
    name: string;

    ref?: React.Ref<FieldsGroup>;
}

export type FieldsGroupState = CoreState;

export class FieldsGroup extends BaseFieldsGroup<FieldsGroupProps, FieldsGroupState> {
    public Element: HTMLDivElement | null = null;

    protected SetElementRef = (element: HTMLDivElement | null): void => {
        this.Element = element;
    }

    protected GetHTMLProps(props: FieldsGroupProps): {} {
        const {
            name,
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
