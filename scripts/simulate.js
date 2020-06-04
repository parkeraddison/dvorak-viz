// X and Y distance scales are in mm,
// Source: https://hobgear.com/understand-keyboard-sizes/
var XSCALE = 15.5 + 3.3;
var YSCALE = 15 + 3.3;
var ROWPENALTYMULTIPLIERS = [1, 1, 1, 1.2];
var FIXEDCOST = 18;
// For use in rendering
var TIMESCALE = 2.5; // Roughly matches my typing speed.
var RESTTIME = 8;
// Would like to add eventual support for :\"<>?_
var ALLOWEDCHARACTERS = "1234567890\\-qwertyuiopasdfghjkl;'zxcvbnm,./ ";
var DEBUG = false;
var RENDER = true;

// === SIMULATION ==============================================================

// For now, we're ignoring some characters.
function parseWord(word) {
    let re = new RegExp(`[^${ALLOWEDCHARACTERS}]`, 'g');

    cleaned = word
        .toLowerCase()
        .replace(/[\u2018\u2019]/g, "'")
        .replace(re, '');

    return cleaned;
}
function distance(a, b) {
    return Math.sqrt(((a.x - b.x) * XSCALE) ** 2 + ((a.y - b.y) * YSCALE) ** 2);
}

function run(keyboard, word, verbose = false) {
    word = parseWord(word);

    let layoutName = keyboard.options.layoutName;
    let layoutkeys = kbkeys[layoutName];
    let layoutmatrix = kbmatrix[layoutName];

    // Each 'run' starts with the home finger positions.
    let kbfingers = [
        ...layoutmatrix[2].slice(1, 5),
        null,
        null,
        ...layoutmatrix[2].slice(7, 11),
    ];

    let distances = [];
    let timesteps = [];

    for (const character of word) {
        let dist;
        let cost;
        // Spaces have zero distance cost since we use our thumbs.
        if (character === ' ') {
            dist = 0;
            cost = FIXEDCOST;

            if (verbose) {
                console.log(`Typing space.`);
            }
        } else {
            let kbkey = layoutkeys[character];

            let prevKey = kbfingers[kbkey.finger];

            dist = distance(kbkey, prevKey);
            cost = dist * ROWPENALTYMULTIPLIERS[kbkey.y] + FIXEDCOST;

            if (verbose) {
                console.log(
                    `Typing ${character} with finger ${kbkey.finger} previously on ${prevKey.character}`
                );
            }
        }

        distances.push(dist);
        timesteps.push(cost);
        if (verbose) {
            console.log(`Added distance of ${dist}`);
        }
    }

    return {
        word: word,
        distances: distances,
        timesteps: timesteps,
        distance: distances.reduce((a, b) => a + b, 0),
        cost: timesteps.reduce((a, b) => a + b, 0),
    };
}
