let distanceChart;
let rowChart;
let handChart;

document.addEventListener('DOMContentLoaded', function () {
    Highcharts.setOptions({
        colors: ['lightskyblue', 'darksalmon'],
        credits: {
            enabled: false,
        },
        title: {
            style: {
                color: 'var(--text-color-light)',
                fontWeight: 'bold',
                fontSize: '16px',
                padding: '1em',
            },
        },
    });
});

function cumsum(values) {
    let sum = 0;
    return Float64Array.from(values, (v) => (sum += v));
}

async function drawHandChart(text, alternatings) {
    let data = alternatings.map((d) => (d / (text.length - 1)) * 100);

    handChart = Highcharts.chart('hand-chart', {
        plotOptions: {
            column: {
                colorByPoint: true,
            },
        },
        chart: {
            type: 'column',
        },
        tooltip: {
            formatter: function () {
                let percents = this.series.yData.map(
                    (d) => Math.round(d) + '%'
                );
                return `
                <b>QWERTY:</b> ${percents[0]} 
                <br />
                <b>Dvorak:</b> ${percents[1]} 
                `;
            },
        },
        title: {
            text: 'Percent keystrokes that alternated hands',
        },
        xAxis: {
            categories: ['QWERTY', 'Dvorak'],
            labels: {
                style: {
                    fontSize: '16px',
                },
            },
        },
        yAxis: {
            title: undefined,
            labels: {
                format: '{value}%',
            },
        },
        series: [
            {
                data: data,
                showInLegend: false,
                dataLabels: {
                    enabled: true,
                    // pointFormat: '{point.y:.0f}',
                    pointFormat: `
                    <span style="color: #fffa; font-size: 20px;">
                    {point.y:.0f}%
                    </span>`,
                    useHTML: true,
                    inside: true,
                    align: 'center',
                },
            },
        ],
    });
}

async function drawRowChart(rowUsages) {
    let data = [];

    for (const idx in rowUsages[0]) {
        data.push([rowUsages[0][idx], rowUsages[1][idx]]);
    }

    rowChart = Highcharts.chart('row-chart', {
        plotOptions: {
            column: {
                stacking: 'percent',
                // colorByPoint: true,
            },
            series: {
                dataLabels: {
                    pointFormat: `
                    <span style="color: #fffa; z-index: 0; font-size: 20px;">
                    <small>{series.name}</small>
                    
                    {point.percentage:.0f}%
                    </span>`,
                    useHTML: true,
                    crop: false,
                    allowOverlap: false,
                    align: 'center',
                },
            },
        },
        // colors: ['#E9967A', '#9F87AF', '#776472', '#87CEFA', '#F08080'],
        // colors: ['#87CEFA', '#A8BBCF', '#C8A9A5', '#E9967A'],
        // colors: ['#776472', '#E9967A', '#87CEFA', '#EC5766', '#C8A9A5', ],
        colors: ['#619B8A', '#A1C181', '#99C24D', '#EC5766'],
        chart: {
            type: 'column',
            // marginTop: 20,
        },
        tooltip: {
            formatter: function () {
                let percents = this.series.yData.map(
                    (d) => Math.round((d / this.total) * 100) + '%'
                );
                return `
                ${this.series.name}
                <br />
                <b>QWERTY:</b> ${percents[0]} 
                <br />
                <b>Dvorak:</b> ${percents[1]} 
                `;
            },
        },
        title: {
            text: 'Row distribution of typed characters',
        },
        yAxis: {
            title: undefined,
            labels: {
                format: '{value}%',
            },
            // gridLineColor: 'transparent',
            // visible: false,
        },
        xAxis: {
            categories: ['QWERTY', 'Dvorak'],
            labels: {
                style: {
                    fontSize: '16px',
                },
            },
        },
        legend: {
            enabled: false,
            // layout: 'proximate',
            // align: 'center',
            // x: 20,
            // y: 30,
            // useHTML: true,
            // floating: true,
        },
        series: [
            {
                name: 'Numeric row',
                data: data[0],
                showInLegend: data[0].some((d) => d > 0),
                dataLabels: {
                    enabled: data[0].some((d) => d > 0),
                },
            },
            {
                name: 'Top row',
                data: data[1],
                showInLegend: data[1].some((d) => d > 0),
                dataLabels: {
                    enabled: data[1].some((d) => d > 0),
                },
            },
            {
                name: 'Home row',
                data: data[2],
                showInLegend: data[2].some((d) => d > 0),
                dataLabels: {
                    enabled: data[2].some((d) => d > 0),
                },
                legend: {
                    valueSuffix: '<br />(bigger is better)',
                },
            },
            {
                name: 'Bottom row',
                data: data[3],
                showInLegend: data[3].some((d) => d > 0),
                dataLabels: {
                    enabled: data[3].some((d) => d > 0),
                },
                legend: {
                    valueSuffix: '<br />(smaller is better)',
                },
            },
        ],
    });
}

