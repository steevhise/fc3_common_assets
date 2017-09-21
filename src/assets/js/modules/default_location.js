// setup
document.addEventListener("DOMContentLoaded", ()=> {
  $(".default-location").select2();
  select2_sortable($(".language-prefs"));
});

//allow select2 field selections to be draggable
function select2_sortable($select2){
    var ul = $select2.next('.select2-container').first('ul.select2-selection__rendered');
    ul.sortable({
        placeholder : 'ui-state-highlight',
        forcePlaceholderSize: true,
        items       : 'li:not(.select2-search__field)',
        tolerance   : 'pointer',
        stop: function() {
            $($(ul).find('.select2-selection__choice').get().reverse()).each(function() {
                var id = $(this).data('data').id;
                var option = $select2.find('option[value="' + id + '"]')[0];
                $select2.prepend(option);
            });
        }
    });
}
// export a constant, placeholder
export default "DEFAULT_LOCATION";