"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="mocha" />
var chai_1 = require("chai");
var ApiDefinitionReference_1 = require("../ApiDefinitionReference");
/* tslint:disable:no-function-expression - Mocha uses a poorly scoped "this" pointer */
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
describe('ApiDocumentation tests', function () {
    this.timeout(10000);
    describe('ApiDocumentation internal methods', function () {
        var apiReferenceExpr;
        var actual;
        it('_parseApiReferenceExpression() with scope name', function () {
            apiReferenceExpr = '@microsoft/sp-core-library:Guid';
            actual = ApiDefinitionReference_1.default.createFromString(apiReferenceExpr, console.log);
            chai_1.assert.equal('@microsoft', actual.scopeName);
            chai_1.assert.equal('sp-core-library', actual.packageName);
            chai_1.assert.equal('Guid', actual.exportName);
            chai_1.assert.equal('', actual.memberName);
        });
        it('_parseApiReferenceExpression() without scope name', function () {
            apiReferenceExpr = 'sp-core-library:Guid';
            actual = ApiDefinitionReference_1.default.createFromString(apiReferenceExpr, console.log);
            chai_1.assert.equal('', actual.scopeName);
            chai_1.assert.equal('sp-core-library', actual.packageName);
            chai_1.assert.equal('Guid', actual.exportName);
            chai_1.assert.equal('', actual.memberName);
        });
        it('_parseApiReferenceExpression() without scope name and with member name', function () {
            apiReferenceExpr = 'sp-core-library:Guid.equals';
            actual = ApiDefinitionReference_1.default.createFromString(apiReferenceExpr, console.log);
            chai_1.assert.equal('', actual.scopeName);
            chai_1.assert.equal('sp-core-library', actual.packageName);
            chai_1.assert.equal('Guid', actual.exportName);
            chai_1.assert.equal('equals', actual.memberName);
        });
        it('_parseApiReferenceExpression() without scope name and invalid memberName', function () {
            clearCapturedErrors();
            // This won't raise an error (based on our current decision to only show warnings in the *.api.ts
            // files if we can't find a reference)
            apiReferenceExpr = 'sp-core-library:Guid:equals';
            actual = ApiDefinitionReference_1.default.createFromString(apiReferenceExpr, console.log);
            assertCapturedErrors([]);
        });
    });
});

//# sourceMappingURL=ApiDefinitionReference.test.js.map