async function drawDistanceChart(keyboards, text, distances) {
    let data = [[], []];

    for (let i = 0; i < distances.length; i++) {
        let dists = cumsum(distances[i]);
        for (let idx = 0; idx < distances[i].length; idx++) {
            data[i].push([idx + 1, dists[idx] / 1000]);
        }
    }

    distanceChart = Highcharts.chart('distance-chart', {
        plotOptions: {
            line: {
                marker: {
                    enabled: false,
                },
                lineWidth: 3,
            },
        },
        credits: {
            enabled: false,
        },
        chart: {
            // marginTop: 60,
            marginLeft: 100,
            marginRight: 80,
        },
        title: {
            text: 'Travel distance of fingers',
        },
        yAxis: {
            title: {
                text: 'Distance (meters)',
                align: 'high',
                offset: 0,
                rotation: 0,
                y: -10,
            },
        },
        xAxis: {
            title: {
                text: 'Characters Typed',
            },
        },
        tooltip: {
            formatter: function () {
                // Return the surrounding six characters (+- 3) with the
                // currently typed character in bold, followed by the distances.
                let idx = this.points[0].point.x - 1;
                let characterText = `${text.slice(
                    Math.max(idx - 3, 0),
                    idx
                )}<b><u>${text[idx]}</u></b>${text.slice(idx + 1, idx + 4)}`;
                let distanceText = this.points
                    .map((point, i) => {
                        return `<span style="color:${point.color}">●</span> ${
                            point.series.name
                        }: <b>${point.y.toFixed(2)} meters</b>
                        (+${distances[i][idx].toFixed(1)}mm)
                        <br/>`;
                    })
                    .join('');
                return `<span class="tooltip-characters">${characterText}</span><br />${distanceText}`;
            },
            shared: true,
            useHTML: true,
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

async function pressButton(keyboard, character, resttime) {
    try {
        const keyButton = keyboard.getButtonElement(character);
        keyButton.classList.add('hg-activeButton');
        await sleep(resttime);
        keyButton.classList.remove('hg-activeButton');
    } catch {}
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function writeOutput(element, character) {
    switch (character) {
        case '\n':
            element.innerHTML += '<br />';
        default:
            element.innerHTML += character;
            break;
    }
}
async function renderPresses(keyboard, word, timesteps) {

    let layoutName = keyboard.options.layoutName;
    let layoutkeys = {...kbkeys[layoutName], ...kbkeys[layoutName + 'Shift']};
    let layoutmatrix = kbmatrix[layoutName];

    let timescale = TIMESCALE;
    let resttime = RESTTIME;

    let written = document.getElementById(
        `${keyboard.options.layoutName}-written`
    ).children[0];

    let timeToType = (word.length / 5 / 70) * 60; // How long to write at 70 WPM

    if (timeToType > 8) {
        timescale *= 8 / timeToType; // Want it to take about 10 seconds.
    }
    if (word.length > 1500) {
        // The typing action slows us down considerably by at this point.
        // Skip the typing animation.
        //
        // Though, hopefully still draw a path or something to demonstrate that
        // they indeed typed.
        //
        //! TODO: Add a note recommending to type less characters!
        written.innerText = word;
        return;
    }

    let currChar;
    let currKey;
    written.innerHTML = '';
    for (let idx = 0; idx < word.length; idx++) {
        currChar = word[idx];
        // Get key at the same index on the un-shifted layout
        currKey = layoutkeys[currChar === ' ' ? '{space}' : currChar];
        let keyChar = layoutmatrix[currKey.y][currKey.x];

        writeOutput(written, currChar);

        // Visually 'type' on the keyboard
        pressButton(keyboard, keyChar.character, resttime);

        await sleep(timesteps[idx] * timescale);
    }
    return;
}

// Make bar category labels larger
