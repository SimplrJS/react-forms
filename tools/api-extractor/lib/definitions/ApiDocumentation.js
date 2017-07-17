"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var DocElementParser_1 = require("../DocElementParser");
var ApiDefinitionReference_1 = require("../ApiDefinitionReference");
var Token_1 = require("../Token");
var Tokenizer_1 = require("../Tokenizer");
/**
  * A "release tag" is an AEDoc tag which indicates whether an ApiItem definition
  * is considered Public API for third party developers, as well as its release
  * stage (alpha, beta, etc).
  * @see https://onedrive.visualstudio.com/DefaultCollection/SPPPlat/_git/sp-client
  *      ?path=/common/docs/ApiPrinciplesAndProcess.md
  */
var ReleaseTag;
(function (ReleaseTag) {
    /**
     * No release tag was specified in the AEDoc summary.
     */
    ReleaseTag[ReleaseTag["None"] = 0] = "None";
    /**
     * Indicates that an API item is meant only for usage by other NPM packages from the same
     * maintainer. Third parties should never use "internal" APIs. (To emphasize this, their
     * names are prefixed by underscores.)
     */
    ReleaseTag[ReleaseTag["Internal"] = 1] = "Internal";
    /**
     * Indicates that an API item is eventually intended to be public, but currently is in an
     * early stage of development. Third parties should not use "alpha" APIs.
     */
    ReleaseTag[ReleaseTag["Alpha"] = 2] = "Alpha";
    /**
     * Indicates that an API item has been released in an experimental state. Third parties are
     * encouraged to try it and provide feedback. However, a "beta" API should NOT be used
     * in production.
     */
    ReleaseTag[ReleaseTag["Beta"] = 3] = "Beta";
    /**
     * Indicates that an API item has been officially released. It is part of the supported
     * contract (e.g. SemVer) for a package.
     */
    ReleaseTag[ReleaseTag["Public"] = 4] = "Public";
})(ReleaseTag = exports.ReleaseTag || (exports.ReleaseTag = {}));
var ApiDocumentation = (function () {
    function ApiDocumentation(docComment, referenceResolver, extractor, errorLogger, warnings) {
        var _this = this;
        this.reportError = function (message) {
            errorLogger(message);
            _this.failedToParse = true;
        };
        this.originalAedoc = docComment;
        this.referenceResolver = referenceResolver;
        this.extractor = extractor;
        this.reportError = errorLogger;
        this.parameters = {};
        this.warnings = warnings;
        this._parseDocs();
    }
    /**
     * Executes the implementation details involved in completing the documentation initialization.
     * Currently completes link and inheritdocs.
     */
    ApiDocumentation.prototype.completeInitialization = function (warnings) {
        // Ensure links are valid
        this._completeLinks();
        // Ensure inheritdocs are valid
        this._completeInheritdocs(warnings);
    };
    ApiDocumentation.prototype._parseDocs = function () {
        this.summary = [];
        this.returnsMessage = [];
        this.deprecatedMessage = [];
        this.remarks = [];
        this.incompleteLinks = [];
        this.incompleteInheritdocs = [];
        this.releaseTag = ReleaseTag.None;
        var tokenizer = new Tokenizer_1.default(this.originalAedoc, this.reportError);
        this.summary = DocElementParser_1.default.parse(this, tokenizer);
        var releaseTagCount = 0;
        var parsing = true;
        while (parsing) {
            var token = tokenizer.peekToken();
            if (!token) {
                parsing = false; // end of stream
                // Report error if @inheritdoc is deprecated but no @deprecated tag present here
                if (this.isDocInheritedDeprecated && this.deprecatedMessage.length === 0) {
                    // if this documentation inherits docs from a deprecated API item, then
                    // this documentation must either have a deprecated message or it must
                    // not use the @inheritdoc and copy+paste the documentation
                    this.reportError("A deprecation message must be included after the @deprecated tag.");
                }
                break;
            }
            if (token.type === Token_1.TokenType.BlockTag) {
                switch (token.tag) {
                    case '@remarks':
                        tokenizer.getToken();
                        this._checkInheritDocStatus(token.tag);
                        this.remarks = DocElementParser_1.default.parse(this, tokenizer);
                        break;
                    case '@returns':
                        tokenizer.getToken();
                        this._checkInheritDocStatus(token.tag);
                        this.returnsMessage = DocElementParser_1.default.parse(this, tokenizer);
                        break;
                    case '@param':
                        tokenizer.getToken();
                        this._checkInheritDocStatus(token.tag);
                        var param = this._parseParam(tokenizer);
                        if (param) {
                            this.parameters[param.name] = param;
                        }
                        break;
                    case '@deprecated':
                        tokenizer.getToken();
                        this.deprecatedMessage = DocElementParser_1.default.parse(this, tokenizer);
                        if (!this.deprecatedMessage || this.deprecatedMessage.length === 0) {
                            this.reportError("deprecated description required after @deprecated AEDoc tag.");
                        }
                        break;
                    case '@internalremarks':
                        // parse but discard
                        tokenizer.getToken();
                        DocElementParser_1.default.parse(this, tokenizer);
                        break;
                    case '@public':
                        tokenizer.getToken();
                        this.releaseTag = ReleaseTag.Public;
                        ++releaseTagCount;
                        break;
                    case '@internal':
                        tokenizer.getToken();
                        this.releaseTag = ReleaseTag.Internal;
                        ++releaseTagCount;
                        break;
                    case '@alpha':
                        tokenizer.getToken();
                        this.releaseTag = ReleaseTag.Alpha;
                        ++releaseTagCount;
                        break;
                    case '@beta':
                        tokenizer.getToken();
                        this.releaseTag = ReleaseTag.Beta;
                        ++releaseTagCount;
                        break;
                    case '@preapproved':
                        tokenizer.getToken();
                        this.preapproved = true;
                        break;
                    case '@readonly':
                        tokenizer.getToken();
                        this.hasReadOnlyTag = true;
                        break;
                    case '@betadocumentation':
                        tokenizer.getToken();
                        this.isDocBeta = true;
                        break;
                    default:
                        tokenizer.getToken();
                        this._reportBadAedocTag(token);
                }
            }
            else if (token.type === Token_1.TokenType.InlineTag) {
                switch (token.tag) {
                    case '@inheritdoc':
                        DocElementParser_1.default.parse(this, tokenizer);
                        break;
                    case '@link':
                        DocElementParser_1.default.parse(this, tokenizer);
                        break;
                    default:
                        tokenizer.getToken();
                        this._reportBadAedocTag(token);
                        break;
                }
            }
            else if (token.type === Token_1.TokenType.Text) {
                tokenizer.getToken();
                // Shorten "This is too long text" to "This is..."
                var MAX_LENGTH = 40;
                var problemText = token.text.trim();
                if (problemText.length > MAX_LENGTH) {
                    problemText = problemText.substr(0, MAX_LENGTH - 3).trim() + '...';
                }
                this.reportError("Unexpected text in AEDoc comment: \"" + problemText + "\"");
            }
            else {
                tokenizer.getToken();
                // This would be a program bug
                this.reportError("Unexpected token: " + token.type + " " + token.tag + " \"" + token.text + "\"");
            }
        }
        if (releaseTagCount > 1) {
            this.reportError('More than one release tag (@alpha, @beta, etc) was specified');
        }
        if (this.preapproved && this.releaseTag !== ReleaseTag.Internal) {
            this.reportError('The @preapproved tag may only be applied to @internal definitions');
            this.preapproved = false;
        }
    };
    ApiDocumentation.prototype._parseParam = function (tokenizer) {
        var paramDescriptionToken = tokenizer.getToken();
        if (!paramDescriptionToken) {
            this.reportError('The @param tag is missing a parameter description');
            return;
        }
        var hyphenIndex = paramDescriptionToken ? paramDescriptionToken.text.indexOf('-') : -1;
        if (hyphenIndex < 0) {
            this.reportError('The @param tag is missing the hyphen that delimits the parameter name '
                + ' and description');
            return;
        }
        else {
            var name_1 = paramDescriptionToken.text.slice(0, hyphenIndex).trim();
            var comment = paramDescriptionToken.text.substr(hyphenIndex + 1).trim();
            if (!comment) {
                this.reportError('The @param tag is missing a parameter description');
                return;
            }
            var commentTextElement = DocElementParser_1.default.makeTextElement(comment);
            // Full param description may contain additional Tokens (Ex: @link)
            var remainingElements = DocElementParser_1.default.parse(this, tokenizer);
            var descriptionElements = [commentTextElement].concat(remainingElements);
            var paramDocElement = {
                name: name_1,
                description: descriptionElements
            };
            return paramDocElement;
        }
    };
    /**
     * A processing of linkDocElements that refer to an ApiDefinitionReference. This method
     * ensures that the reference is to an API item that is not 'Internal'.
     */
    ApiDocumentation.prototype._completeLinks = function () {
        while (this.incompleteLinks.length) {
            var codeLink = this.incompleteLinks.pop();
            var parts = {
                scopeName: codeLink.scopeName,
                packageName: codeLink.packageName,
                exportName: codeLink.exportName,
                memberName: codeLink.memberName
            };
            var apiDefinitionRef = ApiDefinitionReference_1.default.createFromParts(parts);
            var resolvedApiItem = this.referenceResolver.resolve(apiDefinitionRef, this.extractor.package, this.warnings);
            // If the apiDefinitionRef can not be found the resolvedApiItem will be
            // undefined and an error will have been reported via this.reportError
            if (resolvedApiItem) {
                if (resolvedApiItem.releaseTag === ReleaseTag.Internal
                    || resolvedApiItem.releaseTag === ReleaseTag.Alpha) {
                    this.reportError('The {@link} tag references an @internal or @alpha API item, '
                        + 'which will not appear in the generated documentation');
                }
            }
        }
    };
    /**
     * A processing of inheritdoc 'Tokens'. This processing occurs after we have created documentation
     * for all API items.
     */
    ApiDocumentation.prototype._completeInheritdocs = function (warnings) {
        while (this.incompleteInheritdocs.length) {
            var token = this.incompleteInheritdocs.pop();
            DocElementParser_1.default.parseInheritDoc(this, token, warnings);
        }
    };
    ApiDocumentation.prototype._reportBadAedocTag = function (token) {
        var supportsRegular = ApiDocumentation._allowedRegularAedocTags.indexOf(token.tag) >= 0;
        var supportsInline = ApiDocumentation._allowedInlineAedocTags.indexOf(token.tag) >= 0;
        if (!supportsRegular && !supportsInline) {
            this.reportError("The JSDoc tag \"" + token.tag + "\" is not supported by AEDoc");
            return;
        }
        if (token.type === Token_1.TokenType.InlineTag && !supportsInline) {
            this.reportError("The AEDoc tag \"" + token.tag + "\" must use the inline tag notation (i.e. with curly braces)");
            return;
        }
        if (token.type === Token_1.TokenType.BlockTag && !supportsRegular) {
            this.reportError("The AEDoc tag \"" + token.tag + "\" must use the block tag notation (i.e. no curly braces)");
            return;
        }
        this.reportError("The AEDoc tag \"" + token.tag + "\" is not supported in this context");
        return;
    };
    ApiDocumentation.prototype._checkInheritDocStatus = function (aedocTag) {
        if (this.isDocInherited) {
            this.reportError("The " + aedocTag + " tag may not be used because this state is provided by the @inheritdoc target");
        }
    };
    /**
     * Match AEDoc block tags and inline tags
     * Example "@a @b@c d@e @f {whatever} {@link a} { @something } \@g" => ["@a", "@f", "{@link a}", "{ @something }"]
     */
    ApiDocumentation._aedocTagsRegex = /{\s*@(\\{|\\}|[^{}])*}|(?:^|\s)(\@[a-z_]+)(?=\s|$)/gi;
    // For guidance about using these tags, please see this documentation:
    // https://github.com/Microsoft/web-build-tools/wiki/API-Extractor-~-AEDoc-tags
    ApiDocumentation._allowedRegularAedocTags = [
        // (alphabetical order)
        '@alpha',
        '@beta',
        '@betadocumentation',
        '@internal',
        '@internalremarks',
        '@param',
        '@preapproved',
        '@public',
        '@returns',
        '@see',
        '@deprecated',
        '@readonly',
        '@remarks'
    ];
    ApiDocumentation._allowedInlineAedocTags = [
        // (alphabetical order)
        '@inheritdoc',
        '@link'
    ];
    return ApiDocumentation;
}());
exports.default = ApiDocumentation;

//# sourceMappingURL=ApiDocumentation.js.map
