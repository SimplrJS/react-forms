const path = require("path");
// Plugins
const webpackBuilder = require("@reactway/webpack-builder");
const typeScript = require("@reactway/webpack-builder-plugin-typescript");
const webpackDevServer = require("@reactway/webpack-builder-plugin-web-dev");
const htmlPlugin = require("@reactway/webpack-builder-plugin-html");
const styles = require("@reactway/webpack-builder-plugin-styles");
const images = require("@reactway/webpack-builder-plugin-images");
const clean = require("@reactway/webpack-builder-plugin-clean");
const writeFile = require("@reactway/webpack-builder-plugin-write-file");
// Packages not included to plugins.
// const CopyPlugin = require("copy-webpack-plugin");

const fullOutputPath = path.resolve(__dirname, "dist");

module.exports = new webpackBuilder.Builder(__dirname, {
    entry: "./src/app.tsx",
    mode: "development",
    output: {
        path: fullOutputPath,
        filename: "[name].bundle.js"
    }
})
    .use(typeScript.TypeScriptPlugin)
    .update((config: any) => {
        config.devtool = "inline-source-map";
        return config;
    })
    .use(webpackDevServer)
    .use(htmlPlugin)
    .use(styles.StylesPlugin)
    .use(images)
    .use(clean)
    .use(writeFile)
    .toConfig();
