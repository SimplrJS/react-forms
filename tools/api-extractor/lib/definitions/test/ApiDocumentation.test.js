"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="mocha" />
var chai_1 = require("chai");
var ts = require("typescript");
var path = require("path");
var Extractor_1 = require("../../Extractor");
var ApiDocumentation_1 = require("../ApiDocumentation");
/* tslint:disable:no-function-expression - Mocha uses a poorly scoped "this" pointer */
var capturedErrors = [];
function testErrorHandler(message, fileName, lineNumber) {
    capturedErrors.push({ message: message, fileName: fileName, lineNumber: lineNumber });
}
var inputFolder = './testInputs/example2';
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
// Run the analyzer once to be used by unit tests
extractor.analyze({
    entryPointFile: path.join(inputFolder, 'src/index.ts')
});
// These warnings would normally be printed at the bottom
// of the source package's '*.api.ts' file.
var warnings = [];
var myDocumentedClass = extractor.package.getSortedMemberItems()
    .filter(function (apiItem) { return apiItem.name === 'MyDocumentedClass'; })[0];
describe('ApiDocumentation tests', function () {
    this.timeout(10000);
    describe('ApiDocumentation internal methods', function () {
        var apiDoc = new ApiDocumentation_1.default('Some summary\n@remarks and some remarks\n@public', extractor.docItemLoader, extractor, console.log, warnings);
    });
    describe('Documentation Parser Tests', function () {
        it('Should report errors', function () {
            /**
             * To view the expected errors see:
             * - testInputs/example2/folder/MyDocumentedClass (10  errors)
             */
            chai_1.assert.equal(capturedErrors.length, 8);
            chai_1.assert.equal(capturedErrors[0].message, 'A summary block is not allowed here, because the @inheritdoc'
                + ' target provides the summary');
            chai_1.assert.equal(capturedErrors[1].message, 'The JSDoc tag "@badAedocTag" is not supported by AEDoc');
            chai_1.assert.equal(capturedErrors[2].message, 'Invalid call to _tokenizeInline()');
            chai_1.assert.equal(capturedErrors[3].message, 'The {@link} tag must include a URL or API item reference');
            chai_1.assert.equal(capturedErrors[4].message, 'Unexpected text in AEDoc comment: "can not contain a tag"');
            chai_1.assert.equal(capturedErrors[5].message, 'More than one release tag (@alpha, @beta, etc) was specified');
            chai_1.assert.equal(capturedErrors[6].message, 'An API item reference must use the notation:'
                + ' "@scopeName/packageName:exportName.memberName"');
            chai_1.assert.equal(capturedErrors[7].message, 'The @inheritdoc target has been marked as @deprecated.  '
                + 'Add a @deprecated message here, or else remove the @inheritdoc relationship.');
        });
        it('Should parse release tag', function () {
            var expectedReleaseTag = ApiDocumentation_1.ReleaseTag.Public;
            var actualDoc = myDocumentedClass ? myDocumentedClass.documentation : undefined;
            chai_1.assert.isObject(actualDoc);
            chai_1.assert.equal(actualDoc.releaseTag, expectedReleaseTag);
        });
    });
});

//# sourceMappingURL=ApiDocumentation.test.js.map
