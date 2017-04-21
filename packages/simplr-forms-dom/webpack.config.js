const packageJson = require("./package.json");
const tsConfig = require("./tsconfig.json");
const path = require("path");

let externals = {};

for (let key in packageJson.dependencies) {
    externals[key] = key;
}

let externalsResolver = [
    externals,
    function (context, request, callback) {
        if (/.*\/abstractions\/.+$/.test(request)) {
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

module.exports = {
    entry: {
        abstractions: "./src/abstractions/index.ts",
        main: "./src/index.ts"
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