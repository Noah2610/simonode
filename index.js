const prompt = require("prompt-sync")({ sigint: true });

const COLORS = ["red", "green", "blue", "yellow"];

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

function main() {
    const score = run();
    console.log(`Game Over!\nScore: ${score}`);
}

function run() {
    const pattern = [];

    while (true) {
        const color = genColor();
        pattern.push(color);

        console.clear();
        console.log(`New color: ${color}`);

        for (let i = 0; i < pattern.length; ) {
            const inputColors = promptGuesses(`${i + 1}. `);

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
                    return pattern.length - 1;
                }
            }
        }
    }
}

main();
