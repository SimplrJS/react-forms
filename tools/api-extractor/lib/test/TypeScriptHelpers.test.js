"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="mocha" />
var chai_1 = require("chai");
var TypeScriptHelpers_1 = require("../TypeScriptHelpers");
describe('TypeScriptHelpers tests', function () {
    describe('splitStringWithRegEx()', function () {
        it('simple case', function () {
            chai_1.assert.deepEqual(TypeScriptHelpers_1.default.splitStringWithRegEx('ABCDaFG', /A/gi), ['A', 'BCD', 'a', 'FG']);
        });
        it('empty match', function () {
            chai_1.assert.deepEqual(TypeScriptHelpers_1.default.splitStringWithRegEx('', /A/gi), []);
        });
    });
    describe('extractCommentContent()', function () {
        it('multi-line comment', function () {
            chai_1.assert.equal(TypeScriptHelpers_1.default.extractCommentContent('/**\n * this is\n * a test\n */\n'), 'this is\na test');
        });
        it('single-line comment', function () {
            chai_1.assert.equal(TypeScriptHelpers_1.default.extractCommentContent('/** single line comment */'), 'single line comment');
        });
        it('degenerate comment', function () {
            chai_1.assert.equal(TypeScriptHelpers_1.default.removeJsdocSequences(['/**', '* degenerate comment', 'star missing here', '* end of comment', '*/']), 'degenerate comment\nstar missing here\nend of comment');
        });
    });
});

//# sourceMappingURL=TypeScriptHelpers.test.js.map
