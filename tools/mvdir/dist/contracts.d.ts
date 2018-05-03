import * as yargs from "yargs";
export interface ArgumentsValues extends yargs.Arguments {
    config?: string;
    from: string;
    to: string;
}
