"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
// NOTE: THIS SOURCE FILE IS FOR DEBUGGING PURPOSES ONLY.
//       IT IS INVOKED BY THE "Run.cmd" AND "Debug.cmd" BATCH FILES.
var ts = require("typescript");
var os = require("os");
var Extractor_1 = require("./Extractor");
var ApiFileGenerator_1 = require("./generators/ApiFileGenerator");
var ApiJsonGenerator_1 = require("./generators/ApiJsonGenerator");
var ApiDefinitionReference_1 = require("./ApiDefinitionReference");
var compilerOptions = {
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    experimentalDecorators: true,
    jsx: ts.JsxEmit.React,
    rootDir: './testInputs/example4',
    typeRoots: ['./'] // We need to ignore @types in these tests
};
var extractor = new Extractor_1.default({
    compilerOptions: compilerOptions,
    errorHandler: function (message, fileName, lineNumber) {
        console.log("ErrorHandler: " + message + os.EOL
            + ("  " + fileName + "#" + lineNumber));
    }
});
extractor.loadExternalPackages('./testInputs/external-api-json');
extractor.analyze({ entryPointFile: './testInputs/example4/src/index.ts',
    otherFiles: [] });
var externalPackageApiRef = {
    scopeName: '',
    packageName: 'es6-collections',
    exportName: '',
    memberName: ''
};
// Normally warnings are kept by the ApiItem data structure,
// and written to the '*.api.ts' file.
var warnings = [];
var apiDefinitionRef = ApiDefinitionReference_1.default.createFromParts(externalPackageApiRef);
var apiFileGenerator = new ApiFileGenerator_1.default();
apiFileGenerator.writeApiFile('./lib/DebugRun.api.ts', extractor);
var apiJsonGenerator = new ApiJsonGenerator_1.default();
apiJsonGenerator.writeJsonFile('./lib/DebugRun.json', extractor);
console.log('DebugRun completed.');

//# sourceMappingURL=DebugRun.js.map
