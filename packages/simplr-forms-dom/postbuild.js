const mv = require("mv");
const fs = require("mz/fs");
const path = require("path");
const process = require("process");

async function move(from, to, recursively = true, rootFrom) {
    from = path.resolve(from);
    to = path.resolve(to);

    rootFrom = rootFrom || from;

    const files = await fs.readdir(from);
    for (const file of files) {
        const stats = await fs.stat(path.join(from, file));
        if (await stats.isFile()) {
            const fileResolved = path.resolve(from, file);
            const fromDirectory = path.dirname(fileResolved);
            const toDirectory = fromDirectory.replace(rootFrom, to);
            const toFile = path.join(toDirectory, fileResolved.replace(fromDirectory, ""));
            await fs.rename(fileResolved, toFile);
        }
        if (await stats.isDirectory()) {
            if (recursively === true) {
                await move(path.join(from, file), to, recursively, from);
            }
        }
    }
}

async function run() {
    const distPath = "./dist";
    await move(distPath, ".", true);
}

run();