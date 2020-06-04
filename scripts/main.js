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
- modify distance calculation:
    - After typing a key, the finger should return back to the home positions
    after a letter or two passes without them being called.
    - This can wait
- interface / design
- title
- explanations / callouts
- text presets

Ideas for conclusions:
- End with a viz on economic impact of typing speed?
- I still like the Dvorak sales

*/

const form = document.forms[0];
// const button = document.querySelector('button');
const written = document.querySelectorAll('[id$="-written"]');
const score = document.querySelectorAll('[id$="-score"]');

form.addEventListener('submit', (event) => {

    event.preventDefault();
    let qwOutput = run(qwKeyboard, form.input.value, DEBUG);
    let dvOutput = run(dvKeyboard, form.input.value, DEBUG);

    console.log(qwOutput);
    console.log(dvOutput);

    score[0].innerHTML = `Time: ${((qwOutput.cost * TIMESCALE) / 1000).toFixed(2)}s
    <br />
    Distance: ${(qwOutput.distance / 1000).toFixed(2)} meters
    ` 
    score[1].innerHTML = `Time: ${((dvOutput.cost * TIMESCALE) / 1000).toFixed(2)}s
    <br />
    Distance: ${(dvOutput.distance / 1000).toFixed(2)} meters
    ` 
    if (RENDER) {
        renderPresses(qwKeyboard, qwOutput.word, qwOutput.timesteps);
        renderPresses(dvKeyboard, dvOutput.word, dvOutput.timesteps);
        drawChart([qwKeyboard, dvKeyboard], qwOutput.word, [
            qwOutput.timesteps,
            dvOutput.timesteps,
        ]);
    }
});

// Visualize Dvorak sales
// fetch('./static/curse-of-qwerty-jared-diamond.txt')
// .then((res) => res.text())
// .then((text) => {
async function visualizeSales() {
    let text =
        'The only real obstacle to our adoption of the Dvorak keyboard is that familiar fear of abandoning a long-held commitment. But if we were to overcome that fear, millions of our children would be able to learn to type with increased speed, greatly lowered finger fatigue, greater accuracy, and a reduced sense of frustration. That seems reason enough to end our commitment to QWERTY, a bad marriage that has long outlived its original justification.';

    let textOutput = await run(qwKeyboard, text, false);

    let textNode = document.getElementById('dvorak-sales');

    let numToHighlight = Math.round(text.length * 0.001);
    let endIdx = text.length;
    let startIdx = text.length - numToHighlight - 1;

    let timescale = 0.8;
    // let easing = t => (--t)*t*t*t*t+1
    let prevChar;
    let currChar;
    textNode.innerHTML = '';
    for (let idx = 0; idx < text.length; idx++) {
        currChar = text[idx];

        if (idx >= startIdx) {
            currChar = '<span class="highlight">' + currChar;
        }

        writeOutput(textNode, currChar);
        prevChar = currChar;

        // Make timescale longer at the end
        if (idx == startIdx - 1) {
            timescale *= 30;
        }
        let timing = timescale;
        switch (currChar) {
            case '.':
                timing *= 10;
                break;
            case ',':
                timing *= 2;
                break;
            default:
                break;
        }

        await sleep(textOutput.timesteps[idx] * timing);
    }

    return true;
}

visualizeSales();
// });

document.addEventListener('DOMContentLoaded', function init() {
    form.input.focus();
    form.input.addEventListener('keypress', function submitOnEnter(e) {
        if (e.which === 13) {
            event.target.form.dispatchEvent(new Event('submit', {cancelable: true}));
            e.preventDefault();
        }
    });
});
