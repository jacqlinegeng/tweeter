$(document).ready(function() {

  $(".new-tweet textarea").on("input", function() {
    console.log($(this).val().length);
    $(".counter").text(140 - $(this).val().length);
    
    if ((140 - $(this).val().length) < 0) {
      $(".counter").addClass("red-text");
    } else {
      $(".counter").removeClass("red-text");
    }
  })
});