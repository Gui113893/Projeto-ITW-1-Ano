$().ready(function () {
  const carousel = new bootstrap.Carousel('#myCarousel', {
      interval: 10000
  });

  // Select the button and main content elements
  const button = $('#scroll-button');
  const mainContent = $('#main-content');
    
  function hideScrollbar() {
    // hide the scrollbar
    document.body.style.overflowY = 'hidden';
  }
  
  window.addEventListener('load', function() {
    // get the current scroll position
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;  
    // if the scroll position is at the top of the page, hide the scrollbar
    if (scrollTop === 0) {
      hideScrollbar();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  // Add a click event listener to the button
  button.click(function() {
    // Animate the scroll to the main content using jQuery's animate() function
    $('html, body').animate({
      scrollTop: mainContent.offset().top
    }, 500); // 500 is the duration of the animation in milliseconds
  
    // show the scrollbar
    document.body.style.overflowY = 'scroll';
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

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting){
        entry.target.classList.add("show");
      } else {
        entry.target.classList.remove("show");
      }
    });
  });

  const hiddenElements = document.querySelectorAll(".hidden");
  hiddenElements.forEach((el) => observer.observe(el));

  $("#viewmore_games").click(function(){
    window.location.href = 'games.html';
  });

  let chartData; // declare a global variable to store the data

  $.ajax({
    type: 'GET',
    url: 'http://192.168.160.58/Olympics/api/Statistics/Games_Athletes',
    success: function(data) {
      chartData = data.map(item => ({ x: item.Name, y: item.Counter })); // map the data to the desired format
      createChart(); // call the createChart function
    },
  });

  function createChart() {
    const ctx = document.getElementById('myChart').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          data: chartData,
          label: 'Number of athletes',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          xAxes: [{
            type: 'category', // change the type of the x-axis to 'category'
            labels: chartData.map(item => item.x) // specify the labels for the x-axis
          }]
        }
      }
    });
  }



});
