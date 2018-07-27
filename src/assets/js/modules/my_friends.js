document.addEventListener("DOMContentLoaded", ()=> {

    const selectbox = $(".select-friends");

    selectbox.select2({
        minimumInputLength: 3
    });

    selectbox.change(function() {

        location.assign(`${location.protocol}//${location.host}/member/${$(".select-friends option:selected").val()}`);
    });

    // 9 b/c page is a 3 column layout, defaulting to 3x3 display
    if ($(".friend-card").length >= 9) {
        $(".friends-load-more").show();
    }

    // Display up to 10 friend cards
    $(".friend-card").each(function(i, el) {

        if (i > 8) {
            $(el).hide();
        }
    });

    // On click, display next 10
    $(".friends-load-more button").click(function() {

        $(".friend-card:hidden").each(function(i, el) {

            if (i < 9) {
                $(el).show();
            }
        });
    });
});


// export a constant, placeholder
export default "FRIENDS_SEARCH";
