#!/usr/bin/env node

import * as Contracts from "./contracts";
import { argv } from "./arguments";
import * as mvDir from "./index";

class Cli {
    constructor(argumentValues: Contracts.ArgumentsValues) {
        this.mvDir(argumentValues);
    }

    private async mvDir(argumentValues: Contracts.ArgumentsValues) {
        const from = argumentValues.from;
        const to = argumentValues.to;
        await mvDir.move(from, to, true, true);
    }
}

new Cli(argv);
