"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var os = require("os");
var path = require("path");
var fs = require("fs");
var Extractor_1 = require("./Extractor");
var ApiJsonGenerator_1 = require("./generators/ApiJsonGenerator");
/**
 * ExternalApiHelper has the specific use case of generating an API json file from third party definition files.
 * This class is invoked by the gulp-core-build-typescript gulpfile, where the external package names are
 * hard wired.
 * The job of this method is almost the same as the API Extractor task that is executed on first party packages,
 * with the exception that all packages analyzed here are external packages with definition files.
 *
 * @public
 */
var ExternalApiHelper = (function () {
    function ExternalApiHelper() {
    }
    /**
     * @param rootDir - the absolute path containing a 'package.json' file and is also a parent of the
     * external package file. Ex: build.absolute_build_path.
     * @param libFolder - the path to the lib folder relative to the rootDir, this is where
     * 'external-api-json/external_package.api.json' file will be written. Ex: 'lib'.
     * @param externalPackageFilePath - the path to the '*.d.ts' file of the external package relative to the rootDir.
     * Ex: 'resources/external-api-json/es6-collection/index.t.ds'
     */
    ExternalApiHelper.generateApiJson = function (rootDir, libFolder, externalPackageFilePath) {
        var compilerOptions = {
            target: ts.ScriptTarget.ES5,
            module: ts.ModuleKind.CommonJS,
            moduleResolution: ts.ModuleResolutionKind.NodeJs,
            experimentalDecorators: true,
            jsx: ts.JsxEmit.React,
            rootDir: rootDir
        };
        var extractor = new Extractor_1.default({
            compilerOptions: compilerOptions,
            errorHandler: function (message, fileName, lineNumber) {
                console.log("TypeScript error: " + message + os.EOL
                    + ("  " + fileName + "#" + lineNumber));
            }
        });
        var outputPath = path.join(rootDir, libFolder);
        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath);
        }
        outputPath = path.join(outputPath, 'external-api-json');
        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath);
        }
        var externalPackageRootDir = path.dirname(externalPackageFilePath);
        var outputApiJsonFilePath = path.join(outputPath, path.basename(externalPackageRootDir) + ".api.json");
        var entryPointFile = path.join(rootDir, externalPackageFilePath);
        extractor.analyze({
            entryPointFile: entryPointFile,
            otherFiles: []
        });
        var apiJsonGenerator = new ApiJsonGenerator_1.default();
        apiJsonGenerator.writeJsonFile(outputApiJsonFilePath, extractor);
    };
    return ExternalApiHelper;
}());
exports.default = ExternalApiHelper;

//# sourceMappingURL=ExternalApiHelper.js.map
