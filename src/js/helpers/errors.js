
export const displayError = (msg, container = document.body) => {   // error container is what, in general?

    // get rid of any other callouts already around.
    const callouts = [...document.querySelectorAll('.callout')];
    callouts.map((el) => {
        el.remove();
    })

    // you might think, why not use fc-callout component? because it doesn't work here.
    const errEl = document.createElement('div');
    errEl.insertAdjacentHTML('afterbegin', `<p>${msg}</p>`);
    errEl.setAttribute('class', 'callout alert');
    container.prepend(errEl);
    errEl.animate([ { opacity: 1 }, { opacity: 0 } ], { delay: 9000, duration: 900, fill: 'forwards' });
}
