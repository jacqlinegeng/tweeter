$(document).ready(function() {

  $("#tweet-text").on("input", function() {
    let len = $(this).val().length
    $(".counter").text(140 - len);
    
    if ((140 - $(this).val().length) < 0) {
      $(".counter").addClass("red-text");
    } else {
      $(".counter").removeClass("red-text");
    }
  })

});

