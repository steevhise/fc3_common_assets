import $ from "jquery";

class HamburgerMenu {

    constructor( container ) {

        //get a reference to our main container
        this.$container = $(container);
        if ( !this.$container || !this.$container.length ) {
            return;
        }

        // get a reference to the .header-links, to be toggled
        this.$menu = $('.header-links');

        // attach click handler, to toggle menu
        this.$container.click( () => {
            this.$menu.toggleClass('hamburger-menu-open');
            this.$container.toggleClass('active');
        });

    }


}

// setup
document.addEventListener("DOMContentLoaded", ()=> {
    const hamburgerMenu = new HamburgerMenu(".hamburger-icon");
});


// export the list
export default HamburgerMenu;