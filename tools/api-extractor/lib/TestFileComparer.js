"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var fs = require("fs");
/* tslint:disable:no-function-expression - Mocha uses a poorly scoped "this" pointer */
var TestFileComparer = (function () {
    function TestFileComparer() {
    }
    TestFileComparer.assertFileMatchesExpected = function (actualFilename, expectedFilename) {
        var actualContent = fs.readFileSync(actualFilename).toString('utf8');
        var expectedContent = fs.readFileSync(expectedFilename).toString('utf8');
        chai_1.assert(this.areEquivalentFileContents(actualContent, expectedContent), 'The file content does not match the expected value:'
            + '\nEXPECTED: ' + expectedFilename
            + '\nACTUAL: ' + actualFilename);
    };
    /**
     * Compares the contents of two files, and returns true if they are equivalent.
     * Note that these files are not normally edited by a human; the "equivalence"
     * comparison here is intended to ignore spurious changes that might be introduced
     * by a tool, e.g. Git newline normalization or an editor that strips
     * whitespace when saving.
     */
    TestFileComparer.areEquivalentFileContents = function (actualFileContent, expectedFileContent) {
        // NOTE: "\s" also matches "\r" and "\n"
        var normalizedActual = actualFileContent.replace(/[\s]+/g, ' ');
        var normalizedExpected = expectedFileContent.replace(/[\s]+/g, ' ');
        return normalizedActual === normalizedExpected;
    };
    /**
     * Generates the report and writes it to disk.
     * @param reportFilename - The output filename
     * @param value - A string value to be written to file.
     */
    TestFileComparer.writeFile = function (reportFilename, value) {
        var fileContent = this.generateFileContent(value);
        fs.writeFileSync(reportFilename, fileContent);
    };
    TestFileComparer.generateFileContent = function (value) {
        // Normalize to CRLF
        if (!value) {
            throw new Error("Expected non undefined parameter: " + value);
        }
        var fileContent = value.toString().replace(/\r?\n/g, '\r\n');
        return fileContent;
    };
    return TestFileComparer;
}());
exports.default = TestFileComparer;

//# sourceMappingURL=TestFileComparer.js.map
