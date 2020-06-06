let chart;

Highcharts.setOptions({
    colors: ["lightskyblue", "darksalmon"]
})

function cumsum(values) {
    let sum = 0;
    return Float64Array.from(values, (v) => (sum += v));
}

async function distanceChart(keyboards, text, distances) {
    let data = [[], []];

    for (let i = 0; i < distances.length; i++) {
        let dists = cumsum(distances[i]);
        for (let idx = 0; idx < distances[i].length; idx++) {
            data[i].push([
                (idx + 1) / dists.length,
                dists[idx] / 1000
            ]);
        }
    }

    chart = Highcharts.chart('distance-chart', {
        plotOptions: {
            line: {
                marker: {
                    enabled: false
                }
            }
        },
        title: undefined,
        yAxis: {
            title: {
                text: 'Travel Distance (meters)',
            }
        },
        xAxis: {
            title: {
                text: 'Characters Typed',
            },
        },
        tooltip: {
            pointFormat: '{point.y:.2f}'
        },
        series: [
            {
                name: 'QWERTY',
                data: data[0],
                // step: true,
            },
            {
                name: 'Dvorak',
                data: data[1],
                // step: true,
            },
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
function writeOutput(element, character) {

    switch (character) {
        case '\n':
            element.innerHTML += '<br />'
        default:
            element.innerHTML += character;
            break;
    }
}

async function renderPresses(keyboard, word, timesteps) {
    var initialtimescale = TIMESCALE;
    var initialresttime = RESTTIME;
    if (word.length > 200) {
        TIMESCALE = 0.3;
        RESTTIME = 0.3;
    }

    let written = document.getElementById(
        `${keyboard.options.layoutName}-written`
    ).children[0];

    let prevChar;
    let currChar;
    written.innerHTML = '';
    for (let idx = 0; idx < word.length; idx++) {
        currChar = word[idx];

        writeOutput(written, currChar);

        // Visually 'type' on the keyboard
        handleHighlights(keyboard, currChar, prevChar);
        prevChar = currChar;

        await sleep(timesteps[idx] * TIMESCALE);
    }

    // Remove the highlight on the last character
    handleHighlights(keyboard, null, prevChar);

    // Reset timescale and rest time to initial values
    TIMESCALE = initialtimescale;
    RESTTIME = initialresttime;
}
