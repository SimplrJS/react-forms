"use strict";
var path = require("path");
// Plugins
var webpackBuilder = require("@reactway/webpack-builder");
var typeScript = require("@reactway/webpack-builder-plugin-typescript");
var webpackDevServer = require("@reactway/webpack-builder-plugin-web-dev");
var htmlPlugin = require("@reactway/webpack-builder-plugin-html");
var styles = require("@reactway/webpack-builder-plugin-styles");
var images = require("@reactway/webpack-builder-plugin-images");
var clean = require("@reactway/webpack-builder-plugin-clean");
var writeFile = require("@reactway/webpack-builder-plugin-write-file");
// Packages not included to plugins.
// const CopyPlugin = require("copy-webpack-plugin");
var fullOutputPath = path.resolve(__dirname, "dist");
module.exports = new webpackBuilder.Builder(__dirname, {
    entry: "./src/app.tsx",
    mode: "development",
    output: {
        path: fullOutputPath,
        filename: "[name].bundle.js"
    }
})
    .use(typeScript.TypeScriptPlugin)
    .update(function (config) {
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
