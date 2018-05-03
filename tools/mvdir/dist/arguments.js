"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var yargs = require("yargs");
exports.argv = yargs
    .help("h", "Show help.")
    .alias("h", "help")
    // tslint:disable-next-line:no-require-imports
    .version(function () { return "Current version: " + require("../package.json").version + "."; })
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
    .argv;
