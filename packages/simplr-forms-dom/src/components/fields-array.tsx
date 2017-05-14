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

    private setElementRef = (element: HTMLDivElement) => {
        this.Element = element;
    }

    protected HTMLProps() {
        let notHTMLProps = ["name", "index", "destroyOnUnmount"];
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
