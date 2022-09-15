import chalk from "chalk";
import promptSync from "prompt-sync";

const prompt = promptSync({ sigint: true });

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

function genColor() {
    return COLORS[
        Math.floor(Math.random() * COLORS.length)
    ];
}

function promptGuesses(msg = "> ") {
    return prompt(msg)
        .toLowerCase()
        .trim()
        .split(/,|\s+/)
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

function main() {
    const result = run();
    gameOver(result);
}

function gameOver({ score, pattern }) {
    console.log(
        [
            chalk.bold.bgRed.black("Game Over!"),
            `Score: ${chalk.bold.bgGreen.black(score)}`,
            "Pattern:",
            "  " + pattern.map(displayColor).join("\n  "),
        ].join("\n"),
    );
}

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

main();
