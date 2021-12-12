# Expo

[https://docs.expo.dev/introduction/walkthrough/](https://docs.expo.dev/introduction/walkthrough/)基本的なexpo開発の流れはここ

attention: 書きかけの項目

## ワークフローについて
プロジェクト初期化時に以下のワークフローを選択できるはず。

- マネージドワークフロー  
  基本的にこっちをつかうはず。js/tsで開発していくだけで、expoの機能をフルに使える
- ベアワークフロー  
  ネイティブのコード(androidならjavaとかiosならswiftとか)を弄りたいのであればこっちを使用する。但しexpoSDKの課金処理とかが一部使えない。ビルドはEASビルドを使用する

途中でマネージドワークフローからベアワークフローに移行する事も可能。その操作はイジェクトという。
expoを使用しないreactnativeの開発もベアプロジェクトとかいうらしいけど？？

---

## expoの開発流れ

### プロジェクト初期化、開発スタート
`$ expo init my-app`
`$ cd my-app`
`$ expo start`または`$ npm start`

my-appディレクトリが作成され新規expoプロジェクトが作られる。
MetroBundlerが起動して開発スタートできる。

### 各ライブラリのコンポーネントを組み合わせていく
[react native directory](https://reactnative.directory/)やら[npm js](https://www.npmjs.com/)でサードパーティのライブラリを検索できるが、*ExpoGo*タグがついているか確認する事。  
*ExpoGo*タグがないものはexpoで使用できないっぽい。ベアワークフローにイジェクトすればなんとかなるっぽいけど…またそのライブラリで 

- ディレクトリに`ios`や`android`がある
- READMEでプロジェクトに**リンク**しなきゃダメとかかいてある  

とかだと使えない可能性大  

一応は[コアコンポーネントとAPI](https://reactnative.dev/docs/components-and-apis)とかに標準で用意されているものいろいろ記載されている
[expoのAPIリファレンス](https://docs.expo.dev/versions/latest/)の方にreact nativeのコンポーネントとAPI含め使えそうなexpoSDK記載されているのでここから探してみるのもいいかも

### プロダクションモード、開発モード
expo開発時のlocalhost:19002の"PRODUCTION MODE"スイッチをオフにすると開発モードとなる。
もしくはコンソール上にてPを押し下げすると開発モードと本番モードの切り替えができる。

開発モード中は非推奨のプロパティを使用している場合や、必要なプロパティをコンポーネントに渡すのを忘れた場合に警告が表示される。
本番モードでは、本番環境でしか発生しないようなバグを探すときに役立つので覚えておくといいかも

### app.jsonを編集してiconやバージョン情報を編集
attention: icon,versionについて

### ビルド、OTA、publish
attention: ビルドして初回のストアアップロードのみ審査がいるが、チャネルを使った公開を用いればストア通さずに更新できる
ただしjavasciptで書いてる部分のみ。アイコン変えたいとかスプラッシュ画面変えたいとかはビルドしなきゃだめ

#### .apk .aabとは
attention: .apkは署名が必要。だけどexpoがやってくれるはず
.aabはgoogleが署名を行ってくれるが、結局アップロードするための署名が必要

### アプリの更新
attention:

---

## 使ったもの、使えそうなもの
### 通知
attention: ローカル通知のみつかったよ
ImagePicker
ImageSharering


--- 