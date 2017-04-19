const packageJson = require("./package.json");

let externals = {};

for (let key in packageJson.dependencies) {
    externals[key] = key;
}

module.exports = {
    entry: "./src/index.ts",
    output: {
        filename: "./dist/simplr-forms-dom.js",
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
    externals: externals
};