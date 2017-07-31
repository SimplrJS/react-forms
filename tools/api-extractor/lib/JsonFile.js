"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var fsx = require("fs-extra");
var os = require("os");
var jju = require("jju");
var Validator = require("z-schema");
/**
 * Utilities for reading/writing JSON files.
 */
var JsonFile = (function () {
    function JsonFile() {
    }
    JsonFile.validateSchema = function (jsonObject, jsonSchemaObject, errorCallback) {
        // Remove the $schema reference that appears in the configuration object (used for IntelliSense),
        // since we are replacing it with the precompiled version.  The validator.setRemoteReference()
        // API is a better way to handle this, but we'd first need to publish the schema file
        // to a public web server where Visual Studio can find it.
        // tslint:disable-next-line:no-string-literal
        delete jsonSchemaObject['$schema'];
        var validator = new Validator({
            breakOnFirstError: false,
            noTypeless: true
        });
        if (!validator.validate(jsonObject, jsonSchemaObject)) {
            var errorDetails = validator.getLastErrors();
            var buffer = 'JSON schema validation failed:';
            buffer = JsonFile._formatErrorDetails(errorDetails, '  ', buffer);
            errorCallback(buffer);
        }
    };
    JsonFile.loadJsonFile = function (jsonFilename) {
        if (!fsx.existsSync(jsonFilename)) {
            throw new Error("Input file not found: " + jsonFilename);
        }
        var buffer = fsx.readFileSync(jsonFilename);
        try {
            return jju.parse(buffer.toString());
        }
        catch (error) {
            throw new Error("Error reading \"" + jsonFilename + "\":" + os.EOL + ("  " + error.message));
        }
    };
    JsonFile.saveJsonFile = function (jsonFilename, jsonData) {
        JsonFile._validateNoUndefinedMembers(jsonData);
        var stringified = JSON.stringify(jsonData, undefined, 2) + '\n';
        var normalized = JsonFile._getAllReplaced(stringified, '\n', '\r\n');
        fsx.writeFileSync(jsonFilename, normalized);
    };
    /**
     * Used to validate a data structure before writing.  Reports an error if there
     * are any undefined members.
     */
    // tslint:disable-next-line:no-any
    JsonFile._validateNoUndefinedMembers = function (json) {
        if (!json) {
            return;
        }
        if (typeof json === 'object') {
            for (var _i = 0, _a = Object.keys(json); _i < _a.length; _i++) {
                var key = _a[_i];
                // tslint:disable-next-line:no-any
                var value = json[key];
                if (value === undefined) {
                    throw new Error("The key \"" + key + "\" is undefined");
                }
                JsonFile._validateNoUndefinedMembers(value);
            }
        }
    };
    JsonFile._formatErrorDetails = function (errorDetails, indent, buffer) {
        for (var _i = 0, errorDetails_1 = errorDetails; _i < errorDetails_1.length; _i++) {
            var errorDetail = errorDetails_1[_i];
            buffer += os.EOL + indent + ("Error: " + errorDetail.path);
            buffer += os.EOL + indent + ("       " + errorDetail.message);
            if (errorDetail.inner) {
                buffer = JsonFile._formatErrorDetails(errorDetail.inner, indent + '  ', buffer);
            }
        }
        return buffer;
    };
    /**
     * Returns the same thing as targetString.replace(searchValue, replaceValue), except that
     * all matches are replaced, rather than just the first match.
     * @param targetString  The string to be modified
     * @param searchValue   The value to search for
     * @param replaceValue  The replacement text
     */
    JsonFile._getAllReplaced = function (targetString, searchValue, replaceValue) {
        return targetString.split(searchValue).join(replaceValue);
    };
    return JsonFile;
}());
exports.default = JsonFile;

//# sourceMappingURL=JsonFile.js.map
