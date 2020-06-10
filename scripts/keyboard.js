let Keyboard = window.SimpleKeyboard.default;

let layouts = {
    qwerty: [
        '` 1 2 3 4 5 6 7 8 9 0 - = {backspace}',
        '{tab} q w e r t y u i o p [ ] \\',
        "{capslock} a s d f g h j k l ; ' {enter}",
        '{shiftleft} z x c v b n m , . / {shiftright}',
        '{controlleft} {metaleft} {altleft} {space} {altright} {fn} {controlright}',
    ],
    qwertyShift: [
        '~ ! @ # $ % ^ & * ( ) _ + {backspace}',
        '{tab} Q W E R T Y U I O P { } |',
        "{capslock} A S D F G H J K L : \" {enter}",
        '{shiftleft} Z X C V B N M < > ? {shiftright}',
        '{controlleft} {metaleft} {altleft} {space} {altright} {fn} {controlright}',
    ],
    dvorak: [
        '` 1 2 3 4 5 6 7 8 9 0 [ ] {backspace}',
        "{tab} ' , . p y f g c r l / = \\",
        '{capslock} a o e u i d h t n s - {enter}',
        '{shiftleft} ; q j k x b m w v z {shiftright}',
        '{controlleft} {metaleft} {altleft} {space} {altright} {fn} {controlright}',
    ],
    dvorakShift: [
        '~ ! @ # $ % ^ & * ( ) {  } {backspace}',
        "{tab} \" < > P Y F G C R L ? + |",
        '{capslock} A O E U I D H T N S _ {enter}',
        '{shiftleft} : Q J K X B M W V Z {shiftright}',
        '{controlleft} {metaleft} {altleft} {space} {altright} {fn} {controlright}',
    ],
}

let display = {
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
}

let buttonTheme = [
    {
        class: 'hg-disabled',
        buttons:
            '{backspace} \
                {tab} \
                {capslock} {enter} \
                {shiftleft} {shiftright} \
                {controlleft} {altleft} {metaleft} {controlright} {altright} {metaright} {fn}',
    },
    {
        class: 'hg-normal-width',
        buttons:
            "` 1 2 3 4 5 6 7 8 9 0 - = \
            q w e r t y u i o p [ ] \
            a s d f g h j k l ; ' \
            z x c v b n m , . /"
    },
    {
        class: 'hg-button-backslash',
        buttons: '\\'
    }
]

let commonKeyboardOptions = {
    // onChange: (input) => onChange(input),
    // onKeyPress: (button) => onKeyPress(button),
    theme: 'simple-keyboard hg-theme-default hg-layout-default',
    // physicalKeyboardHighlight: true,
    // syncInstanceInputs: true,
    mergeDisplay: true,
    // debug: true,
    layout: layouts,
    display: display,
    buttonTheme: buttonTheme
};


let qwKeyboard = new Keyboard('qwerty-keyboard', {
    ...commonKeyboardOptions,
    layoutName: 'qwerty'
});

let dvKeyboard = new Keyboard('dvorak-keyboard', {
    ...commonKeyboardOptions,
    layoutName: 'dvorak'
});




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
    [-1, -1, -1, -1, -1, -1, -1, -1]
];
let kbkeys = {};
let kbmatrix = {};

for (const layoutName in layouts) {
    let layout = layouts[layoutName];

    let layoutkeys = {};
    let layoutmatrix = [];

    for (let rowIdx = 0; rowIdx < 5; rowIdx++) {
        let characters = layout[rowIdx].split(' ');

        for (let colIdx = 0; colIdx < characters.length; colIdx++) {
            let character = characters[colIdx];

            layoutkeys[character] = {
                character: character,
                x: colIdx,
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

