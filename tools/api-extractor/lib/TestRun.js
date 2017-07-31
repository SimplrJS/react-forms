"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
// NOTE: THIS SOURCE FILE IS FOR DEBUGGING PURPOSES ONLY.
//       IT IS INVOKED BY THE "Run.cmd" AND "Debug.cmd" BATCH FILES.
var ts = require("typescript");
var path = require("path");
var Extractor_1 = require("./Extractor");
var ApiFileGenerator_1 = require("./generators/ApiFileGenerator");
var inputFolder = './testInputs/example1';
var outputFile = './lib/example1-output.ts';
var compilerOptions = {
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    rootDir: inputFolder
};
var extractor = new Extractor_1.default({
    compilerOptions: compilerOptions,
    errorHandler: console.log
});
extractor.analyze({
    entryPointFile: path.join(inputFolder, 'index.ts')
});
var apiFileGenerator = new ApiFileGenerator_1.default();
apiFileGenerator.writeApiFile(outputFile, extractor);

//# sourceMappingURL=TestRun.js.map
