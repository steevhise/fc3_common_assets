// We need this to happen only after Orbit script finishes (otherwise, Orbit would overwrite)
window.addEventListener("load", ()=> {

  // This exists solely to quick-and-dirtily ensure the post detail images
  // actual display in the "view full size" modal
  // By default, they don't, due to some positioning setting conflict that wasn't
  // worth digging into and fiddling w/ :)
  if ($("#modal-height-hack").length) {
    $("#modal-height-hack").height("100%");
  }

});

export default "Post Modal Carousel";
