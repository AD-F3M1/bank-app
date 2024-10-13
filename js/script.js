$(document).ready(function() {
    // Initially hide both logo and text
    $('.animate-logo').css({
      opacity: 0,
      position: 'relative',
      left: '-50px'  // Move logo slightly off to the left
    });

    // Step 1: Animate the logo (wallet) appearing first
    $('.animate-logo').animate({
      opacity: 1,
      left: '0'   // Move the logo back to its original position
    }, 2500, 'easeInOutCubic', function() {
      // Step 2: Animate the text appearing one by one with smoother fade-in
      let text = "BANK".split(""); // Split the text into individual letters
      let delay = 0;  // Initialize delay

      // Loop through each letter
      text.forEach(function(letter) {
        delay += 250;  // Increment delay for each letter for smoother spacing
        $('<span>' + letter + '</span>').css({ opacity: 0 }).appendTo('.animate-text').delay(delay).animate({
          opacity: 1
        }, 800, 'easeInOutCubic');  // Smooth fade-in for each letter with easing
      });
    });
  });