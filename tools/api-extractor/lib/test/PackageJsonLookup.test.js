"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="mocha" />
/* tslint:disable:no-function-expression - Mocha uses a poorly scoped "this" pointer */
var chai_1 = require("chai");
var path = require("path");
var PackageJsonLookup_1 = require("../PackageJsonLookup");
describe('PackageJsonLookup', function () {
    describe('basic tests', function () {
        it('readPackageName() test', function () {
            var packageJsonLookup = new PackageJsonLookup_1.default();
            var sourceFilePath = path.join(__dirname, '../../testInputs/example1');
            chai_1.assert.equal(packageJsonLookup.readPackageName(sourceFilePath), 'example1');
        });
        it('tryFindPackagePathUpwards() test', function () {
            var packageJsonLookup = new PackageJsonLookup_1.default();
            var sourceFilePath = path.join(__dirname, '../../testInputs/example1/folder/AliasClass.ts');
            // Example: C:\web-build-tools\libraries\api-extractor\testInputs\example1
            var foundPath = packageJsonLookup.tryFindPackagePathUpwards(sourceFilePath);
            chai_1.assert.isTrue(foundPath.search(/[\\/]example1$/i) >= 0, 'Unexpected result: ' + foundPath);
        });
    });
});

//# sourceMappingURL=PackageJsonLookup.test.js.map
