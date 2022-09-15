import fs from "fs";
import os from "os";
import { getMeta } from "./util.js";

const SAVEFILE_NAME = "savefile.json";
let SAVEFILE = null;

export function getHighscore() {
    const savefile = getSaveFile();
    if (!savefile) return null;

    return savefile.highscore || 0;
}

export function setHighscore(score) {
    const savefile = getSaveFile();
    savefile.highscore = score;
    setSaveFile(savefile);
}

function getSaveFile() {
    return SAVEFILE || (SAVEFILE = readSaveFile());
}

function setSaveFile(savefile) {
    SAVEFILE = savefile;

    const path = getSaveFilePath();
    mkdirForFilepath(path);

    const raw = JSON.stringify(savefile, null, 2);
    try {
        fs.writeFileSync(path, raw, { encoding: "utf8" });
    } catch (_e) {
        // Ignore error...
    }
}

function mkdirForFilepath(filepath) {
    try {
        if (fs.existsSync(filepath)) return;

        const splitPath = filepath.split("/");
        splitPath.pop();
        const dirpath = splitPath.join("/");

        if (!fs.existsSync(dirpath)) {
            fs.mkdirSync(dirpath, { recursive: true });
        }
    } catch (_e) {
        // Ignore error...
    }
}

function readSaveFile() {
    const filepath = getSaveFilePath();
    if (!filepath) return null;

    try {
        const raw = fs.readFileSync(filepath, {
            encoding: "utf8",
        });
        return JSON.parse(raw);
    } catch (_e) {
        return {};
    }
}

function getSaveFilePath() {
    const meta = getMeta();
    const platform = os.platform();

    switch (platform) {
        case "linux": {
            return [
                os.homedir(),
                ".config",
                meta.name,
                SAVEFILE_NAME,
            ].join("/");
        }

        case "darwin": {
            return [
                os.homedir(),
                "Library",
                "Application Support",
                meta.name,
                SAVEFILE_NAME,
            ].join("/");
        }

        // case "win32": {
        //     return "no";
        // }

        default: {
            // console.warn(
            //     `Unsupported platform for savefile: ${platform}`,
            // );
            return null;
        }
    }
}
