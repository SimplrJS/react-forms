const packageJson = require("./package.json");

module.exports = {
    entry: "./src/index.ts",
    output: {
        filename: "./dist/simplr-forms-core.js",
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
    externals: packageJson.dependencies
};