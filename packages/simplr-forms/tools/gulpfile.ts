import * as gulp from "gulp";
import * as path from "path";
import * as webpack from "webpack";
import * as webpackConfig from "./webpack.config";
import * as process from "process";
import * as childProcess from "child_process";
import * as simplrMvDir from "simplr-mvdir";

const packageJson = require("./package.json");

const compiler = webpack(webpackConfig);
const paths = {
    src: [
        "./src",
        "./tsconfig.json"
    ],
    dist: "./dist",
    root: "."
};

export function webpackTask() {
    return new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
            if (err != null) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

export async function moveFromDistTask() {
    const from = path.resolve(paths.dist);
    const to = path.resolve(paths.root);
    await simplrMvDir.move(from, to);
}

export async function copyToJspm() {
    const jspmPath = `../simplr-forms-test/dist/jspm_packages/npm/${packageJson.name}@${packageJson.version}`;
    const outputPath = path.resolve(jspmPath);
    gulp.src(packageJson.files)
        .pipe(gulp.dest(outputPath));
}

const buildTask = gulp.series(webpackTask, moveFromDistTask);

export function watchStartTask() {
    gulp.watch(paths.src, gulp.series(buildTask, copyToJspm));
}

export const build = buildTask;
export const watch = gulp.series(buildTask, copyToJspm, watchStartTask);



// tslint:disable-next-line:no-default-export
export default buildTask;
