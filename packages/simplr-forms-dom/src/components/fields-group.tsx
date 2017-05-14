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

    private setElementRef = (element: HTMLDivElement) => {
        this.Element = element;
    }

    protected HTMLProps() {
        let notHTMLProps = ["name", "destroyOnUnmount"];
        let newProps: { [id: string]: any } = {};

        for (let key in this.props) {
            if ((this.props as Dictionary)[key] != null && notHTMLProps.indexOf(key) === -1) {
                newProps[key] = (this.props as Dictionary)[key];
            }
        }

        return newProps;
    }

    render() {
        return <div
            ref={this.setElementRef}
            {...this.HTMLProps() }
        >
            {this.props.children}
        </div>;
    }
}
