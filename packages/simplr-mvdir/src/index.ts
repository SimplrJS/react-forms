import * as fs from "mz/fs";
import * as path from "path";
import * as process from "process";
import * as mkdirp from "mkdirp";

export async function move(
    from: string,
    to: string,
    recursively: boolean = true,
    removeFromDirectory = true,
    rootFrom?: string) {

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
                    await waitForEmptyAndRemoveDirAsync(fromDirectory);
                }
            }
        }
    }
    if (removeFromDirectory === true && await fs.exists(from)) {
        await waitForEmptyAndRemoveDirAsync(from);
    }
}

async function mkdirpAsync(dir: string) {
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

async function waitForEmptyAndRemoveDirAsync(dir: string) {
    let files;
    while ((files = await fs.readdir(dir)) && files!.length > 0) {
        await sleep(10);
    }
    await fs.rmdir(dir);
}

function sleep(milliseconds: number) {
    return new Promise<void>(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

async function rmdir(dir: string) {
    let list = await fs.readdir(dir);
    for (var i = 0; i < list.length; i++) {
        var filename = path.join(dir, list[i]);
        var stat = await fs.stat(filename);

        if (filename === "." || filename === "..") {
            // pass these files
        } else if (stat.isDirectory()) {
            // rmdir recursively
            await rmdir(filename);
        } else {
            // rm fiilename
            await fs.unlink(filename);
        }
    }
    await fs.rmdir(dir);
}
