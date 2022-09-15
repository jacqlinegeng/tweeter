/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// const sanitize = (string) => {
//   const map = {
//     "&": "&amp;",
//     "<": "&lt;",
//     ">": "&gt;",
//     '"': "&quot;",
//     "'": "&#x27;",
//     "/": "&#x2F;",
//   };
//   const reg = /[&<>"'/]/gi;
//   return string.replace(reg, (match) => map[match]);
// };

// const data = [
//   {
//     "user": {
//       "name": "Newton",
//       "avatars": "https://i.imgur.com/73hZDYK.png",
//         "handle": "@SirIsaac"
//     },
//     "content": {
//       "text": "If I have seen further it is by standing on the shoulders of giants"
//     },
//     "created_at": 1461116232227
//   },

//   {
//     "user": {
//       "name": "Descartes",
//       "avatars": "https://i.imgur.com/nlhLi3I.png",
//       "handle": "@rd" },
//     "content": {
//       "text": "je pense, donc je suis"
//     },
//     "created_at": 1461113959088
//   }
// ]

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
    console.log("backend data:", tweetsFromBackEnd);
    renderTweets(tweetsFromBackEnd);
  });
};

$(document).ready(function () {
  loadTweets();
  $(".warning-flags").css("display", "none")
  $("form").submit(function (event) {
    event.preventDefault();

    const length = $("#tweet-text").val().length;
    console.log(length);
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

    $(".warning-flags").text("");

    const data = $(this).serialize();
    console.log(data);
    $.ajax({
      url: `/tweets`,
      method: "POST",
      data: data,
      success: () => {
        loadTweets();
      },
    });
  });
});

// $('#tweets-container').append($tweet);
