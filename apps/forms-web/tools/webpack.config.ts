import path from "path";
// Plugins
import { Builder } from "@reactway/webpack-builder";
import { TypeScriptPlugin } from "@reactway/webpack-builder-plugin-typescript";
import webpackDevServer from "@reactway/webpack-builder-plugin-web-dev";
import htmlPlugin from "@reactway/webpack-builder-plugin-html";
import { StylesPlugin } from "@reactway/webpack-builder-plugin-styles";
import images from "@reactway/webpack-builder-plugin-images";
import clean from "@reactway/webpack-builder-plugin-clean";
import writeFile from "@reactway/webpack-builder-plugin-write-file";
// Packages not included to plugins.
// const CopyPlugin = require("copy-webpack-plugin");

const fullOutputPath = path.resolve(__dirname, "dist");

module.exports = new Builder(__dirname, {
    entry: "./src/app.tsx",
    mode: "development",
    output: {
        path: fullOutputPath,
        filename: "[name].bundle.js"
    }
})
    .use(TypeScriptPlugin)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .update((config: any) => {
        config.devtool = "inline-source-map";
        return config;
    })
    .use(webpackDevServer)
    .use(htmlPlugin)
    .use(StylesPlugin)
    .use(images)
    .use(clean)
    .use(writeFile)
    .toConfig();
