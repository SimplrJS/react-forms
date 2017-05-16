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
    public Element: HTMLDivElement;

    private setElementRef = (element: HTMLDivElement): void => {
        this.Element = element;
    }

    protected HTMLProps(): {} {
        const {
            name,
            index,
            destroyOnUnmount,
            children,
            ...rest } = this.props;
        return rest;
    }

    render(): JSX.Element | null {
        return <div
            ref={this.setElementRef}
            {...this.HTMLProps() }
        >
            {this.props.children}
        </div>;
    }
}
