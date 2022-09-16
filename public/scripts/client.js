/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const renderTweets = function (tweets) {
  tweets.map((tweet) => {
    const tweetElement = createTweetElement(tweet);
    $("#tweets-container").prepend(tweetElement);
  });
};

const escapeTo = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

const createTweetElement = function (tweet) {
  let $tweet = `
  <article class="tweet-form">
      <div class="tweet-account">
        <div class="tweet-name">
          <img src="${tweet.user.avatars}" width="50px" height="50px">
          <p>${tweet.user.name}</p>
        </div>

        <span class="tweet-id">${tweet.user.handle}</span>
      </div>

      <div class="tweet-content">
        <p>${escapeTo(tweet.content.text)}</p>
      </div>

      <div class="footer">
        <footer>${timeago().format(tweet.created_at)}</footer>
        <span class="icons">
          <i class="fa-solid fa-flag"></i>
          <i class="fa-solid fa-retweet"></i>
          <i class="fa-solid fa-heart"></i>
          <i class="fa-solid fa-bookmark"></i>
        </span>
      </div>
    </article>`;

  return $tweet;
};

const loadTweets = function () {
  const url = "/tweets";
  $.ajax(url, { method: "GET" }).then((tweetsFromBackEnd) => {
    $("#tweets-container").empty();
    renderTweets(tweetsFromBackEnd);
  });
};

$(document).ready(function () {
  loadTweets();

  // warnings are hidden unless triggered
  $(".warning-flags").css("display", "none")

  // submit function for submitting tweets
  $("form").submit(function (event) {
    event.preventDefault();

    // validate input length
    const length = $("#tweet-text").val().length;
    if (!length) {
      $(".warning-flags").slideDown(400, () => {
        $(".warning").text("field cannot be empty!");
        setTimeout(() => {
          $(".warning-flags").slideUp()
          $(".warning").text("")
        }, 2000)
      });

    return;
    }

    // warning for tweet over 140 chars
    if (length > 140) {
      $(".warning-flags").slideDown(400, () => {
        $(".warning").text("tweet must be under 140 characters!");
        setTimeout(() => {
          $(".warning-flags").slideUp()
          $(".warning").text("")
        }, 2000)
      });

    return;
    }

    // empty input to clear the warnings and reset counter
    $(".warning-flags").text("");

    // parsing data to the post request
    const data = $(this).serialize();
    $.ajax({
      url: `/tweets`,
      method: "POST",
      data: data,
      success: () => {
        $(".counter").text(140);
        $("#tweet-text").val("");
        loadTweets();
      },
    });
  });
});
