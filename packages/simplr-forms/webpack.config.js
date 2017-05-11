"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var packageJson = require("./package.json");
var externals = {};
for (var key in packageJson.dependencies) {
    if (packageJson.dependencies.hasOwnProperty(key)) {
        externals[key] = key;
    }
}
var externalsResolver = [
    externals,
    function (context, request, callback) {
        var directoriesToTest = [
            "abstractions",
            "actions",
            "stores",
            "utils"
        ];
        var tests = directoriesToTest.map(function (directory) { return ({
            regex: new RegExp(".*/" + directory + "/.+$"),
            directory: directory
        }); });
        var passingTest;
        for (var _i = 0, tests_1 = tests; _i < tests_1.length; _i++) {
            var test_1 = tests_1[_i];
            if (test_1.regex.test(request)) {
                passingTest = test_1;
            }
        }
        if (passingTest != null) {
            var resolvedPath = path.resolve(context, request);
            var shouldReplaceWithCustomResolve = request.indexOf("src") === -1 &&
                resolvedPath.indexOf(path.join(__dirname, "src/" + passingTest.directory)) !== -1;
            if (shouldReplaceWithCustomResolve) {
                var customResolve = "./" + passingTest.directory;
                callback(null, customResolve);
                return;
            }
        }
        callback();
    }
];
module.exports = {
    entry: {
        index: "./src/abstractions/index.ts",
        modifiers: "./src/modifiers/index.ts",
        normalizers: "./src/normalizers/index.ts",
        stores: "./src/stores/index.ts",
        actions: "./src/actions/index.ts",
        contracts: "./src/contracts/index.ts",
        utils: "./src/utils/index.ts"
    },
    output: {
        filename: "./dist/[name].js",
        libraryTarget: "umd"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                options: {}
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".tsx"]
    },
    externals: externalsResolver
};
