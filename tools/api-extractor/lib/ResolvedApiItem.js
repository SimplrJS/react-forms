"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var ApiDocumentation_1 = require("./definitions/ApiDocumentation");
var ApiJsonFile_1 = require("./generators/ApiJsonFile");
/**
 * A class to abstract away the difference between an item from our public API that could be
 * represented by either an ApiItem or an IDocItem that is retrieved from a JSON file.
 */
var ResolvedApiItem = (function () {
    function ResolvedApiItem(kind, summary, remarks, deprecatedMessage, isBeta, params, returnsMessage, releaseTag, apiItem) {
        this.kind = kind;
        this.summary = summary;
        this.remarks = remarks;
        this.deprecatedMessage = deprecatedMessage;
        this.isBeta = isBeta;
        this.params = params;
        this.returnsMessage = returnsMessage;
        this.releaseTag = releaseTag;
        this.apiItem = apiItem;
    }
    /**
     * A function to abstract the construction of a ResolvedApiItem instance
     * from an ApiItem.
     */
    ResolvedApiItem.createFromApiItem = function (apiItem) {
        return new ResolvedApiItem(apiItem.kind, apiItem.documentation.summary, apiItem.documentation.remarks, apiItem.documentation.deprecatedMessage, apiItem.documentation.releaseTag === ApiDocumentation_1.ReleaseTag.Beta, apiItem.documentation.parameters, apiItem.documentation.returnsMessage, apiItem.documentation.releaseTag, apiItem);
    };
    /**
     * A function to abstract the construction of a ResolvedApiItem instance
     * from a JSON object that symbolizes an IDocItem.
     */
    ResolvedApiItem.createFromJson = function (docItem) {
        var parameters = undefined;
        var returnsMessage = undefined;
        switch (docItem.kind) {
            case 'function':
                parameters = docItem.parameters;
                returnsMessage = docItem.returnValue.description;
                break;
            case 'method':
                parameters = docItem.parameters;
                returnsMessage = docItem.returnValue.description;
                break;
            default:
                break;
        }
        return new ResolvedApiItem(ApiJsonFile_1.default.convertJsonToKind(docItem.kind), docItem.summary, docItem.remarks, docItem.deprecatedMessage, docItem.isBeta, parameters, returnsMessage, ApiDocumentation_1.ReleaseTag.Public, undefined);
    };
    return ResolvedApiItem;
}());
exports.default = ResolvedApiItem;

//# sourceMappingURL=ResolvedApiItem.js.map
