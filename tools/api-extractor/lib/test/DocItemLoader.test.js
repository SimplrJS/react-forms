"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="mocha" />
var chai_1 = require("chai");
var ts = require("typescript");
var path = require("path");
var Extractor_1 = require("../Extractor");
var TestFileComparer_1 = require("../TestFileComparer");
var ApiJsonGenerator_1 = require("../generators/ApiJsonGenerator");
var ApiFileGenerator_1 = require("../generators/ApiFileGenerator");
/* tslint:disable:no-function-expression - Mocha uses a poorly scoped "this" pointer */
var capturedErrors = [];
function testErrorHandler(message, fileName, lineNumber) {
    capturedErrors.push({ message: message, fileName: fileName, lineNumber: lineNumber });
}
function assertCapturedErrors(expectedMessages) {
    chai_1.assert.deepEqual(capturedErrors.map(function (x) { return x.message; }), expectedMessages, 'The captured errors did not match the expected output.');
}
// These warnings would normally be printed at the bottom
// of the source package's '*.api.ts' file.
var warnings = [];
describe('DocItemLoader tests', function () {
    this.timeout(10000);
    describe('Basic Tests', function () {
        it('Example 3', function () {
            var inputFolder = './testInputs/example3';
            var outputJsonFile = './lib/example3-output.json';
            var outputApiFile = './lib/example3-output.api.ts';
            var expectedJsonFile = path.join(inputFolder, 'example3-output.json');
            var expectedApiFile = path.join(inputFolder, 'example3-output.api.ts');
            var compilerOptions = {
                target: ts.ScriptTarget.ES5,
                module: ts.ModuleKind.CommonJS,
                moduleResolution: ts.ModuleResolutionKind.NodeJs,
                rootDir: inputFolder,
                typeRoots: ['./'] // We need to ignore @types in these tests
            };
            var extractor = new Extractor_1.default({
                compilerOptions: compilerOptions,
                errorHandler: testErrorHandler
            });
            extractor.loadExternalPackages('./testInputs/external-api-json');
            extractor.analyze({
                entryPointFile: './testInputs/example3/src/index.ts'
            });
            var apiJsonGenerator = new ApiJsonGenerator_1.default();
            apiJsonGenerator.writeJsonFile(outputJsonFile, extractor);
            // This is one error whose output is only visible in the form
            // of a 'warning' message in the 'example3-output.api.ts' file.
            // 'Unable to find referenced member \"MyClass.methodWithTwoParams\"' is the message
            // that should appear.
            var apiFileGenerator = new ApiFileGenerator_1.default();
            apiFileGenerator.writeApiFile(outputApiFile, extractor);
            assertCapturedErrors([
                'circular reference',
                'The {@link} tag references an @internal or @alpha API item,'
                    + ' which will not appear in the generated documentation'
            ]);
            TestFileComparer_1.default.assertFileMatchesExpected(outputJsonFile, expectedJsonFile);
            TestFileComparer_1.default.assertFileMatchesExpected(outputApiFile, expectedApiFile);
        });
    });
});

//# sourceMappingURL=DocItemLoader.test.js.map
