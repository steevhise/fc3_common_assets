document.addEventListener("DOMContentLoaded", ()=> {

  $('[data-loading]').click(function () {
    $(this).addClass('is-loading');
    /*setTimeout(function () {
      console.log('not loading any more');
      $('[data-loading]').removeClass('is-loading');
      $('[data-successMessage]').removeClass('hide');
    }, 5000);*/
  });

});

export default "Loading";