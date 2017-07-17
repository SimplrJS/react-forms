"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="mocha" />
var chai_1 = require("chai");
var ts = require("typescript");
var path = require("path");
var DocElementParser_1 = require("../DocElementParser");
var TestFileComparer_1 = require("../TestFileComparer");
var JsonFile_1 = require("../JsonFile");
var ApiDocumentation_1 = require("../definitions/ApiDocumentation");
var Extractor_1 = require("./../Extractor");
var Tokenizer_1 = require("./../Tokenizer");
var capturedErrors = [];
function testErrorHandler(message, fileName, lineNumber) {
    capturedErrors.push({ message: message, fileName: fileName, lineNumber: lineNumber });
}
function clearCapturedErrors() {
    capturedErrors = [];
}
function assertCapturedErrors(expectedMessages) {
    chai_1.assert.deepEqual(capturedErrors.map(function (x) { return x.message; }), expectedMessages, 'The captured errors did not match the expected output.');
}
var inputFolder = './testInputs/example2';
var myDocumentedClass;
var compilerOptions = {
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    rootDir: inputFolder
};
var extractor = new Extractor_1.default({
    compilerOptions: compilerOptions,
    errorHandler: testErrorHandler
});
// These warnings would normally be printed at the bottom
// of the source package's '*.api.ts' file.
var warnings = [];
/**
 * Dummy class wrapping ApiDocumentation to test its protected methods
 */
var TestApiDocumentation = (function (_super) {
    __extends(TestApiDocumentation, _super);
    function TestApiDocumentation() {
        return _super.call(this, 'Some summary\n@remarks and some remarks\n@public', extractor.docItemLoader, extractor, console.log, warnings) || this;
    }
    TestApiDocumentation.prototype.parseParam = function (tokenizer) {
        return this._parseParam(tokenizer);
    };
    return TestApiDocumentation;
}(ApiDocumentation_1.default));
extractor.loadExternalPackages('./testInputs/external-api-json');
// Run the analyze method once to be used by unit tests
extractor.analyze({
    entryPointFile: path.join(inputFolder, 'src/index.ts')
});
myDocumentedClass = extractor.package.getSortedMemberItems()
    .filter(function (apiItem) { return apiItem.name === 'MyDocumentedClass'; })[0];
