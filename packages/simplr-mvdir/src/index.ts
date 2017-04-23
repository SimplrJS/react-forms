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
                    await fs.rmdir(fromDirectory);
                }
            }
        }
    }
    if (removeFromDirectory === true && await fs.exists(from)) {
        await fs.rmdir(from);
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
