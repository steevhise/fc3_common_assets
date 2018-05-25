document.addEventListener("DOMContentLoaded", ()=> {

    $("#tagselect").select2({
        placeholder: "Select a tag to edit",
        theme: "classic"
    })
    .change(function () {

        if (this.value) {
            document.location = '/admin/tags/' + this.value;
        }
    });
});


// export a constant, placeholder
export default "ADMIN_TAGS";
