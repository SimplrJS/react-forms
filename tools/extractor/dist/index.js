"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var api_extractor_1 = require("@microsoft/api-extractor");
var ts = require("typescript");
var path = require("path");
var chalk = require("chalk");
var mkdirp = require("mkdirp");
var ExtractorTaskClass = (function () {
    function ExtractorTaskClass(projectPath) {
        var _this = this;
        this.projectPath = projectPath;
        this.scriptName = "AE";
        this.onErrorHandler = function (message, fileName, lineNumber) {
            // Ignore node_modules errors
            if (fileName.indexOf("node_modules") !== -1) {
                _this.errorsCount.NodeModules++;
                return;
            }
            // Ignore d.ts files
            if (path.basename(fileName).indexOf(".d.ts") !== -1) {
                _this.errorsCount.Types++;
                return;
            }
            // Ignore TypeScript errors
            if (message.indexOf("TypeScript:") !== -1) {
                _this.errorsCount.TypeScript++;
                return;
            }
            _this.errorsCount.Other++;
            _this.warningWrite("[" + fileName + ":" + lineNumber + "] " + message);
        };
        this.Extractor = new api_extractor_1.Extractor({
            compilerOptions: this.TSCompilerOptions,
            errorHandler: this.onErrorHandler
        });
        this.errorsCount = {
            NodeModules: 0,
            Types: 0,
            TypeScript: 0,
            Other: 0
        };
    }
    Object.defineProperty(ExtractorTaskClass.prototype, "TSCompilerOptions", {
        get: function () {
            return {
                target: ts.ScriptTarget.ES5,
                module: ts.ModuleKind.CommonJS,
                moduleResolution: ts.ModuleResolutionKind.NodeJs,
                jsx: ts.JsxEmit.React,
                // Path to package.json folder.
                rootDir: this.projectPath,
                lib: [
                    "dom",
                    "dom.iterable",
                    "es6"
                ],
                typeRoots: ["./"]
            };
        },
        enumerable: true,
        configurable: true
    });
    ExtractorTaskClass.prototype.Analyze = function (entryFile, otherFiles) {
        var fullEntryFilePath = path.resolve(this.projectPath, entryFile);
        this.consoleWrite("Entry file: " + fullEntryFilePath);
        this.Extractor.analyze({
            entryPointFile: entryFile,
            otherFiles: otherFiles
        });
    };
    ExtractorTaskClass.prototype.JSONGenerator = function (jsonLocation, entryFile, otherFiles) {
        var _this = this;
        if (otherFiles === void 0) { otherFiles = []; }
        this.consoleWrite(chalk.cyan("------------- [Started] -------------"));
        this.Analyze(entryFile, otherFiles);
        var apiJSONGenerator = new api_extractor_1.ApiJsonGenerator();
        this.consoleWrite(chalk.cyan("--------------- [Log] ---------------"));
        var fullJSONPath = path.resolve(this.projectPath, jsonLocation);
        this.consoleWrite(chalk.green("Writing JSON file: " + fullJSONPath));
        var jsonDirname = path.dirname(jsonLocation);
        mkdirp(jsonDirname, function (err) {
            _this.errorWrite("Failed to create folder [" + jsonDirname + "]: " + err);
        });
        apiJSONGenerator.writeJsonFile(jsonLocation, this.Extractor);
        // Writing errors.
        for (var errorName in this.errorsCount) {
            if (this.errorsCount.hasOwnProperty(errorName)) {
                var errorCount = this.errorsCount[errorName];
                if (errorCount > 0) {
                    this.warningWrite(errorName + ": " + errorCount);
                }
            }
        }
        this.consoleWrite(chalk.cyan("-------------- [Done] ---------------"), "\n");
    };
    ExtractorTaskClass.prototype.consoleWrite = function () {
        var text = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            text[_i] = arguments[_i];
        }
        var message = text.join(" ");
        console.info(this.writeTag() + " " + message);
    };
    ExtractorTaskClass.prototype.warningWrite = function () {
        var warning = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            warning[_i] = arguments[_i];
        }
        var message = chalk.yellow("WARN " + warning.join(" "));
        console.warn(this.writeTag() + " " + message);
    };
    ExtractorTaskClass.prototype.errorWrite = function () {
        var errors = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            errors[_i] = arguments[_i];
        }
        var message = chalk.red("ERR! " + errors.join(" "));
        console.error(this.writeTag() + " " + message);
    };
    ExtractorTaskClass.prototype.writeTag = function () {
        return "[" + chalk.cyan(this.scriptName) + "]";
    };
    return ExtractorTaskClass;
}());
exports.ExtractorTaskClass = ExtractorTaskClass;
