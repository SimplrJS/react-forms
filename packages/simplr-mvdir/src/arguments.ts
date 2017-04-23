import * as yargs from "yargs";

import * as Contracts from "./contracts";

export let argv = yargs
    .help("h", "Show help.")
    .alias("h", "help")
    .version(() => {
        return `Current version: ${require("../package.json").version}.`;
    })
    .alias("v", "version")
    .config("config")
    .alias("c", "config")
    .options("from", {
        describe: "Move files from this directory.",
        type: "string"
    })
    .options("to", {
        describe: "Move files to this directory.",
        type: "string"
    })
    .usage("Usage: scss-bundle [options]")
    .string(["c", "e", "d"])
    .argv as Contracts.ArgumentsValues;
