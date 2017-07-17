"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-constant-condition */
var fsx = require("fs-extra");
var path = require("path");
var JsonFile_1 = require("./JsonFile");
/**
 * This class provides methods for finding the nearest "package.json" for a folder
 * and retrieving the name of the package.  The results are cached.
 */
var PackageJsonLookup = (function () {
    function PackageJsonLookup() {
        this._packageFolderCache = new Map();
        this._packageNameCache = new Map();
    }
    /**
     * Finds the path to the package folder of a given currentPath, by probing
     * upwards from the currentPath until a package.json file is found.
     * If no package.json can be found, undefined is returned.
     *
     * @param currentPath - a path (relative or absolute) of the current location
     * @returns a relative path to the package folder
     */
    PackageJsonLookup.prototype.tryFindPackagePathUpwards = function (sourceFilePath) {
        // Two lookups are required, because get() cannot distinguish the undefined value
        // versus a missing key.
        if (this._packageFolderCache.has(sourceFilePath)) {
            return this._packageFolderCache.get(sourceFilePath);
        }
        var result;
        var parentFolder = path.dirname(sourceFilePath);
        if (!parentFolder || parentFolder === sourceFilePath) {
            result = undefined;
        }
        else if (fsx.existsSync(path.join(parentFolder, 'package.json'))) {
            result = path.normalize(parentFolder);
        }
        else {
            result = this.tryFindPackagePathUpwards(parentFolder);
        }
        this._packageFolderCache.set(sourceFilePath, result);
        return result;
    };
    /**
     * Loads the package.json file and returns the name of the package.
     *
     * @param packageJsonPath - an absolute path to the folder containing the
     * package.json file, it does not include the 'package.json' suffix.
     * @returns the name of the package (E.g. @microsoft/api-extractor)
     */
    PackageJsonLookup.prototype.readPackageName = function (packageJsonPath) {
        var result = this._packageNameCache.get(packageJsonPath);
        if (result !== undefined) {
            return result;
        }
        var packageJson = JsonFile_1.default.loadJsonFile(path.join(packageJsonPath, 'package.json'));
        result = packageJson.name;
        this._packageNameCache.set(packageJsonPath, result);
        return result;
    };
    return PackageJsonLookup;
}());
exports.default = PackageJsonLookup;

//# sourceMappingURL=PackageJsonLookup.js.map
