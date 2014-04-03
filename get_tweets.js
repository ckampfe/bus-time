var through = require('through');
var Twit    = require('twit');
var Q       = require('q');

module.exports = function () {
  var T = new Twit({
    CONSUMER_KEY:        process.env['CONSUMER_KEY']
    CONSUMER_SECRET:     process.env['CONSUMER_SECRET']
    ACCESS_TOKEN:        process.env['ACCESS_TOKEN']
    ACCESS_TOKEN_SECRET: process.env['ACCESS_TOKEN_SECRET']
  });

  // T.get('statuses/mentions_timeline', function(err, reply) {
  //       if (err) {
  //         return console.log(err);
  //       }
  //
  //       console.log('NOT STREAMING');
  //       console.log(reply);
  // });

  var stream = T.stream('user', { replies: 'all' });

  stream.on('connect', function () {
    console.log('CONNECTION EVENT REGISTERED');
  });

  // THIS WORKS
  stream.on('tweet', function (tweet) {
    console.log('got tweet in stream');

    var dt = Q.defer();
    dt.resolve(tweet);

    return dt.promise
    .then(function (tweet) {
      console.log('before make useful');

      return makeUseful(tweet);

    }).then(function (usefulInfo) {
      console.log('before console log');

      console.log(usefulInfo);

    })
  });

  function makeUseful (tweet) {
    var dt = Q.defer();

    if (tweet.in_reply_to_screen_name === 'kilophoton') {
      dt.resolve({
        screen_name: tweet.user.screen_name,
        text:        tweet.text
      });
    };

    return dt.promise;
  }
}
