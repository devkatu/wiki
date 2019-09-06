<?php
// ローカル開発環境ではサーバーの時刻合わせていないと
// 401エラーでtwitterapiにはじかれちゃうよ

// https://github.com/abraham/twitteroauthからダウンロードした
// ライブラリを使用するためのもの
// このphpと同じディレクトリに置いておくこと！
// おなじ内容つぶやくとダメ403エラー！！いみふ！
require "twitteroauth/autoload.php";
use Abraham\TwitterOAuth\TwitterOAuth;

// ここはtwitterのアプリ情報から取得する
// ここが設定されていないとちゃんと呟きできないよ
$consumerKey = "Kh2iW4Z9vtMKnHNEleBFjxsfe";
$consumerSecret = "pZ4kWcIR1B0oYNE4t0nCEW34h7gRUkgfcV58dJjfutId5nhPF7";
$accessToken = "1163452167992172544-qTs7psmzmHzg2fhUUmPMGahmpG1OQo";
$accessTokenSecret = "B3CMdGwF8Ru7g80rcEcyfqtpG3xNh8ClImPMeprelrnBV";

$twitter = new TwitterOAuth($consumerKey, $consumerSecret, $accessToken, $accessTokenSecret);

$result = $twitter->post(
        "statuses/update",
        array("status" => "本日ハ晴天ナリ")
);

if($twitter->getLastHttpCode() == 200) {
    // ツイート成功
    print "tweeted\n";
} else {
    // ツイート失敗
    print "tweet failed\n";
}
