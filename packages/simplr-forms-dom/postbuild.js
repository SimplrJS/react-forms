const mv = require("mv");
const fs = require("mz/fs");
const path = require("path");
const process = require("process");
const mkdirp = require("mkdirp");

async function move(from, to, recursively = true, removeFromDirectory = true, rootFrom = undefined) {
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

            try {
                await mkdirpAsync(toDirectory);
                await fs.rename(fileResolved, toFile);
            } catch (err) {
                console.log(err);
            }
        }
        if (await stats.isDirectory()) {
            if (recursively === true) {
                const fromDirectory = path.join(from, file);
                await move(fromDirectory, to, recursively, removeFromDirectory, from);
                if (removeFromDirectory === true && await fs.exists(fromDirectory)) {
                    await fs.rmdir(fromDirectory);
                }
            }
        }
    }
    if (removeFromDirectory === true && await fs.exists(from)) {
        await fs.rmdir(from);
    }
}

async function mkdirpAsync(dir) {
    return new Promise((resolve, reject) => {
        mkdirp(dir, (err, made) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(made);
        });
    });
}

async function run() {
    const distPath = "./dist";
    await move(distPath, "./dist2", true);
}

run();