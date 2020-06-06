const form = document.forms[0];
// const button = document.querySelector('button');
const written = document.querySelectorAll('[id$="-written"]');
const score = document.querySelectorAll('[id$="-score"]');
const explanation = document.querySelector('#keyboards #explanation');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    typerace(form.input.value);
});

function writeScore(element, output) {
    element.innerHTML = `
    Time: ${((output.cost * TIMESCALE) / 1000).toFixed(2)}s
    <br />
    Travel Distance: ${(output.distance / 1000).toFixed(2)}m
    `;
}

async function typerace(text) {
    document.getElementById('typerace').scrollIntoView({
        behavior: 'smooth',
        block: 'start',
    });

    let qwOutput = run(qwKeyboard, text, DEBUG);
    let dvOutput = run(dvKeyboard, text, DEBUG);

    console.log(qwOutput);
    console.log(dvOutput);

    renderPresses(qwKeyboard, qwOutput.word, qwOutput.timesteps).then(
        function () {
            writeScore(score[0], qwOutput);
            Array.from(
                document.getElementsByClassName('qwerty-hidden')
            ).forEach(element => {
                element.classList.add("revealed");
            });
        }
    );
    renderPresses(dvKeyboard, dvOutput.word, dvOutput.timesteps).then(
        function () {
            writeScore(score[1], dvOutput);
            Array.from(
                document.getElementsByClassName('dvorak-hidden')
            ).forEach(element => {
                element.classList.add("revealed");
            });
        }
    );

    distanceChart([qwKeyboard, dvKeyboard], text, [
        qwOutput.distances,
        dvOutput.distances,
    ]);
}

const passage = document.getElementById('passage');
async function renderPassage() {
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

var explanationRevealed = false;
var distanceChartRevealed = false;
var passageRendered = false;
document.addEventListener('scroll', scrollTriggers);
function scrollTriggers() {
    let middlePage = window.pageYOffset + window.innerHeight / 2;

    if (!explanationRevealed && middlePage >= explanation.offsetTop) {
        explanation.classList.add('revealed');
    }
    // if (!distanceChartRevealed && middlePage >= distanceChart.offsetTop) {

    // }
    if (!passageRendered && middlePage >= passage.offsetTop) {
        renderPassage();
        passageRendered = true;
    }
}

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
    scrollTriggers();
    smartquotes().listen();
});

function randomLetters(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return result;
}
