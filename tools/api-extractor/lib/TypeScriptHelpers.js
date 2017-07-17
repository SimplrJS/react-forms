"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var PrettyPrinter_1 = require("./PrettyPrinter");
var TypeScriptHelpers = (function () {
    function TypeScriptHelpers() {
    }
    /**
     * Returns the Symbol for the provided Declaration.  This is a workaround for a missing
     * feature of the TypeScript Compiler API.   It is the only apparent way to reach
     * certain data structures, and seems to always work, but is not officially documented.
     *
     * @returns The associated Symbol.  If there is no semantic information (e.g. if the
     * declaration is an extra semicolon somewhere), then "undefined" is returned.
     */
    TypeScriptHelpers.tryGetSymbolForDeclaration = function (declaration) {
        /* tslint:disable:no-any */
        var symbol = declaration.symbol;
        /* tslint:enable:no-any */
        return symbol;
    };
    /**
     * Same semantics as tryGetSymbolForDeclaration(), but throws an exception if the symbol
     * cannot be found.
     */
    TypeScriptHelpers.getSymbolForDeclaration = function (declaration) {
        var symbol = TypeScriptHelpers.tryGetSymbolForDeclaration(declaration);
        if (!symbol) {
            PrettyPrinter_1.default.throwUnexpectedSyntaxError(declaration, 'Unable to determine the semantic information for this declaration');
        }
        return symbol;
    };
    /**
     * Returns the JSDoc comments associated with the specified node, if any.
     *
     * Example:
     * "This \n is \n a comment" from "\/** This\r\n* is\r\n* a comment *\/
     */
    TypeScriptHelpers.getJsdocComments = function (node, errorLogger) {
        var jsdoc = '';
        // tslint:disable-next-line:no-any
        var nodeJsdocObjects = node.jsDoc;
        if (nodeJsdocObjects && nodeJsdocObjects.length > 0) {
            // Use the JSDoc closest to the declaration
            var lastJsdocIndex = nodeJsdocObjects.length - 1;
            var jsdocFullText = nodeJsdocObjects[lastJsdocIndex].getText();
            var jsdocLines = jsdocFullText.split(TypeScriptHelpers.newLineRegEx);
            var jsdocStartSeqExists = TypeScriptHelpers.jsdocStartRegEx.test(jsdocLines[0].toString());
            // Report error for each missing sequence seperately
            if (!jsdocStartSeqExists) {
                errorLogger('Jsdoc comment must begin with a \"/**\" sequence.');
                return '';
            }
            var jsdocEndSeqExists = TypeScriptHelpers.jsdocEndRegEx.test(jsdocLines[jsdocLines.length - 1].toString());
            if (!jsdocEndSeqExists) {
                errorLogger('Jsdoc comment must end with a \"*/\" sequence.');
                return '';
            }
            jsdoc = TypeScriptHelpers.removeJsdocSequences(jsdocLines);
        }
        return jsdoc;
    };
    /**
     * Helper function to remove the comment stars ('/**'. '*', '/*) from lines of comment text.
     *
     * Example:
     * ["\/**", "*This \n", "*is \n", "*a comment", "*\/"] to "This \n is \n a comment"
     */
    TypeScriptHelpers.removeJsdocSequences = function (textLines) {
        // Remove '/**'
        textLines[0] = textLines[0].replace(TypeScriptHelpers.jsdocStartRegEx, '');
        if (textLines[0] === '') {
            textLines.shift();
        }
        // Remove '*/'
        textLines[textLines.length - 1] = textLines[textLines.length - 1].replace(TypeScriptHelpers.jsdocEndRegEx, '');
        if (textLines[textLines.length - 1] === '') {
            textLines.pop();
        }
        // Remove the leading '*' from any intermediate lines
        if (textLines.length > 0) {
            for (var i = 0; i < textLines.length; i++) {
                textLines[i] = textLines[i].replace(TypeScriptHelpers.jsdocIntermediateRegEx, '');
            }
        }
        return textLines.join('\n');
    };
    /**
     * Similar to calling string.split() with a RegExp, except that the delimiters
     * are included in the result.
     *
     * Example: _splitStringWithRegEx("ABCDaFG", /A/gi) -> [ "A", "BCD", "a", "FG" ]
     * Example: _splitStringWithRegEx("", /A/gi) -> [ ]
     * Example: _splitStringWithRegEx("", /A?/gi) -> [ "" ]
     */
    TypeScriptHelpers.splitStringWithRegEx = function (text, regExp) {
        if (!regExp.global) {
            throw new Error('RegExp must have the /g flag');
        }
        if (text === undefined) {
            return [];
        }
        var result = [];
        var index = 0;
        var match;
        do {
            match = regExp.exec(text);
            if (match) {
                if (match.index > index) {
                    result.push(text.substring(index, match.index));
                }
                var matchText = match[0];
                if (!matchText) {
                    // It might be interesting to support matching e.g. '\b', but regExp.exec()
                    // doesn't seem to iterate properly in this situation.
                    throw new Error('The regular expression must match a nonzero number of characters');
                }
                result.push(matchText);
                index = regExp.lastIndex;
            }
        } while (match && regExp.global);
        if (index < text.length) {
            result.push(text.substr(index));
        }
        return result;
    };
    /**
     * Extracts the body of a TypeScript comment and returns it.
     */
    // Examples:
    // "/**\n * this is\n * a test\n */\n" --> "this is\na test"
    // "/** single line comment */" --> "single line comment"
    TypeScriptHelpers.extractCommentContent = function (text) {
        var lines = text.replace('\r', '').split('\n');
        var State;
        (function (State) {
            State[State["Start"] = 0] = "Start";
            State[State["Body"] = 1] = "Body";
            State[State["Done"] = 2] = "Done";
            State[State["Error"] = 3] = "Error";
        })(State || (State = {}));
        var state = State.Start;
        var startRegExp = /^\s*\/\*\*+ ?/;
        var bodyRegExp = /^\s*\* ?/;
        var endRegExp = /^\s*\*+\/\s*$/;
        var singleLineEndRegExp = / ?\*+\/\s*$/;
        var content = '';
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            if (line.trim().length === 0) {
                continue;
            }
            var modified = line;
            switch (state) {
                case State.Start:
                    if (line.match(startRegExp)) {
                        modified = line.replace(startRegExp, '');
                        if (modified.match(singleLineEndRegExp)) {
                            modified = modified.replace(singleLineEndRegExp, '');
                            state = State.Done;
                        }
                        else {
                            state = State.Body;
                        }
                    }
                    else {
                        state = State.Error;
                    }
                    break;
                case State.Body:
                    if (line.match(endRegExp)) {
                        modified = line.replace(endRegExp, '');
                        state = State.Done;
                    }
                    else if (line.match(bodyRegExp)) {
                        modified = line.replace(bodyRegExp, '');
                    }
                    else {
                        state = State.Error;
                    }
                    break;
                case State.Done:
                    state = State.Error;
                    break;
            }
            if (modified !== '') {
                if (content !== '') {
                    content += '\n';
                }
                content += modified;
            }
        }
        if (state !== State.Done) {
            return '[ERROR PARSING COMMENT]';
        }
        return content;
    };
    /**
     * Splits by the characters '\r\n'.
     */
    TypeScriptHelpers.newLineRegEx = /\r\n|\n/g;
    /**
     * Start sequence is '/**'.
     */
    TypeScriptHelpers.jsdocStartRegEx = /^\s*\/\*\*\s?/g;
    /**
     * End sequence is '*\/'.
     */
    TypeScriptHelpers.jsdocEndRegEx = /\s*\*\/\s*$/g;
    /**
     * Intermediate lines of JSDoc comment character.
     */
    TypeScriptHelpers.jsdocIntermediateRegEx = /^\s*[*]\s?/g;
    return TypeScriptHelpers;
}());
exports.default = TypeScriptHelpers;

//# sourceMappingURL=TypeScriptHelpers.js.map
