<?php
// 基本的にはこのphpをサーバーに配置してそのアドレスを
// LINEdeveloperからWebhookURLに指定すればOK
// あとはアクセストークン忘れずに(なんかおかしければ再発行)

// 受信したメッセージ情報
$raw = file_get_contents('php://input');  //POSTされたメッセージを読込む

// 受信したメッセージはJSON形式なのでそれをdecode
// 第二引数がtrueだと戻り値が(連想)配列、指定なしだとobject型になる
$receive = json_decode($raw, true);

$event = $receive['events'][0];
$reply_token  = $event['replyToken'];

// botに送信されたtextの取り出し
// $hook_message = $event['message'];
// $hook_text = $hook_message['text'];
$hook_text = $event['message']['text'];


// アクセストークン これがないとメッセージ送り返してもダメだよ！
$accessToken = 'w3uauyR1fS4cOp3aTw493qREX2Ml3ztEV1Hey/a6M7KzNh2TGjTH21h7QwFXPgM9dzycsriyqGH6uR34pcjfVRJnxR/G5RLngCVGlKPodmZfmPbpB8xuwHNDhZnqLGRE5TaJ41h0sLvkR0ETMa0kGgdB04t89/1O/w1cDnyilFU=';


// ここから下が返信するメッセージの編集
$headers = array('Content-Type: application/json',
'Authorization: Bearer ' . $accessToken);

$r = rand(1,10);
if ($r < 10){
  // $message = array('type' => 'text', 'text' => 'こんにちは。テキスト応答ですよ。');
  $message = array('type' => 'text' , 'text' => $hook_text );
}else{
  $template = array('type'    => 'buttons',
  'thumbnailImageUrl' => 'https://d1f5hsy4d47upe.cloudfront.net/79/79e452da8d3a9ccaf899814db5de9b76_t.jpeg',
  'title'   => 'タイトル最大40文字' ,
  'text'    => 'テキストメッセージ。タイトルがないときは最大160文字、タイトルがあるときは最大60文字',
  'actions' => array(
    array('type'=>'message', 'label'=>'ラベルです', 'text'=>'アクションを実行した時に送信されるメッセージ' )
  )
);

$message = array('type'     => 'template',
'altText'  => '代替テキスト',
'template' => $template
);
}


$body = json_encode(array('replyToken' => $reply_token,
'messages'   => array($message)));
$options = array(CURLOPT_URL            => 'https://api.line.me/v2/bot/message/reply',
CURLOPT_CUSTOMREQUEST  => 'POST',
CURLOPT_RETURNTRANSFER => true,
CURLOPT_HTTPHEADER     => $headers,
CURLOPT_POSTFIELDS     => $body);


// curl_系の関数で編集したメッセージを送信する
$curl = curl_init();
curl_setopt_array($curl, $options);
curl_exec($curl);
curl_close($curl);
