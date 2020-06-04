var FIXEDCOST = 0.4;
var DISTMULTIPLIER = 1;
var ROWPENALTYMULTIPLIERS = [1, 1, 1, 1.2];
var TIMESCALE = 80;
var RESTTIME = 8;
var ALLOWEDCHARACTERS = "-qwertyuiopasdfghjkl;'zxcvbnm,. ";
var DEBUG = true;
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
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
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
            cost =
                (dist * DISTMULTIPLIER + FIXEDCOST) *
                ROWPENALTYMULTIPLIERS[kbkey.y];

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
        cost: timesteps.reduce((a, b) => a + b, 0),
    };
}

async function handleHighlights(keyboard, currChar, prevChar) {
    try {
        const prevButton = keyboard.getButtonElement(prevChar);
        prevButton.classList.remove('hg-activeButton');
    } catch {}
    await sleep(RESTTIME);
    try {
        const currButton = keyboard.getButtonElement(currChar);
        currButton.classList.add('hg-activeButton');
    } catch {}
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function renderPresses(keyboard, word, timesteps) {

    let written = document.getElementById(`${keyboard.options.layoutName}-written`);

    let prevChar;
    let currChar;
    written.innerHTML = '';
    for (let idx = 0; idx < word.length; idx++) {
        currChar = word[idx];

        if (currChar === ' ') {
            currChar = '{space}';
            written.innerHTML += ' ';
        } else {
            written.innerHTML += currChar;
        }

        // Visually 'type' on the keyboard
        handleHighlights(keyboard, currChar, prevChar);
        prevChar = currChar;
        await sleep(timesteps[idx] * TIMESCALE);
    }

    // Remove the highlight on the last character
    handleHighlights(keyboard, null, prevChar);
}
