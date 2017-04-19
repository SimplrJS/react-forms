import * as React from "react";
import { Abstractions as CoreAbstractions, Contracts as CoreContracts } from "simplr-forms-core";

export interface Props extends CoreContracts.FormProps, React.HTMLProps<HTMLFormElement> {

}

export interface FormProps extends Props {

}

export class Form extends CoreAbstractions.BaseForm<FormProps, {}> {
    render() {
        return <form>
            {this.props.children}
        </form>;
    }
}
