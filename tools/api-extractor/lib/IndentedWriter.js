"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
/**
  * A utility for writing indented text.  In the current implementation,
  * IndentedWriter builds up an internal string buffer, which can be obtained
  * by calling IndentedWriter.getOutput().
  *
  * Note that the indentation is inserted at the last possible opportunity.
  * For example, this code...
  *
  *   writer.write('begin\n');
  *   writer.increaseIndent();
  *   writer.Write('one\ntwo\n');
  *   writer.decreaseIndent();
  *   writer.increaseIndent();
  *   writer.decreaseIndent();
  *   writer.Write('end');
  *
  * ...would produce this output:
  *
  *   begin
  *     one
  *     two
  *   end
  */
var IndentedWriter = (function () {
    function IndentedWriter() {
        this._output = '';
        this._indentStack = [];
        this._indentText = '';
        this._needsIndent = true;
    }
    /**
     * Retrieves the indented output.
     */
    IndentedWriter.prototype.toString = function () {
        return this._output;
    };
    /**
     * Increases the indentation.  Normally the indentation is two spaces,
     * however an arbitrary prefix can optional be specified.  (For example,
     * the prefix could be "// " to indent and comment simultaneously.)
     * Each call to IndentedWriter.increaseIndent() must be followed by a
     * corresponding call to IndentedWriter.decreaseIndent().
     */
    IndentedWriter.prototype.increaseIndent = function (prefix) {
        if (prefix === void 0) { prefix = '  '; }
        this._indentStack.push(prefix);
        this._updateIndentText();
    };
    /**
     * Decreases the indentation, reverting the effect of the corresponding call
     * to IndentedWriter.increaseIndent().
     */
    IndentedWriter.prototype.decreaseIndent = function () {
        this._indentStack.pop();
        this._updateIndentText();
    };
    /**
     * A shorthand for ensuring that increaseIndent()/decreaseIndent() occur
     * in pairs.
     */
    IndentedWriter.prototype.indentScope = function (scope) {
        this.increaseIndent();
        scope();
        this.decreaseIndent();
    };
    /**
     * Writes some text to the internal string buffer, applying indentation according
     * to the current indentation level.  If the string contains multiple newlines,
     * each line will be indented separately.
     */
    IndentedWriter.prototype.write = function (message) {
        var first = true;
        for (var _i = 0, _a = message.split('\n'); _i < _a.length; _i++) {
            var linePart = _a[_i];
            if (!first) {
                this._writeNewLine();
            }
            else {
                first = false;
            }
            if (linePart) {
                this._writeLinePart(linePart);
            }
        }
    };
    /**
     * A shorthand for writing an optional message, followed by a newline.
     * Indentation is applied following the semantics of IndentedWriter.write().
     */
    IndentedWriter.prototype.writeLine = function (message) {
        if (message === void 0) { message = ''; }
        this.write(message + '\n');
    };
    /**
     * Writes a string that does not contain any newline characters.
     */
    IndentedWriter.prototype._writeLinePart = function (message) {
        if (this._needsIndent) {
            this._output += this._indentText;
            this._needsIndent = false;
        }
        this._output += message.replace(/\r/g, '');
    };
    IndentedWriter.prototype._writeNewLine = function () {
        this._output += '\n';
        this._needsIndent = true;
    };
    IndentedWriter.prototype._updateIndentText = function () {
        this._indentText = this._indentStack.join('');
    };
    return IndentedWriter;
}());
exports.default = IndentedWriter;

//# sourceMappingURL=IndentedWriter.js.map
