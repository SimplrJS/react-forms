"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="mocha" />
var chai_1 = require("chai");
var ts = require("typescript");
var fsx = require("fs-extra");
var path = require("path");
var Extractor_1 = require("../../Extractor");
var ApiFileGenerator_1 = require("../../generators/ApiFileGenerator");
/* tslint:disable:no-function-expression - Mocha uses a poorly scoped "this" pointer */
function assertFileMatchesExpected(actualFilename, expectedFilename) {
    var actualContent = fsx.readFileSync(actualFilename).toString('utf8');
    var expectedContent = fsx.readFileSync(expectedFilename).toString('utf8');
    chai_1.assert(ApiFileGenerator_1.default.areEquivalentApiFileContents(actualContent, expectedContent), 'The file content does not match the expected value:'
        + '\nEXPECTED: ' + expectedFilename
        + '\nACTUAL: ' + actualFilename);
}
var capturedErrors = [];
function testErrorHandler(message, fileName, lineNumber) {
    capturedErrors.push({ message: message, fileName: fileName, lineNumber: lineNumber });
}
function assertCapturedErrors(expectedMessages) {
    chai_1.assert.deepEqual(capturedErrors.map(function (x) { return x.message; }), expectedMessages, 'The captured errors did not match the expected output.');
}
describe('ApiFileGenerator tests', function () {
    this.timeout(10000);
    describe('Basic Tests', function () {
        it('Example 1', function () {
            var inputFolder = './testInputs/example1';
            var outputFile = './lib/example1-output.api.ts';
            var expectedFile = path.join(inputFolder, 'example1-output.api.ts');
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
            extractor.analyze({
                entryPointFile: path.join(inputFolder, 'index.ts')
            });
            var apiFileGenerator = new ApiFileGenerator_1.default();
            apiFileGenerator.writeApiFile(outputFile, extractor);
            assertFileMatchesExpected(outputFile, expectedFile);
            /**
             * Errors can be found in testInputs/folder/MyClass
             */
            assertCapturedErrors([
                'The JSDoc tag "@badAedocTag" is not supported by AEDoc',
                'Unexpected text in AEDoc comment: "(Error #1 is the bad tag) Text can no..."'
            ]);
        });
        it('Example 2', function () {
            var inputFolder = './testInputs/example2';
            var outputFile = './lib/example2-output.api.ts';
            var expectedFile = path.join(inputFolder, 'example2-output.api.ts');
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
            extractor.analyze({
                entryPointFile: path.join(inputFolder, 'src/index.ts')
            });
            var apiFileGenerator = new ApiFileGenerator_1.default();
            apiFileGenerator.writeApiFile(outputFile, extractor);
            assertFileMatchesExpected(outputFile, expectedFile);
        });
        it('Example 4', function () {
            capturedErrors = [];
            var inputFolder = './testInputs/example4';
            var outputFile = './lib/example4-output.api.ts';
            var expectedFile = path.join(inputFolder, 'example4-output.api.ts');
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
            extractor.analyze({
                entryPointFile: path.join(inputFolder, 'src/index.ts')
            });
            var apiFileGenerator = new ApiFileGenerator_1.default();
            apiFileGenerator.writeApiFile(outputFile, extractor);
            assertFileMatchesExpected(outputFile, expectedFile);
            chai_1.assert.equal(capturedErrors.length, 0);
        });
    });
});

//# sourceMappingURL=ApiFileGenerator.test.js.map
