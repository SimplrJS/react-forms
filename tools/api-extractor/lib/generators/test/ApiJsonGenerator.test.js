"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="mocha" />
var ts = require("typescript");
var path = require("path");
var Extractor_1 = require("../../Extractor");
var ApiJsonGenerator_1 = require("../../generators/ApiJsonGenerator");
var TestFileComparer_1 = require("../../TestFileComparer");
/* tslint:disable:no-function-expression - Mocha uses a poorly scoped "this" pointer */
var capturedErrors = [];
function testErrorHandler(message, fileName, lineNumber) {
    capturedErrors.push({ message: message, fileName: fileName, lineNumber: lineNumber });
}
describe('ApiJsonGenerator tests', function () {
    this.timeout(10000);
    describe('Basic Tests', function () {
        it('Example 1', function () {
            var inputFolder = './testInputs/example1';
            var outputFile = './lib/example1-output.json';
            var expectedFile = path.join(inputFolder, 'example1-output.json');
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
                entryPointFile: path.join(inputFolder, 'index.ts')
            });
            var apiJsonGenerator = new ApiJsonGenerator_1.default();
            apiJsonGenerator.writeJsonFile(outputFile, extractor);
            TestFileComparer_1.default.assertFileMatchesExpected(outputFile, expectedFile);
        });
        it('Example 2', function () {
            var inputFolder = './testInputs/example2';
            var outputFile = './lib/example2-output.json';
            var expectedFile = path.join(inputFolder, 'example2-output.json');
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
                entryPointFile: path.join(inputFolder, 'src/index.ts')
            });
            var apiJsonGenerator = new ApiJsonGenerator_1.default();
            apiJsonGenerator.writeJsonFile(outputFile, extractor);
            TestFileComparer_1.default.assertFileMatchesExpected(outputFile, expectedFile);
        });
        it('Example 4', function () {
            var inputFolder = './testInputs/example4';
            var outputFile = './lib/example4-output.json';
            var expectedFile = path.join(inputFolder, 'example4-output.json');
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
                entryPointFile: path.join(inputFolder, 'src/index.ts')
            });
            var apiJsonGenerator = new ApiJsonGenerator_1.default();
            apiJsonGenerator.writeJsonFile(outputFile, extractor);
            TestFileComparer_1.default.assertFileMatchesExpected(outputFile, expectedFile);
        });
    });
});

//# sourceMappingURL=ApiJsonGenerator.test.js.map
