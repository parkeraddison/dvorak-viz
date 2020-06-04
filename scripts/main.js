
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
        out.innerHTML += qwOutput.cost;
        out.innerHTML += '<br />'
        out.innerHTML += dvOutput.cost;
        renderPresses(qwKeyboard, qwOutput.word, qwOutput.timesteps);
        renderPresses(dvKeyboard, dvOutput.word, dvOutput.timesteps);
    }
});

// button.addEventListener('click', function () {
//     let currentLayout = keyboard.options.layoutName;
//     let layout = currentLayout === 'qwerty' ? 'dvorak' : 'qwerty';

//     keyboard.setOptions({
//         layoutName: layout,
//     });
// });

