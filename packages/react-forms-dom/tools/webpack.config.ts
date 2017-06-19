import * as path from "path";
import * as childProcess from "child_process";

const packageJson = require("./package.json");

let externals: {
    [key: string]: any
} = {
        "@simplr/react-forms/utils": "@simplr/react-forms/utils",
        "@simplr/react-forms/actions": "@simplr/react-forms/actions",
        "@simplr/react-forms/contracts": "@simplr/react-forms/contracts",
        "@simplr/react-forms/modifiers": "@simplr/react-forms/modifiers",
        "@simplr/react-forms/stores": "@simplr/react-forms/stores"
    };

for (const key in packageJson.dependencies) {
    if (packageJson.dependencies.hasOwnProperty(key)) {
        externals[key] = key;
    }
}

const externalsResolver = [
    externals,
    function (context: string, request: string, callback: Function) {
        const directoriesToTest = [
            "abstractions",
            "actions",
            "stores",
            "utils"
        ];

        const tests = directoriesToTest.map(directory => ({
            regex: new RegExp(`.*/${directory}/.+$`),
            directory: directory
        }));

        let passingTest;
        for (const test of tests) {
            if (test.regex.test(request)) {
                passingTest = test;
            }
        }

        if (passingTest != null) {
            const resolvedPath = path.resolve(context, request);
            const shouldReplaceWithCustomResolve =
                request.indexOf("src") === -1 &&
                resolvedPath.indexOf(path.join(__dirname, `src/${passingTest.directory}`)) !== -1;

            if (shouldReplaceWithCustomResolve) {
                const customResolve = `./${passingTest.directory}`;
                callback(null, customResolve);
                return;
            }
        }
        callback();
    }
];

module.exports = {
    entry: {
        index: "./src/index.ts",
        abstractions: "./src/abstractions/index.ts"
    },
    output: {
        filename: "./dist/[name].js",
        libraryTarget: "umd"
    },
    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            },
            {
                enforce: "pre",
                test: /\.tsx?$/,
                use: "source-map-loader"
            },
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                options: {
                }
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".tsx"]
    },
    externals: externalsResolver,
    devtool: "inline-source-map"
};
