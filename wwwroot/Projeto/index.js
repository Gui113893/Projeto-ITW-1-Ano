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

    $('.card').on('mouseenter', function() {
      $(this).addClass('shadow-lg').css('transform', 'translateY(-5px)');
    });
    
    $('.card').on('mouseleave', function() {
      $(this).removeClass('shadow-lg').css('transform', 'translateY(0)');
    });

    $('#athletes-card').on('click', function() {
      window.location.href = 'athletes.html';
    });
    
    $('#competitions-card').on('click', function() {
      window.location.href = 'competitions.html';
    });
    
    $('#countries-card').on('click', function() {
      window.location.href = 'countries.html';
    });
    
    $('#games-card').on('click', function() {
      window.location.href = 'games.html';
    });
    
    $('#modalities-card').on('click', function() {
      window.location.href = 'modalities.html';
    });
});
