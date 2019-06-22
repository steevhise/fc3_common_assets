/**
* Note: this file is provided by the fc3_common_assets package
 */
/**
 * A simple method that grabs all post type buttons,
 * and allows us to determine whether or not it is active.
 *
 * @method PostEditNew
 */
const PostEditNew = function() {

   const roots = $('[data-post-buttongroup]');

   roots.each((i, root) => {

      const input = $(root).find('input[type=hidden]');
      const options = $(root).find('[data-post-typebutton]');

      options.each((j, option) => {

         $(option).on('click', (e) => {

           e.preventDefault();

           input.val($(option).data('value')).trigger('input');

           clearActives(options);
           $(option).toggleClass('active');
         });
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

    items.each((i, item) => {

        $(item).removeClass('active');
    });
};

// on document ready call the PostEditNew function.
$('document').ready(function() {
    new PostEditNew();
});

export default PostEditNew;
