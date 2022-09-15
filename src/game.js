import chalk from "chalk";
import promptSync from "prompt-sync";
import { getMeta } from "./util.js";

const prompt = promptSync({ sigint: true });

export function play() {
    printInstructions();
    const result = run();
    gameOver(result);
}

const Color = {
    red: "red",
    green: "green",
    blue: "blue",
    yellow: "yellow",
};

const COLORS = [
    Color.red,
    Color.green,
    Color.blue,
    Color.yellow,
];

function run() {
    const pattern = [];

    while (true) {
        const color = genColor();
        pattern.push(color);

        console.clear();
        console.log(`New color: ${displayColor(color)}`);

        for (let i = 0; i < pattern.length; ) {
            const inputColors = promptGuesses(
                chalk.bold(`${i + 1}. `),
            );

            for (
                let j = 0;
                j < inputColors.length;
                j++, i++
            ) {
                const targetColor = pattern[i];
                const inputColor = inputColors[j];

                if (!targetColor) {
                    break;
                }

                if (
                    !isTargetColor(targetColor, inputColor)
                ) {
                    return {
                        score: pattern.length - 1,
                        pattern,
                    };
                }
            }
        }
    }
}

function genColor() {
    return COLORS[
        Math.floor(Math.random() * COLORS.length)
    ];
}

function promptGuesses(msg = "> ") {
    return prompt(msg)
        .toLowerCase()
        .trim()
        .split("") // /,|\s+/
        .map((s) => s.trim())
        .filter(isValidColor);
}

function isValidColor(s) {
    return s && COLORS.some((c) => isTargetColor(c, s));
}

function isTargetColor(targetColor, compareColor) {
    return targetColor.startsWith(compareColor);
}

function displayColor(color) {
    return chalk[color](color.toUpperCase());
}

function printInstructions() {
    const meta = getMeta();
    prompt(
        [
            chalk.bgWhite.black.bold(meta.name) +
                chalk.bold(` v${meta.version}`) +
                " by " +
                chalk.bold(meta.author),
            "Play Simon in your console!",
            `Each round, you will be given a ${chalk.bold(
                "color",
            )} to memorize.`,
            "You will have to enter the full pattern of all colors to keep playing.",
            "You lose when you input a wrong color.",
            "To input colors, simply type the letters corresponding to these colors:",
            "  " +
                COLORS.map(
                    (c) =>
                        `${chalk.bold(
                            c[0],
                        )} - ${displayColor(c)}`,
                ).join("\n  "),
            "Press ENTER to play!\n",
        ].join("\n"),
        { echo: "" },
    );
}

function gameOver({ score, pattern }) {
    console.clear();
    console.log(
        [
            chalk.bold.bgRed.black("Game Over!"),
            `Score: ${chalk.bold.bgGreen.black(score)}`,
            "Pattern:",
            "  " + pattern.map(displayColor).join("\n  "),
        ].join("\n"),
    );
}
