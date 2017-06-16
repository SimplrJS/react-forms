import * as React from "react";
import {
    FieldsGroupProps as CoreProps,
    FieldsGroupState as CoreState
} from "simplr-forms/contracts";
import { BaseFieldsGroup } from "simplr-forms";

export interface FieldsGroupProps extends CoreProps {
}

export interface FieldsGroupState extends CoreState {
}

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

    render(): JSX.Element | null {
        return <div
            ref={this.SetElementRef}
            {...this.GetHTMLProps(this.props) }
        >
            {this.props.children}
        </div>;
    }
}
