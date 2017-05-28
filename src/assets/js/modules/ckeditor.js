/**
 * A class wrapper for ckeditor, that simplifies the instantiation process.
 * @class {null} CKEDITOR
 */
export default class CkeditorClass {
    constructor(instance) {
      // setup
      this.instance = instance;
      this.$element = $(this.instance);

      // init function must be called last.
      this.init();
	}

  init() {
    $.getScript('/ckeditor/ckeditor.js', () => {
          CKEDITOR.replace(this.instance);
          // set the content of the editor if it has a value.
          CKEDITOR.instances[this.instance.id].setData(this.$element.val());
      });
  }
}

$('body').find('[data-ckeditor]').each(function(idx, item) {
    new CkeditorClass(item);
});
