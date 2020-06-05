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
    document.getElementById('typerace').scrollIntoView({
        behavior: 'smooth',
        block: 'start',
    });

    event.preventDefault();
    let qwOutput = run(qwKeyboard, form.input.value, DEBUG);
    let dvOutput = run(dvKeyboard, form.input.value, DEBUG);

    console.log(qwOutput);
    console.log(dvOutput);

    score[0].innerHTML = `Time: ${((qwOutput.cost * TIMESCALE) / 1000).toFixed(
        2
    )}s
    <br />
    Travel Distance: ${(qwOutput.distance / 1000).toFixed(2)}m
    `;
    score[1].innerHTML = `Time: ${((dvOutput.cost * TIMESCALE) / 1000).toFixed(
        2
    )}s
    <br />
    Travel Distance: ${(dvOutput.distance / 1000).toFixed(2)}m
    `;
    if (RENDER) {
        renderPresses(qwKeyboard, qwOutput.word, qwOutput.timesteps);
        renderPresses(dvKeyboard, dvOutput.word, dvOutput.timesteps);
        drawChart([qwKeyboard, dvKeyboard], qwOutput.word, [
            qwOutput.timesteps,
            dvOutput.timesteps,
        ]);
    }
});

const passage = document.getElementById('passage');
async function visualizeSales() {
    let text = `Dvorak typists began to sweep typing speed contests two years later, and they have held most typing records ever since. A large-scale comparative test of several thousand children, carried out in the Tacoma schools in the 1930s, showed that children learned Dvorak typing in one- third the time required to attain the same standard with QWERTY typing. When the U.S. Navy faced a shortage of trained typists in World War II, it experimented with retraining QWERTY typists to use Dvorak. The retraining quickly enabled the Navy’s test typists to increase their typing accuracy by 68 percent and their speed by 74 percent. Faced with these convincing results, the Navy ordered thousands of Dvorak typewriters.

        They never got them. The Treasury Department vetoed the Navy purchase order, probably for the same reason that has blocked acceptance of all improved, non-QWERTY keyboards for the last 80 years: the commitment to QWERTY of tens of millions of typists, teachers, salespeople, office managers, and manufacturers. Even when daisy wheels and computer printers replaced type bars, forever banishing the jamming problem that had originally motivated QWERTY, manufacturers of the efficient new technologies carried on the inefficient old keyboard. August Dvorak died in 1975, a bitter man: I’m tired of trying to do something worthwhile for the human race, he complained. They simply don’t want to change!`;

    let textOutput = await run(qwKeyboard, text, false);

    let numToHighlight = Math.round(text.length * 0.001);
    let endIdx = text.length;
    let startIdx = text.length - numToHighlight;

    let timescale = 0.6;
    let prevChar;
    let currChar;
    passage.innerHTML = '';
    for (let idx = 0; idx < text.length; idx++) {
        currChar = text[idx];

        if (idx >= startIdx) {
            currChar = '<span class="highlight">' + currChar;
        }

        writeOutput(passage, currChar);
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
            case ':':
                timing *= 5;
                break;
            default:
                break;
        }

        await sleep(textOutput.timesteps[idx] * timing);
    }

    document.querySelector('#conclusion aside').classList.remove('hidden');
    document.querySelector('#conclusion aside').classList.add('revealed');
}

var passageRendered = false;
document.addEventListener('scroll', function triggerPassage() {
    if (
        window.pageYOffset + window.innerHeight / 2 >= passage.offsetTop &&
        !passageRendered
    ) {
        visualizeSales();
        passageRendered = true;
    }
});
// });

document.addEventListener('DOMContentLoaded', function init() {
    // Check if the form is in view on page load.  If so, then pull focus.
    let bounding = form.input.getBoundingClientRect();
    if (
        bounding.top >= 0 &&
        bounding.bottom <=
            (window.innerHeight || document.documentElement.clientHeight)
    ) {
        form.input.focus();
    }
    form.input.addEventListener('keypress', function submitOnEnter(e) {
        if (e.which === 13) {
            event.target.form.dispatchEvent(
                new Event('submit', { cancelable: true })
            );
            e.preventDefault();
        }
    });
    smartquotes().listen();
});
