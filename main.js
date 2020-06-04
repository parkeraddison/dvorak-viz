var FIXEDCOST = 0.4;
var DISTMULTIPLIER = 1;
var TIMEMULTIPLIER = 100;
var ALLOWEDCHARACTERS = "qwertyuiopasdfghjkl;'zxcvbnm,. ";
var DEBUG = true;
var RENDER = true;

let Keyboard = window.SimpleKeyboard.default;

let commonKeyboardOptions = {
    // onChange: (input) => onChange(input),
    // onKeyPress: (button) => onKeyPress(button),
    theme: 'simple-keyboard hg-theme-default hg-layout-default dark',
    // physicalKeyboardHighlight: true,
    // syncInstanceInputs: true,
    mergeDisplay: true,
    // debug: true,
    layoutName: 'qwerty',
};

let keyboard = new Keyboard({
    ...commonKeyboardOptions,
    /**
     * Layout by:
     * Sterling Butters (https://github.com/SterlingButters)
     */
    layout: {
        qwerty: [
            //   "{escape} {f1} {f2} {f3} {f4} {f5} {f6} {f7} {f8} {f9} {f10} {f11} {f12}",
            '` 1 2 3 4 5 6 7 8 9 0 - = {backspace}',
            '{tab} q w e r t y u i o p [ ] \\',
            "{capslock} a s d f g h j k l ; ' {enter}",
            '{shiftleft} z x c v b n m , . / {shiftright}',
            //   "{controlleft} {altleft} {metaleft} {space} {metaright} {altright}"
            '{controlleft} {metaleft} {altleft} {space} {altright} {fn} {controlright}',
        ],
        dvorak: [
            '1 2 3 4 5 6 7 8 9 0 [ ] {backspace}',
            "{tab} ' , . p y f g c r l / = \\",
            '{capslock} a o e u i d h t n s - {enter}',
            '{shiftleft} ; q j k x b m w v z {shiftright}',
            '{controlleft} {metaleft} {altleft} {space} {altright} {fn} {controlright}',
        ],
        // shift: [
        //   "{escape} {f1} {f2} {f3} {f4} {f5} {f6} {f7} {f8} {f9} {f10} {f11} {f12}",
        //   "~ ! @ # $ % ^ & * ( ) _ + {backspace}",
        //   "{tab} Q W E R T Y U I O P { } |",
        //   '{capslock} A S D F G H J K L : " {enter}',
        //   "{shiftleft} Z X C V B N M < > ? {shiftright}",
        //   "{controlleft} {altleft} {metaleft} {space} {metaright} {altright}"
        // ]
    },
    display: {
        '{escape}': 'esc',
        '{tab}': 'tab ⇥',
        '{backspace}': 'backspace ⌫',
        '{enter}': 'enter ↵',
        '{capslock}': 'caps lock ⇪',
        '{shiftleft}': 'shift ⇧',
        '{shiftright}': 'shift ⇧',
        '{controlleft}': 'ctrl',
        '{controlright}': 'ctrl',
        '{altleft}': 'alt',
        '{altright}': 'alt',
        '{metaleft}': '⌘',
        '{metaright}': 'cmd ⌘',
        '{fn}': 'fn',
    },
    buttonTheme: [
        {
            class: 'hg-disabled',
            buttons:
                '` 1 2 3 4 5 6 7 8 9 0 = {backspace} \
                    {tab} [ ] \\ \
                    {capslock} {enter} \
                    {shiftleft} / {shiftright} \
                    {controlleft} {altleft} {metaleft} {controlright} {altright} {metaright} {fn}',
        },
    ],
});

/**
 * Physical Keyboard support
 * Whenever the input is changed with the keyboard, updating SimpleKeyboard's internal input
 */
/*document.addEventListener("keydown", event => {
  // Disabling keyboard input, as some keys (like F5) make the browser lose focus.
  // If you're like to re-enable it, comment the next line and uncomment the following ones
  event.preventDefault();
});*/

const form = document.forms[0];

form.addEventListener('submit', (event) => {
    event.preventDefault();
    let output = run(form.input.value, DEBUG);

    console.log(output);

    if (RENDER) {
        renderPresses(output.word, output.timesteps);
    }
});

// function onChange(input) {
//     document.querySelector('.input').value = input;
//     keyboard.setInput(input);

//     console.log('Input changed', input);
// }

// function onKeyPress(button) {
//     console.log('Button pressed', button);

//     /**
//      * If you want to handle the shift and caps lock buttons
//      */
//     if (
//         button === '{shift}' ||
//         button === '{shiftleft}' ||
//         button === '{shiftright}' ||
//         button === '{capslock}'
//     )
//         handleShift();
// }

