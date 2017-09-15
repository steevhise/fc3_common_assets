/**
 * A simple method that grabs all post type buttons,
 * and allows us to determine whether or not it is active.
 * 
 * @method PostEditNew
 */
const PostEditNew = () => {
   const $postTypes = $('[data-post-buttongroup] [data-post-typebutton]');
   const $root = $('[data-post-buttongroup]');

   $postTypes.each(function(idx, item) {
        $(this).on('click', function(e) {
            e.preventDefault();
            clearActives($postTypes);
            $(this).toggleClass('active');
        });
    });
};

/**
 * This method is used to clear the active classes
 * 
 * @method clearActives
 * @param {Array} items an array of items.
 */
const clearActives = (items) => {
    $(items).each(function() {
        $(this).removeClass('active');
    });
};

// on document ready call the PostEditNew function.
$('document').ready(function() {
    new PostEditNew();
});

export default PostEditNew;