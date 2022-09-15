import chalk from "chalk";
import fs from "fs";

export function err(msg) {
    console.error(`${chalk.bold.red("[Error]")}\n${msg}`);
    process.exit(1);
}

let META = null;

export function getMeta() {
    return META || (META = readMeta());
}

function readMeta() {
    const file = new URL("../package.json", import.meta.url)
        .pathname;

    try {
        const raw = fs.readFileSync(file, {
            encoding: "utf8",
        });
        const obj = JSON.parse(raw);
        return {
            name: obj.name,
            version: obj.version,
            author:
                (obj.author.split("<")[0] || "").trim() ||
                undefined,
        };
    } catch (e) {
        err(
            `Failed reading file ${chalk.bold(
                file,
            )}\n${JSON.stringify(e, null, 2)}`,
        );
    }
}
