import * as path from "path";
import * as childProcess from "child_process";

const packageJson = require("./package.json");

let externals: {
    [key: string]: any
} = {
        "simplr-forms/utils": "simplr-forms/utils",
        "simplr-forms/actions": "simplr-forms/actions",
        "simplr-forms/contracts": "simplr-forms/contracts",
        "simplr-forms/stores": "simplr-forms/stores"
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
console.log(path.resolve("node_modules/simplr-forms/actions.js"));
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
