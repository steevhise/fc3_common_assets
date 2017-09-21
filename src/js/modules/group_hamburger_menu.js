/**
* Note: this file is provided by the fc3_common_assets package
 */
import $ from "jquery";

class GroupHamburgerMenu {

    constructor( container ) {

        //get a reference to our main container
        this.$container = $(container);
        if ( !this.$container || !this.$container.length ) {
            return;
        }

        // get a reference to the container's .group-links, to be toggled
        this.$menu = $('.group-menu-links');

        // attach click handler, to toggle menu
        this.$container.click( () => {
            this.$menu.toggleClass('group-menu-open');
            this.$container.toggleClass('active');
        });
    }
}

// setup
document.addEventListener("DOMContentLoaded", ()=> {
    const groupHamburgerMenu = new GroupHamburgerMenu(".group-hamburger-icon");
});


// export the list
export default GroupHamburgerMenu;
