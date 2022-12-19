$('document').ready(function () {
    const carousel = new bootstrap.Carousel('#myCarousel', {
        interval: 10000
    });

    // Select the button and main content elements
    const button = $('#scroll-button');
    const mainContent = $('#main-content');

    // Add a click event listener to the button
    button.click(function() {
      // Animate the scroll to the main content using jQuery's animate() function
      $('html, body').animate({
        scrollTop: mainContent.offset().top
      }, 1); // 1 is the duration of the animation in milliseconds
    });

})
