"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="mocha" />
var chai_1 = require("chai");
var Token_1 = require("../Token");
/* tslint:disable:no-function-expression - Mocha uses a poorly scoped "this" pointer */
describe('Token tests', function () {
    this.timeout(10000);
    describe('Token methods', function () {
        it('constructor()', function () {
            var token;
            token = new Token_1.default(Token_1.TokenType.Text, '', 'Some text');
            chai_1.assert.equal(token.type, Token_1.TokenType.Text);
            chai_1.assert.equal(token.tag, '');
            chai_1.assert.equal(token.text, 'Some text');
            token = new Token_1.default(Token_1.TokenType.BlockTag, '@tagA');
            chai_1.assert.equal(token.type, Token_1.TokenType.BlockTag);
            chai_1.assert.equal(token.tag, '@tagA');
            chai_1.assert.equal(token.text, '');
            token = new Token_1.default(Token_1.TokenType.InlineTag, '@link', 'http://www.microsoft.com');
            chai_1.assert.equal(token.type, Token_1.TokenType.InlineTag);
            chai_1.assert.equal(token.tag, '@link');
            chai_1.assert.equal(token.text, 'http://www.microsoft.com');
        });
        it('RequireType() should raise error', function () {
            var token;
            token = new Token_1.default(Token_1.TokenType.Text, '', 'Some text');
            var errorThrown = false;
            try {
                token.requireType(Token_1.TokenType.Text);
            }
            catch (error) {
                errorThrown = true;
            }
            chai_1.assert.equal(errorThrown, false);
            try {
                token.requireType(Token_1.TokenType.BlockTag);
            }
            catch (error) {
                errorThrown = true;
            }
            chai_1.assert.equal(errorThrown, true);
        });
    });
});

//# sourceMappingURL=Token.test.js.map
