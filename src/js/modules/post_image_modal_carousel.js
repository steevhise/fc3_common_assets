// We need this to happen only after Orbit script finishes (otherwise, Orbit would overwrite)
window.addEventListener("load", ()=> {

  $(".orbit").each((index, carousel) => {
    scaleCarousel(carousel);
  });

  // https://css-tricks.com/snippets/jquery/done-resizing-event/
  let resizeTimer;
  $(window).on('resize', function() {

    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {

      $(".orbit").each((index, carousel) => {
        scaleCarousel(carousel);
      });

    }, 250);
  });

});

// NOTE carousel is expected to be a plain DOM element, so we can set the height as important
// This is required to override Orbit's odd resizing behavior
function scaleCarousel (carousel) {

  const contentWidth = Number($(carousel).parent().css("width").replace("px", "")) - (2 * Number($(carousel).parent().css("padding-left").replace("px", "")));
  const imgDimensions = [];
  $(carousel)
    .find("img")
    .each((index, img) => {
      imgDimensions.push({ width: img.width, height: img.height })
    });

  const proportionallyTallest = imgDimensions.reduce((acc, current) => {
    const currentLargestAr = acc.width / acc.height;
    const nextAr = current.width / current.height;
    return (nextAr < currentLargestAr ? current : acc);
  });

  const adjustedHeight = contentWidth / (proportionallyTallest.width / proportionallyTallest.height);
  carousel.querySelector(".orbit-container").style.setProperty("height", `${adjustedHeight}px`, "important");
}

export default "Post Modal Carousel";
