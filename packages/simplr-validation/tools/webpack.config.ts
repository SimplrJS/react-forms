import * as path from "path";
import * as childProcess from "child_process";

const packageJson = require("./package.json");

let externals: {
    [key: string]: any
} = {};

for (const key in packageJson.dependencies) {
    if (packageJson.dependencies.hasOwnProperty(key)) {
        externals[key] = key;
    }
}

const externalsResolver = [
    function (context, request, callback) {
        // console.log(request);
        if (request.indexOf("simplr-forms") !== -1) {
            const resolveTo = "simplr-forms";
            console.log(`Resolving:\n${request}\nTo:\n${resolveTo}\n`);
            callback(resolveTo);
            return;
        }
        callback();
    },
    externals,
    function (context: string, request: string, callback: Function) {
        const directoriesToTest = [
            "abstractions",
            "subscribers",
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
            let notIndexFile = true;
            for (const directory of directoriesToTest) {
                if (request === `./${directory}/index`) {
                    notIndexFile = false;
                }
            }

            const shouldReplaceWithCustomResolve =
                notIndexFile &&
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
        abstractions: "./src/abstractions/index.ts",
        subscribers: "./src/subscribers/index.ts",
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
                options: {
                }
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".tsx"]
    },
    externals: externalsResolver
};
