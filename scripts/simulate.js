// X and Y distance scales are in mm,
// Source: https://hobgear.com/understand-keyboard-sizes/
const XSCALE = 15.5 + 3.3;
const YSCALE = 15 + 3.3;
const ZDEPTH = 2; // The travel distance of a key.  Laptops and low-profile is
// usually 2mm, external keyboards usually 3.5 - 4mm.
// https://en.wikipedia.org/wiki/Keyboard_technology#Scissor-switch_keyboard
// The widths of the first key of each row
const XOFFSETS = [1, 1.5, 1.75, 2.25];
const ROWPENALTYMULTIPLIERS = [1, 1, 1, 1.2];
const FIXEDCOST = 18;
// For use in rendering
const TIMESCALE = 5.25; // Calibrated to roughly 70 WPM on QWERTY
const RESTTIME = 50;
const ALLOWEDCHARACTERS = `1234567890\\-=~!@#$%^&*()_+qwertyuiop{}\\[\\]asdfghjkl;':"zxcvbnm,\\.\\/<>? `;
const DEBUG = false;
const RENDER = true;

// === SIMULATION ==============================================================

// For now, we're ignoring some characters.
function parseWord(word) {
    let re = new RegExp(`[^${ALLOWEDCHARACTERS}]`, 'gi');

    cleaned = word
        // .toLowerCase()
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201c\u201d]/g, '"')
        .replace(re, '');

    return cleaned;
}
function distance(a, b) {
    let [ax, bx] = [a.x + XOFFSETS[a.y], b.x + XOFFSETS[b.y]];
    return Math.sqrt(((ax - bx) * XSCALE) ** 2 + ((a.y - b.y) * YSCALE) ** 2);
}

function run(keyboard, text, verbose = false) {
    text = parseWord(text);

    let layoutName = keyboard.options.layoutName;
    let layoutkeys = {...kbkeys[layoutName], ...kbkeys[layoutName + 'Shift']};
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
    let rowUsage = {
        0: 0, 1: 0, 2: 0, 3: 0
    }
    let alternating = 0;

    let prevChar;
    for (const character of text) {
        let dist = ZDEPTH;
        let cost = FIXEDCOST;
        // Spaces have zero distance cost since we use our thumbs.
        if (character === ' ') {
            if (verbose) {
                console.log(`Typing space.`);
            }
        } else {
            let kbkey = layoutkeys[character];

            // Add to the row counter for the corresponding y value.
            rowUsage[kbkey.y] += 1;

            // If the next key is on a new hand, add to the alternating counter
            if (prevChar) {
                let prevHand = layoutkeys[prevChar].finger < 5;
                if (prevHand != kbkey.finger < 4) {
                    alternating += 1;
                }
            }
            prevChar = character;

            // What key was the finger previously on?
            let prevKey = kbfingers[kbkey.finger];
            // Now we can update the key the finger *is* on.
            kbfingers[kbkey.finger] = kbkey;


            dist += distance(kbkey, prevKey);
            cost += dist * ROWPENALTYMULTIPLIERS[kbkey.y];

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
        text: text,
        distances: distances,
        timesteps: timesteps,
        distance: distances.reduce((a, b) => a + b, 0),
        cost: timesteps.reduce((a, b) => a + b, 0),
        rowUsage: rowUsage,
        alternating: alternating,
    };
}
