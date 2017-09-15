// setup
document.addEventListener("DOMContentLoaded", ()=> {
    $(".tag-select").select2({  placeholder: "Select an tag...",});
    $(".add-tag-icon-button").click(()=>{
        $(".select2-search__field").focus();
    })
});


// export a constant, placeholder
export default "TAG_LIST";