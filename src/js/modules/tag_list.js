/**
* Note: this file is provided by the fc3_common_assets package
*/
// setup
document.addEventListener("DOMContentLoaded", ()=> {
    $(".tag-select").select2({  placeholder: window.vm.t("Select a tag to filter the list below"),});
    $(".add-tag-icon-button").click(()=>{
        $(".select2-search__field").focus();
    })
});


// export a constant, placeholder
export default "TAG_LIST";