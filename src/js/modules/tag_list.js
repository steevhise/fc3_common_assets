/**
* Note: this file is provided by the fc3_common_assets package
*/
// setup - we have to wait til translation resources are loaded
$(":root").on("i18nLoaded", null, null, () => {
    const placeholder = window.vm.$root.t("Select a tag to filter");
    $(".tag-select").select2({  placeholder });
    $(".add-tag-icon-button").click(()=>{
        $(".select2-search__field").focus();
    })
});


// export a constant, placeholder
export default "TAG_LIST";