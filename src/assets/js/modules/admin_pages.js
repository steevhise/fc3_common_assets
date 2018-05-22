document.addEventListener("DOMContentLoaded", ()=> {

    $("#pageselect").select2({
        placeholder: "Select a page to edit",
        theme: "classic"
    })
    .change(function () {

        if (this.value) {
            document.location = '/admin/pages/' + this.value;
        }
    });
});


// export a constant, placeholder
export default "ADMIN_PAGES";
