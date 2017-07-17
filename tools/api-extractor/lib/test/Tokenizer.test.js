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
var JsonFile_1 = require("../JsonFile");
var TestFileComparer_1 = require("../TestFileComparer");
var Token_1 = require("../Token");
var Tokenizer_1 = require("../Tokenizer");
/* tslint:disable:no-function-expression - Mocha uses a poorly scoped "this" pointer */
/**
 * Dummy class wrapping Tokenizer to test its protected methods
 */
var TestTokenizer = (function (_super) {
    __extends(TestTokenizer, _super);
    function TestTokenizer(docs, reportError) {
        return _super.call(this, docs, reportError) || this;
    }
    TestTokenizer.prototype.tokenizeDocs = function (docs) {
        return this._tokenizeDocs(docs);
    };
    TestTokenizer.prototype.tokenizeInline = function (docs) {
        return this._tokenizeInline(docs);
    };
    return TestTokenizer;
}(Tokenizer_1.default));
describe('Tokenizer tests', function () {
    this.timeout(10000);
    describe('Tokenizer methods', function () {
        var testTokenizer = new TestTokenizer('', console.log);
        it('tokenizeDocs()', function () {
            var docs = "this is a mock documentation\n @taga hi\r\n @tagb hello @invalid@tag email@domain.com\n        @tagc this is {   @inlineTag param1  param2   } and this is {just curly braces}";
            var expectedTokens = [
                new Token_1.default(Token_1.TokenType.Text, '', 'this is a mock documentation'),
                new Token_1.default(Token_1.TokenType.BlockTag, '@taga'),
                new Token_1.default(Token_1.TokenType.Text, '', 'hi'),
                new Token_1.default(Token_1.TokenType.BlockTag, '@tagb'),
                new Token_1.default(Token_1.TokenType.Text, '', 'hello @invalid@tag email@domain.com'),
                new Token_1.default(Token_1.TokenType.BlockTag, '@tagc'),
                new Token_1.default(Token_1.TokenType.Text, '', 'this is'),
                new Token_1.default(Token_1.TokenType.Text, '', 'and this is {just curly braces}')
            ];
            var actualTokens = testTokenizer.tokenizeDocs(docs);
            JsonFile_1.default.saveJsonFile('./lib/tokenizeDocsExpected.json', JSON.stringify(expectedTokens));
            JsonFile_1.default.saveJsonFile('./lib/tokenizeDocsActual.json', JSON.stringify(actualTokens));
            TestFileComparer_1.default.assertFileMatchesExpected('./lib/tokenizeDocsActual.json', './lib/tokenizeDocsExpected.json');
        });
        it('tokenizeInline()', function () {
            var token = '{    @link   https://bing.com  |  Bing  }';
            var expectedToken = new Token_1.default(Token_1.TokenType.InlineTag, '@link', 'https://bing.com | Bing');
            var actualToken = testTokenizer.tokenizeInline(token);
            chai_1.assert.equal(expectedToken.type, actualToken.type);
            chai_1.assert.equal(expectedToken.tag, actualToken.tag);
            chai_1.assert.equal(expectedToken.text, actualToken.text);
        });
    });
});

//# sourceMappingURL=Tokenizer.test.js.map
