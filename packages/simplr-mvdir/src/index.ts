import * as fs from "mz/fs";
import * as path from "path";
import * as process from "process";
import * as mkdirp from "mkdirp";

export async function move(
    from: string,
    to: string,
    recursively: boolean = true,
    removeFromDirectory = true,
    rootFrom?: string): Promise<void> {
    try {
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
                    console.info(err);
                }
            }
            if (await stats.isDirectory()) {
                if (recursively === true) {
                    const fromDirectory = path.join(from, file);
                    await tryAndRetry(async () => {
                        await move(fromDirectory, to, recursively, removeFromDirectory, from);
                    });
                    if (removeFromDirectory === true && fs.existsSync(fromDirectory)) {
                        await waitForEmptyAndRemoveDirAsync(fromDirectory);
                    }
                }
            }
        }
        if (removeFromDirectory === true && fs.existsSync(from)) {
            await waitForEmptyAndRemoveDirAsync(from);
        }
    } catch (err) {
        console.error("That's an error: ", JSON.stringify(err));
    }
}

async function mkdirpAsync(dir: string): Promise<{}> {
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

async function waitForEmptyAndRemoveDirAsync(dir: string): Promise<void> {
    let files = fs.readdirSync(dir);
    while (files.length > 0) {
        await sleep(10);
        if (fs.existsSync(dir)) {
            files = fs.readdirSync(dir);
        } else {
            files = [];
        }
    }
    if (fs.existsSync(dir)) {
        fs.rmdirSync(dir);
    }
}

function sleep(milliseconds: number): Promise<void> {
    return new Promise<void>(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

async function rmdir(dir: string): Promise<void> {
    const list = await fs.readdir(dir);
    for (let i = 0; i < list.length; i++) {
        const filename = path.join(dir, list[i]);
        const stat = await fs.stat(filename);

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
    if (await fs.exists(dir)) {
        await fs.rmdir(dir);
    }
}
async function tryAndRetry(action: Function, maxTries = 5): Promise<void> {
    while (true) {
        try {
            action();
            break;
        } catch (err) {
            await sleep(10);
        }
    }
}
