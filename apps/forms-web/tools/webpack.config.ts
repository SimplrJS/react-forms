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
import { RuleSetLoader } from "webpack";
// Packages not included to plugins.
// const CopyPlugin = require("copy-webpack-plugin");

const fullOutputPath = path.resolve(__dirname, "dist");

const builtConfig = new Builder(__dirname, {
    entry: "./src/app.tsx",
    mode: "development",
    output: {
        path: fullOutputPath,
        filename: "[name].bundle.js"
    }
})
    .use(TypeScriptPlugin)
    .update(config => {
        const rules = config.module?.rules;
        const tsRule = rules?.[0];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const use: RuleSetLoader[] | undefined = tsRule?.use as any;
        if (use == null) {
            return config;
        }
        
        const tsLoader = use.filter(x => x.loader === "ts-loader")[0];
        
        if (tsLoader.options == null) {
            return config;
        }
        
        tsLoader.options = {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            ...tsLoader.options,
            projectReferences : true
        }
        
        return config;
    })
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

module.exports = builtConfig;
