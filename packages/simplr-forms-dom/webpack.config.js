const packageJson = require("./package.json");
const tsConfig = require("./tsconfig.json");
const path = require("path");

var WebpackOnBuildPlugin = require('on-build-webpack');
var childProcess = require('child_process');

let externals = {};

for (let key in packageJson.dependencies) {
    externals[key] = key;
}

let externalsResolver = [
    externals,
    function (context, request, callback) {
        if (/\..*\/abstractions\/.+$/.test(request)) {
            console.log(`
            =====
            context: ${context}
            request: ${request}
            =====
            `);
            const resolvedPath = path.resolve(context, request);
            const customResolve =
                request.indexOf("src") === -1 &&
                resolvedPath.indexOf(path.join(__dirname, "src/abstractions")) !== -1;

            if (customResolve) {
                callback(null, "./abstractions");
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
        abstractions: "./src/abstractions/index.ts"
    },
    output: {
        filename: "./dist/[name].js",
        libraryTarget: "umd"
    },
    module: {
        rules: [
            {
                test: /.+\.tsx?$/,
                exclude: [
                    /!.+\/src.+/,
                    /\.d\.ts$/
                ],
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