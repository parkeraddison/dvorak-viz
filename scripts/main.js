/* 
TODO:
- average wpm, character per second                 (bar)
- total distance (in understandable units)          (scoreboard)
    - Standard keycap size is 18mm square.
    - maybe I can do a "same as 3 football fields" or draw on map if it's large
    enough... but that would be *very* large.
- paths on keyboard                                 (abstract)
- full distance (not using fingers)
    - full distance compared to finger distance
- row usage (?)                                     (pie)
- alphabetical keyboard (?)
- chart of Dvorak versus QWERTY sales (or something similar)
    - can stylize this?  Maybe it's like number of characters highlighted in a
    passage is proportional to sales.  And only the very last word will be in
    the Dvorak color!
    - https://www.csmonitor.com/1995/0817/17092.html
    Less than 1% of the population uses Dvorak.
    - https://thenewstack.io/the-geeks-who-use-alternate-keyboard-layouts/
    100,000 use Colemak
    - https://www.reddit.com/r/dvorak/comments/b7e62v/estimated_number_of_dvorak_users/
      https://www.bbc.com/worklife/article/20180521-why-we-cant-give-up-this-odd-way-of-typing
    0.1% of a keyboard manufacturer Matais (known for Dvorak keyboards!) are 
    even Dvorak. <--- I'll go with this number ;)
    P(Dvorak | DV) = 1
    P(DV) = 0.001
    P(DV | Dvorak) =? 0.1, P(QW | Dvorak) =? 0.9
    
    P(A | B) = P(B | A)P(A) / P(B)
    => P(B) = P(B | A)P(A) / P(A | B)
    => P(Dvorak) = P(Dvorak | DV) P(DV) / P(DV | Dvorak)
    => P(Dvorak) = 1 * 0.001 / 0.1 = 0.01 = 1%.

- interface / design
- title
- explanations / callouts
- text presets

*/




const form = document.forms[0];
const button = document.querySelector('button');
const written = document.getElementById('written');
const out = document.getElementById('out');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    let qwOutput = run(qwKeyboard, form.input.value, DEBUG);
    let dvOutput = run(dvKeyboard, form.input.value, DEBUG);

    console.log(qwOutput);
    console.log(dvOutput);

    if (RENDER) {
        out.innerHTML = ''
        out.innerHTML += qwOutput.cost * TIMESCALE / 1000;
        out.innerHTML += '<br />'
        out.innerHTML += dvOutput.cost * TIMESCALE / 1000;
        renderPresses(qwKeyboard, qwOutput.word, qwOutput.timesteps);
        renderPresses(dvKeyboard, dvOutput.word, dvOutput.timesteps);
        drawChart([qwKeyboard, dvKeyboard], qwOutput.word, [qwOutput.timesteps, dvOutput.timesteps]);
    }
});

// button.addEventListener('click', function () {
//     let currentLayout = keyboard.options.layoutName;
//     let layout = currentLayout === 'qwerty' ? 'dvorak' : 'qwerty';

//     keyboard.setOptions({
//         layoutName: layout,
//     });
// });

