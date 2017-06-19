import * as React from "react";
import {
    FieldsGroupProps as CoreProps,
    FieldsGroupState as CoreState
} from "@simplr/react-forms/contracts";
import { BaseFieldsGroup } from "@simplr/react-forms";

export type FieldsGroupProps = CoreProps;

export type FieldsGroupState = CoreState;

interface Dictionary {
    [key: string]: any;
}

export class FieldsGroup extends BaseFieldsGroup<FieldsGroupProps, FieldsGroupState> {
    public Element: HTMLDivElement | undefined;

    protected SetElementRef = (element: HTMLDivElement | undefined): void => {
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
