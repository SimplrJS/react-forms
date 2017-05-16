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
    public Element: HTMLDivElement;

    private setElementRef = (element: HTMLDivElement): void => {
        this.Element = element;
    }

    protected HTMLProps(): {} {
        const {
            name,
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
