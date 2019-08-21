<?php
// https://github.com/abraham/twitteroauthからダウンロードした
// ライブラリを使用するためのもの
require "twitteroauth/autoload.php";
use Abraham\TwitterOAuth\TwitterOAuth;

// ここはtwitterのアプリ情報から取得する
$consumerKey = "eogxSgNjHxTUglH6ThQWuD6Jq";
$consumerSecret = "UHk35m70ARiYX7UpUq3UfupozyXhbebL9EGmdmvV8o46W2LA3f";
$accessToken = "1163452167992172544-OWcvTlgAJY8yMIdefsXQrGURgnOOwQ";
$accessTokenSecret = "x3EKsBSDIq4xSeeHrpHRaSJ0CidOJlxQWRk7RhjLWbKdA";

$twitter = new TwitterOAuth($consumerKey, $consumerSecret, $accessToken, $accessTokenSecret);

// $result = $twitter->post(
//         "statuses/update",
//         array("status" => "wow!")
// );
//
// if($twitter->getLastHttpCode() == 200) {
//     // ツイート成功
//     print "tweeted\n";
// } else {
//     // ツイート失敗
//     print "tweet failed\n";
//     print $twitter->getLastHttpCode();
// }

$result = $twitter->get("statuses/home_timeline",array("count" => 20));
foreach($result as $tweet){
  echo '<li>' . $tweet->user->name . '</li>';
  echo '<li>' . $tweet->text . '</li>';
  // echo $tweet->user->name . 'さんのトゥイート';
  // echo $tweet->text . "<br>";
}
