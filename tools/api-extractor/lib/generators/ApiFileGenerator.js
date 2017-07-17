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
var fs = require("fs");
var ApiItem_1 = require("../definitions/ApiItem");
var ApiItemVisitor_1 = require("../ApiItemVisitor");
var ApiPackage_1 = require("../definitions/ApiPackage");
var IndentedWriter_1 = require("../IndentedWriter");
var ApiDocumentation_1 = require("../definitions/ApiDocumentation");
/**
 * For a library such as "example-package", ApiFileGenerator generates the "example-package.api.ts"
 * report which is used to detect API changes.  The output is pseudocode whose syntax is similar
 * but not identical to a "*.d.ts" typings file.  The output file is designed to be committed to
 * Git with a branch policy that will trigger an API review workflow whenever the file contents
 * have changed.  For example, the API file indicates *whether* a class has been documented,
 * but it does not include the documentation text (since minor text changes should not require
 * an API review).
 *
 * @public
 */
var ApiFileGenerator = (function (_super) {
    __extends(ApiFileGenerator, _super);
    function ApiFileGenerator() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._indentedWriter = new IndentedWriter_1.default();
        return _this;
    }
    /**
     * Compares the contents of two API files that were created using ApiFileGenerator,
     * and returns true if they are equivalent.  Note that these files are not normally edited
     * by a human; the "equivalence" comparison here is intended to ignore spurious changes that
     * might be introduced by a tool, e.g. Git newline normalization or an editor that strips
     * whitespace when saving.
     */
    ApiFileGenerator.areEquivalentApiFileContents = function (actualFileContent, expectedFileContent) {
        // NOTE: "\s" also matches "\r" and "\n"
        var normalizedActual = actualFileContent.replace(/[\s]+/g, ' ');
        var normalizedExpected = expectedFileContent.replace(/[\s]+/g, ' ');
        return normalizedActual === normalizedExpected;
    };
    /**
     * Generates the report and writes it to disk.
     *
     * @param reportFilename - The output filename
     * @param analyzer       - An Analyzer object representing the input project.
     */
    ApiFileGenerator.prototype.writeApiFile = function (reportFilename, extractor) {
        var fileContent = this.generateApiFileContent(extractor);
        fs.writeFileSync(reportFilename, fileContent);
    };
    ApiFileGenerator.prototype.generateApiFileContent = function (extractor) {
        this._insideTypeLiteral = 0;
        // Normalize to CRLF
        this.visit(extractor.package);
        var fileContent = this._indentedWriter.toString().replace(/\r?\n/g, '\r\n');
        return fileContent;
    };
    ApiFileGenerator.prototype.visitApiStructuredType = function (apiStructuredType) {
        var _this = this;
        var declarationLine = apiStructuredType.getDeclarationLine();
        if (apiStructuredType.documentation.preapproved) {
            this._indentedWriter.writeLine('// @internal (preapproved)');
            this._indentedWriter.writeLine(declarationLine + ' {');
            this._indentedWriter.writeLine('}');
            return;
        }
        if (apiStructuredType.kind !== ApiItem_1.ApiItemKind.TypeLiteral) {
            this._writeAedocSynopsis(apiStructuredType);
        }
        this._indentedWriter.writeLine(declarationLine + ' {');
        this._indentedWriter.indentScope(function () {
            if (apiStructuredType.kind === ApiItem_1.ApiItemKind.TypeLiteral) {
                // Type literals don't have normal JSDoc.  Write only the warnings,
                // and put them after the '{' since the declaration is nested.
                _this._writeWarnings(apiStructuredType);
            }
            for (var _i = 0, _a = apiStructuredType.getSortedMemberItems(); _i < _a.length; _i++) {
                var member = _a[_i];
                _this.visit(member);
                _this._indentedWriter.writeLine();
            }
        });
        this._indentedWriter.write('}');
    };
    ApiFileGenerator.prototype.visitApiEnum = function (apiEnum) {
        var _this = this;
        this._writeAedocSynopsis(apiEnum);
        this._indentedWriter.writeLine("enum " + apiEnum.name + " {");
        this._indentedWriter.indentScope(function () {
            var members = apiEnum.getSortedMemberItems();
            for (var i = 0; i < members.length; ++i) {
                _this.visit(members[i]);
                _this._indentedWriter.writeLine(i < members.length - 1 ? ',' : '');
            }
        });
        this._indentedWriter.write('}');
    };
    ApiFileGenerator.prototype.visitApiEnumValue = function (apiEnumValue) {
        this._writeAedocSynopsis(apiEnumValue);
        this._indentedWriter.write(apiEnumValue.getDeclarationLine());
    };
    ApiFileGenerator.prototype.visitApiPackage = function (apiPackage) {
        for (var _i = 0, _a = apiPackage.getSortedMemberItems(); _i < _a.length; _i++) {
            var apiItem = _a[_i];
            this.visit(apiItem);
            this._indentedWriter.writeLine();
            this._indentedWriter.writeLine();
        }
        this._writeAedocSynopsis(apiPackage);
    };
    ApiFileGenerator.prototype.visitApiNamespace = function (apiNamespace) {
        var _this = this;
        this._writeAedocSynopsis(apiNamespace);
        // We have decided to call the apiNamespace a 'module' in our
        // public API documentation.
        this._indentedWriter.writeLine("module " + apiNamespace.name + " {");
        this._indentedWriter.indentScope(function () {
            for (var _i = 0, _a = apiNamespace.getSortedMemberItems(); _i < _a.length; _i++) {
                var apiItem = _a[_i];
                _this.visit(apiItem);
                _this._indentedWriter.writeLine();
                _this._indentedWriter.writeLine();
            }
        });
        this._indentedWriter.write('}');
    };
    ApiFileGenerator.prototype.visitApiModuleVariable = function (apiModuleVariable) {
        this._writeAedocSynopsis(apiModuleVariable);
        this._indentedWriter.write(apiModuleVariable.name + ": " + apiModuleVariable.type + " = " + apiModuleVariable.value + ";");
    };
    ApiFileGenerator.prototype.visitApiMember = function (apiMember) {
        if (apiMember.documentation) {
            this._writeAedocSynopsis(apiMember);
        }
        this._indentedWriter.write(apiMember.getDeclarationLine());
        if (apiMember.typeLiteral) {
            this._insideTypeLiteral += 1;
            this.visit(apiMember.typeLiteral);
            this._insideTypeLiteral -= 1;
        }
    };
    ApiFileGenerator.prototype.visitApiFunction = function (apiFunction) {
        this._writeAedocSynopsis(apiFunction);
        this._indentedWriter.write(apiFunction.getDeclarationLine());
    };
    ApiFileGenerator.prototype.visitApiParam = function (apiParam) {
        throw Error('Not Implemented');
    };
    /**
     * Writes a synopsis of the AEDoc comments, which indicates the release tag,
     * whether the item has been documented, and any warnings that were detected
     * by the analysis.
     */
    ApiFileGenerator.prototype._writeAedocSynopsis = function (apiItem) {
        this._writeWarnings(apiItem);
        var lines = [];
        if (apiItem instanceof ApiPackage_1.default && !apiItem.documentation.summary.length) {
            lines.push('(No packageDescription for this package)');
        }
        else {
            var footer = '';
            switch (apiItem.documentation.releaseTag) {
                case ApiDocumentation_1.ReleaseTag.Internal:
                    footer += '@internal';
                    break;
                case ApiDocumentation_1.ReleaseTag.Alpha:
                    footer += '@alpha';
                    break;
                case ApiDocumentation_1.ReleaseTag.Beta:
                    footer += '@beta';
                    break;
                case ApiDocumentation_1.ReleaseTag.Public:
                    footer += '@public';
                    break;
            }
            // deprecatedMessage is initialized by default,
            // this ensures it has contents before adding '@deprecated'
            if (apiItem.documentation.deprecatedMessage.length > 0) {
                if (footer) {
                    footer += ' ';
                }
                footer += '@deprecated';
            }
            // If we are anywhere inside a TypeLiteral, _insideTypeLiteral is greater than 0
            if (this._insideTypeLiteral === 0 && apiItem.needsDocumentation) {
                if (footer) {
                    footer += ' ';
                }
                footer += '(undocumented)';
            }
            if (footer) {
                lines.push(footer);
            }
        }
        this._writeLinesAsComments(lines);
    };
    ApiFileGenerator.prototype._writeWarnings = function (apiItem) {
        var lines = apiItem.warnings.map(function (x) { return 'WARNING: ' + x; });
        this._writeLinesAsComments(lines);
    };
    ApiFileGenerator.prototype._writeLinesAsComments = function (lines) {
        if (lines.length) {
            // Write the lines prefixed by slashes.  If there  are multiple lines, add "//" to each line
            this._indentedWriter.write('// ');
            this._indentedWriter.write(lines.join('\n// '));
            this._indentedWriter.writeLine();
        }
    };
    return ApiFileGenerator;
}(ApiItemVisitor_1.default));
exports.default = ApiFileGenerator;

//# sourceMappingURL=ApiFileGenerator.js.map
