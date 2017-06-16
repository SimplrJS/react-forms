import * as React from "react";
import {
    FieldsArrayProps as CoreProps,
    FieldsArrayState as CoreState
} from "simplr-forms/contracts";
import { BaseFieldsArray } from "simplr-forms";

export interface FieldsArrayProps extends CoreProps {
}

export interface FieldsArrayState extends CoreState {
}

interface Dictionary {
    [key: string]: any;
}

export class FieldsArray extends BaseFieldsArray<FieldsArrayProps, FieldsArrayState> {
    public Element: HTMLDivElement | undefined;

    protected SetElementRef = (element: HTMLDivElement | undefined): void => {
        this.Element = element;
    }

    protected GetHTMLProps(props: FieldsArrayProps): {} {
        const {
            name,
            index,
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