describe('DocElementParser tests', function () {
    this.timeout(10000);
    describe('Basic Tests', function () {
        it('Should parse basic doc comment stream', function () {
            clearCapturedErrors();
            var apiDoc = new TestApiDocumentation();
            var docs = 'This function parses docTokens for the apiLint website ' +
                '{@link https://github.com/OfficeDev/office-ui-fabric-react} \n' +
                '@returns an object \n' +
                '@param param1 - description of the type param1 \n' +
                '@param param2 - description of the type param2 \n' +
                '@internal';
            var tokenizer = new Tokenizer_1.default(docs, console.log);
            // Testing Summary Doc Elements
            var expectedSummary = [
                { kind: 'textDocElement', value: 'This function parses docTokens for the apiLint website' },
                {
                    kind: 'linkDocElement',
                    referenceType: 'href',
                    targetUrl: 'https://github.com/OfficeDev/office-ui-fabric-react',
                    value: 'https://github.com/OfficeDev/office-ui-fabric-react'
                }
            ];
            var actualSummary = DocElementParser_1.default.parse(myDocumentedClass.documentation, tokenizer);
            JsonFile_1.default.saveJsonFile('./lib/basicDocExpected.json', JSON.stringify(expectedSummary));
            JsonFile_1.default.saveJsonFile('./lib/basicDocActual.json', JSON.stringify(actualSummary));
            TestFileComparer_1.default.assertFileMatchesExpected('./lib/basicDocActual.json', './lib/basicDocExpected.json');
            // Testing Returns Doc Elements
            var expectedReturn = [
                { kind: 'textDocElement', value: 'an object' }
            ];
            tokenizer.getToken();
            var actualReturn = DocElementParser_1.default.parse(myDocumentedClass.documentation, tokenizer);
            JsonFile_1.default.saveJsonFile('./lib/returnDocExpected.json', JSON.stringify(expectedReturn));
            JsonFile_1.default.saveJsonFile('./lib/returnDocActual.json', JSON.stringify(actualReturn));
            TestFileComparer_1.default.assertFileMatchesExpected('./lib/returnDocActual.json', './lib/returnDocExpected.json');
            // Testing Params Doc Elements
            var expectedParam = [
                {
                    name: 'param1',
                    description: [{ kind: 'textDocElement', value: 'description of the type param1' }]
                },
                {
                    name: 'param2',
                    description: [{ kind: 'textDocElement', value: 'description of the type param2' }]
                }
            ];
            var actualParam = [];
            tokenizer.getToken();
            actualParam.push(apiDoc.parseParam(tokenizer));
            tokenizer.getToken();
            actualParam.push(apiDoc.parseParam(tokenizer));
            JsonFile_1.default.saveJsonFile('./lib/paramDocExpected.json', JSON.stringify(expectedParam));
            JsonFile_1.default.saveJsonFile('./lib/paramDocActual.json', JSON.stringify(actualParam));
            TestFileComparer_1.default.assertFileMatchesExpected('./lib/paramDocActual.json', './lib/paramDocExpected.json');
            assertCapturedErrors([]);
        });
        it('Should parse @deprecated correctly', function () {
            clearCapturedErrors();
            var docs = '@deprecated - description of the deprecation';
            var tokenizer = new Tokenizer_1.default(docs, console.log);
            // Testing Deprecated Doc Elements
            var expectedDeprecated = [
                { kind: 'textDocElement', value: '- description of the deprecation' }
            ];
            tokenizer.getToken();
            var actualDeprecated = DocElementParser_1.default.parse(myDocumentedClass.documentation, tokenizer);
            JsonFile_1.default.saveJsonFile('./lib/deprecatedDocExpected.json', JSON.stringify(expectedDeprecated));
            JsonFile_1.default.saveJsonFile('./lib/deprecatedDocActual.json', JSON.stringify(actualDeprecated));
            TestFileComparer_1.default.assertFileMatchesExpected('./lib/deprecatedDocActual.json', './lib/deprecatedDocExpected.json');
            assertCapturedErrors([]);
        });
        it('Should parse @see with nested link and/or text', function () {
            clearCapturedErrors();
            var docs = 'Text describing the function’s purpose/nuances/context. \n' +
                '@see {@link https://github.com/OfficeDev/office-ui-fabric-react | The link will provide context}';
            var tokenizer = new Tokenizer_1.default(docs, console.log);
            // Testing Summary Elements
            var expectedSummary = [
                { kind: 'textDocElement', value: 'Text describing the function’s purpose/nuances/context.' },
                {
                    kind: 'seeDocElement',
                    seeElements: [
                        {
                            kind: 'linkDocElement',
                            referenceType: 'href',
                            targetUrl: 'https://github.com/OfficeDev/office-ui-fabric-react',
                            value: 'The link will provide context'
                        }
                    ]
                }
            ];
            var actualSummary = DocElementParser_1.default.parse(myDocumentedClass.documentation, tokenizer);
            JsonFile_1.default.saveJsonFile('./lib/seeDocExpected.json', JSON.stringify(expectedSummary));
            JsonFile_1.default.saveJsonFile('./lib/seeDocActual.json', JSON.stringify(actualSummary));
            TestFileComparer_1.default.assertFileMatchesExpected('./lib/seeDocExpected.json', './lib/seeDocActual.json');
            assertCapturedErrors([]);
        });
        it('Should parse @param with nested link and/or text', function () {
            clearCapturedErrors();
            var apiDoc = new TestApiDocumentation();
            // Don't include the "@param" in the doc string, parseParam() expects this to be processed in a
            // previous step.
            var docs = 'x - The height in {@link http://wikipedia.org/pixel_units}';
            var tokenizer = new Tokenizer_1.default(docs, console.log);
            // Testing Param Doc Elements
            var description = [
                { kind: 'textDocElement', value: 'The height in' },
                {
                    kind: 'linkDocElement',
                    referenceType: 'href',
                    targetUrl: 'http://wikipedia.org/pixel_units',
                    value: 'http://wikipedia.org/pixel_units'
                }
            ];
            var expectedParam = {
                name: 'x',
                description: description
            };
            var actualParam = apiDoc.parseParam(tokenizer);
            JsonFile_1.default.saveJsonFile('./lib/nestedParamDocExpected.json', JSON.stringify(expectedParam));
            JsonFile_1.default.saveJsonFile('./lib/nestedParamDocActual.json', JSON.stringify(actualParam));
            TestFileComparer_1.default.assertFileMatchesExpected('./lib/nestedParamDocActual.json', './lib/nestedParamDocExpected.json');
            assertCapturedErrors([]);
        });
        it('Should parse @link with URL', function () {
            clearCapturedErrors();
            var docs = '{@link https://microsoft.com}';
            var tokenizer = new Tokenizer_1.default(docs, console.log);
            var docElements;
            /* tslint:disable-next-line:no-any */
            var errorMessage;
            try {
                docElements = DocElementParser_1.default.parse(myDocumentedClass.documentation, tokenizer);
            }
            catch (error) {
                errorMessage = error;
            }
            chai_1.assert.isUndefined(errorMessage);
            var linkDocElement = docElements[0];
            chai_1.assert.equal(linkDocElement.referenceType, 'href');
            chai_1.assert.equal(linkDocElement.targetUrl, 'https://microsoft.com');
            chai_1.assert.equal(linkDocElement.value, 'https://microsoft.com');
            assertCapturedErrors([]);
        });
        it('Should parse @link with URL and text', function () {
            clearCapturedErrors();
            var docs = '{@link https://microsoft.com | microsoft home}';
            var tokenizer = new Tokenizer_1.default(docs, console.log);
            var docElements;
            /* tslint:disable-next-line:no-any */
            var errorMessage;
            try {
                docElements = DocElementParser_1.default.parse(myDocumentedClass.documentation, tokenizer);
            }
            catch (error) {
                errorMessage = error;
            }
            chai_1.assert.isUndefined(errorMessage);
            var linkDocElement = docElements[0];
            chai_1.assert.equal(linkDocElement.referenceType, 'href');
            chai_1.assert.equal(linkDocElement.targetUrl, 'https://microsoft.com');
            chai_1.assert.equal(linkDocElement.value, 'microsoft home');
            assertCapturedErrors([]);
        });
        it('Should reject @link with missing pipe', function () {
            clearCapturedErrors();
            var docs = '{@link https://microsoft.com microsoft home}';
            var tokenizer = new Tokenizer_1.default(docs, console.log);
            var docElements;
            /* tslint:disable-next-line:no-any */
            var errorMessage;
            try {
                docElements = DocElementParser_1.default.parse(myDocumentedClass.documentation, tokenizer);
            }
            catch (error) {
                errorMessage = error;
            }
            chai_1.assert.isUndefined(errorMessage);
            assertCapturedErrors(['The {@link} tag contains additional spaces after the URL; if the URL'
                    + ' contains spaces, encode them using %20; for display text, use a pipe delimiter ("|")']);
        });
        it('Should reject @link with bad display text character', function () {
            clearCapturedErrors();
            var docs = '{@link https://example.com | Ex@ample}';
            var tokenizer = new Tokenizer_1.default(docs, console.log);
            var docElements;
            /* tslint:disable-next-line:no-any */
            var errorMessage;
            try {
                docElements = DocElementParser_1.default.parse(myDocumentedClass.documentation, tokenizer);
            }
            catch (error) {
                errorMessage = error;
            }
            chai_1.assert.isUndefined(errorMessage);
            assertCapturedErrors(['The {@link} tag\'s display text contains an unsupported character: "@"']);
        });
        it('Should parse @link with API definition reference', function () {
            clearCapturedErrors();
            var docs = '{@link @microsoft/sp-core-library:Guid.equals}';
            var tokenizer = new Tokenizer_1.default(docs, console.log);
            var docElements;
            /* tslint:disable-next-line:no-any */
            var errorMessage;
            try {
                docElements = DocElementParser_1.default.parse(myDocumentedClass.documentation, tokenizer);
            }
            catch (error) {
                errorMessage = error;
            }
            chai_1.assert.isUndefined(errorMessage);
            var linkDocElement = docElements[0];
            chai_1.assert.equal(linkDocElement.referenceType, 'code');
            chai_1.assert.equal(linkDocElement.scopeName, '@microsoft');
            chai_1.assert.equal(linkDocElement.packageName, 'sp-core-library');
            chai_1.assert.equal(linkDocElement.exportName, 'Guid');
            chai_1.assert.equal(linkDocElement.memberName, 'equals');
            assertCapturedErrors([]);
        });
        it('Should parse @link with API defintion reference and text', function () {
            clearCapturedErrors();
            var docs = '{@link @microsoft/sp-core-library:Guid.equals | Guid equals}';
            var tokenizer = new Tokenizer_1.default(docs, console.log);
            var docElements;
            /* tslint:disable-next-line:no-any */
            var errorMessage;
            try {
                docElements = DocElementParser_1.default.parse(myDocumentedClass.documentation, tokenizer);
            }
            catch (error) {
                errorMessage = error;
            }
            chai_1.assert.isUndefined(errorMessage);
            var linkDocElement = docElements[0];
            chai_1.assert.equal(linkDocElement.referenceType, 'code');
            chai_1.assert.equal(linkDocElement.scopeName, '@microsoft');
            chai_1.assert.equal(linkDocElement.packageName, 'sp-core-library');
            chai_1.assert.equal(linkDocElement.exportName, 'Guid');
            chai_1.assert.equal(linkDocElement.memberName, 'equals');
            chai_1.assert.equal(linkDocElement.value, 'Guid equals');
            assertCapturedErrors([]);
        });
        it('Should report errors @link', function () {
            clearCapturedErrors();
            var docs = '{@link @microsoft/sp-core-library:Guid.equals | Guid equals | something}';
            var tokenizer = new Tokenizer_1.default(docs, console.log);
            var docElements;
            /* tslint:disable-next-line:no-any */
            var errorMessage;
            try {
                docElements = DocElementParser_1.default.parse(myDocumentedClass.documentation, tokenizer);
            }
            catch (error) {
                errorMessage = error;
            }
            chai_1.assert.isNotNull(errorMessage);
            assertCapturedErrors(['The {@link} tag contains more than one pipe character ("|")']);
        });
    });
});

//# sourceMappingURL=DocElementParser.test.js.map