// function handleShift() {
//     let currentLayout = keyboard.options.layoutName;
//     let shiftToggle = currentLayout === 'default' ? 'shift' : 'default';

//     keyboard.setOptions({
//         layoutName: shiftToggle,
//     });
// }

// document.addEventListener('keydown', (event) => {});

document.querySelector('button').addEventListener('click', function () {
    let currentLayout = keyboard.options.layoutName;
    let shiftToggle = currentLayout === 'qwerty' ? 'dvorak' : 'qwerty';

    keyboard.setOptions({
        layoutName: shiftToggle,
    });
});

// === SIMULATION ==============================================================

/* The keyboard layout is a list, each element is a row.  Then, within each row 
we have space-separated key values. */

/* To start, let's just calculate pure distance between keys, ignoring hand
positions, finger positions, and the like.  Just a Euclidean distance.

We need to  */

/* Let's make an object containing hand positions.  We can turn this into finger
positions at a later date but let's just start with this for now.

Each hand will be placed on a given row, and if a key is pressed that requires
that hand to move to a different row, then cost will be incurred. */

// === SIMULATING ==============================================================

let qw = keyboard.options.layout.qwerty;

// Which finger is (technically) responsible for which key.
// 0 is left pinky finger, then sequential to 9 as right pinky finger.
//
// In the future, this should support an additional shift state... but for now
// we'll just ignore capitalization.
let fingerIdxs = [
    [0, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9, 9, 9],
    [0, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9, 9, 9],
    [0, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9, 9],
    [0, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9],
];
let kbkeys = {};
let kbmatrix = {};

// The widths of the first key of each row
let xoffsets = [1, 1.5, 1.75, 2.25];

for (const layoutName in keyboard.options.layout) {
    let layout = keyboard.options.layout[layoutName];

    let layoutkeys = {};
    let layoutmatrix = [];

    for (let rowIdx = 0; rowIdx < 4; rowIdx++) {
        let characters = layout[rowIdx].split(' ');
        let xoffset = xoffsets[rowIdx];

        for (let colIdx = 0; colIdx < characters.length; colIdx++) {
            let character = characters[colIdx];

            layoutkeys[character] = {
                character: character,
                x: colIdx + xoffset,
                y: rowIdx,
                finger: fingerIdxs[rowIdx][colIdx],
            };
        }
    }

    for (let rowIdx = 0; rowIdx < layout.length; rowIdx++) {
        let characters = layout[rowIdx].split(' ');
        let row = [];

        for (let colIdx = 0; colIdx < characters.length; colIdx++) {
            row.push(layoutkeys[characters[colIdx]]);
        }

        layoutmatrix.push(row);
    }

    kbkeys[layoutName] = layoutkeys;
    kbmatrix[layoutName] = layoutmatrix;
}

// A run
let word = 'asdfjkl;';

// For now, we're ignoring some characters.
function parseWord(word) {
    word = word.toLowerCase();

    let re = new RegExp(`[^${ALLOWEDCHARACTERS}]`, 'g');

    return word.replace(re, '');
}
function distance(a, b) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function run(word, verbose = false) {
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
        // Spaces only add to fixed cost.
        if (character === ' ') {
            dist = 0;

            if (verbose) {
                console.log(`Typing space.`);
            }
        } else {
            let kbkey = layoutkeys[character];

            let prevKey = kbfingers[kbkey.finger];

            dist = distance(kbkey, prevKey);

            if (verbose) {
                console.log(
                    `Typing ${character} with finger ${kbkey.finger} previously on ${prevKey.character}`
                );
            }
        }

        distances.push(dist);
        let cost = dist * DISTMULTIPLIER + FIXEDCOST;
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

function handleHighlights(currChar, prevChar) {
    try {
        const currButton = keyboard.getButtonElement(currChar);
        currButton.classList.add('hg-activeButton');
    } catch {}
    try {
        const prevButton = keyboard.getButtonElement(prevChar);
        prevButton.classList.remove('hg-activeButton');
    } catch {}
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function renderPresses(word, timesteps) {
    let prevChar;
    let currChar;
    for (let idx = 0; idx < word.length; idx++) {
        currChar = word[idx];

        if (currChar === ' ') {
            currChar = '{space}';
        }

        // Visually 'type' on the keyboard
        handleHighlights(currChar, prevChar);
        prevChar = currChar;
        await sleep(timesteps[idx] * TIMEMULTIPLIER);
    }

    // Remove the highlight on the last character
    handleHighlights(currChar, prevChar);
}
