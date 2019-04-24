/**
* Note: this file is provided by the fc3_common_assets package
 */
import $ from "jquery";

class DropdownMenu {

    constructor( container ) {
        //get a reference to our main container
        this.$menus = $(container);
        if ( !this.$menus || !this.$menus.length )
            return;

        this.toggleClass = ".custom-dropdown-toggle";
        this.activeClass = "active";

        this.$menus.each((i, menu) => {
            $(menu).find(this.toggleClass).on('click', () => {
                $(menu).toggleClass('active');
            });
       });        
    }
}

// Initialize Dropdowns
document.addEventListener("DOMContentLoaded", ()=> {
    const dropdowns = new DropdownMenu("[data-custom-dropdown]");
});

export default DropdownMenu;
