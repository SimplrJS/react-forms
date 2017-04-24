const packageJson = require("./package.json");
const path = require("path");

const WebpackOnBuildPlugin = require('on-build-webpack');
const childProcess = require('child_process');

let externals = {};

for (const key in packageJson.dependencies) {
    externals[key] = key;
}

const externalsResolver = [
    externals,
    function (context, request, callback) {
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

async function runScript(path, args) {
    return new Promise((resolve, reject) => {
        let invoked = false;

        const process = childProcess.fork(path, args);

        process.on("error", err => {
            if (invoked) {
                return;
            }
            invoked = true;
            reject(err);
        });

        process.on("exit", code => {
            if (invoked) {
                return;
            }
            invoked = true;
            if (code === 0) {
                resolve();
                return;
            }
            reject(new Error(`Exit code: ${code}`));
        });
    });
}

module.exports = {
    entry: {
        main: "./src/index.ts",
        abstractions: "./src/abstractions/index.ts",
        stores: "./src/stores/index.ts",
        actions: "./src/actions/index.ts",
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
    externals: externalsResolver,
    plugins: [
        new WebpackOnBuildPlugin(async (stats) => {
            await runScript("../simplr-mvdir/dist/cli.js", ["--from", "dist", "--to", "."]);
        }),
    ]
};