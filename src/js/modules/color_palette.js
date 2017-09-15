import $ from "jquery";

class ColorPalette {

    constructor( container ) {

        //get a reference to our main container
        this.$container = $(container);
        if ( !this.$container || !this.$container.length ) {
            return;
        }

        // get all color panels
        this.$panels = $('.color-palette-group-panel', this.$container);

        // iterate over each
        // extract the bg-color of the element, and substitute the value as text into the empty <span> inside the div
        this.$panels.each( (index,panel) => {

            // get bgColor of panel
            let $panel = $(panel);
            let bgColor = $panel.css('backgroundColor');

            // convert rgb to hex
            let bg = bgColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            function hex(x) {
                return ("0" + parseInt(x).toString(16)).slice(-2);
            }
            bgColor = "#" + hex(bg[1]) + hex(bg[2]) + hex(bg[3]);

            // substitute value into empty span
            $panel.find('span').text(bgColor);

        });
    }


}

// setup
document.addEventListener("DOMContentLoaded", ()=> {
    const colorPalette = new ColorPalette(".color-palette");
});


// export the list
export default ColorPalette;