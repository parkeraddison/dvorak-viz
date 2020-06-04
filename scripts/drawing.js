

let chart;

function cumsum(values) {
    let sum = 0;
    return Float64Array.from(values, (v) => (sum += v));
}

async function drawChart(keyboards, word, timesteps) {
    let data = [
        [],
        []
    ];

    for (let i = 0; i < timesteps.length; i++) {
        let times = cumsum(timesteps[i]);
        for (let idx = 0; idx < timesteps[i].length; idx++) {
            data[i].push([times[idx] * TIMESCALE / 1000, (idx + 1) / times.length]);
        }
    }

    chart = Highcharts.chart('chart-area', {
        chart: {
            events: {
                load: function () {
                    let series = this.series[0];
                },
            },
        },
        title: {
            text: word,
        },
        yAxis: {
            title: {
                text: 'Proportion complete',
            },
            max: 1
        },
        xAxis: {
            title: {
                text: 'Time (s)',
            },
        },
        series: [
            {
                name: 'QWERTY',
                data: data[0],
            },
            {
                name: 'Dvorak',
                data: data[1]
            }
        ],
    });
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
    let written = document.getElementById(
        `${keyboard.options.layoutName}-written`
    );

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
