# Expo

[https://docs.expo.dev/introduction/walkthrough/](https://docs.expo.dev/introduction/walkthrough/)基本的なexpo開発の流れはここ

attention: 書きかけの項目

## expoの開発流れ

### プロジェクト初期化
attention:

### expoのワークフローについて
プロジェクト初期化時に以下のワークフローを選択できるはず。

- マネージドワークフロー  
  基本的にこっちをつかうはず。js/tsで開発していくだけで、expoの機能をフルに使える
- ベアワークフロー  
  ネイティブのコード(androidならjavaとかiosならswiftとか)を弄りたいのであればこっちを使用する。但しexpoSDKの課金処理とかが一部使えない。ビルドはEASビルドを使用する

途中でマネージドワークフローからベアワークフローに移行する事も可能。その操作はイジェクトという

### プロジェクトスタート
attention:

### サードパーティライブラリ
[react native directory](https://reactnative.directory/)やら[npm js](https://www.npmjs.com/)でサードパーティのライブラリを検索できるが、*ExpoGo*タグがついているか確認する事。  
*ExpoGo*タグがないものはexpoで使用できないっぽい。ベアワークフローにイジェクトすればなんとかなるっぽいけど…またそのライブラリで 

- ディレクトリに`ios`や`android`がある
- READMEでプロジェクトに**リンク**しなきゃダメとかかいてある  

とかだと使えない可能性大  

### プロダクションモード、開発モード
attention:

### app.json
attention: icon,versionについて

### ビルド、OTA、publish
attention: ビルドして初回のストアアップロードのみ審査がいるが、チャネルを使った公開を用いればストア通さずに更新できる
ただしjavasciptで書いてる部分のみ。アイコン変えたいとかスプラッシュ画面変えたいとかはビルドしなきゃだめ

### .apk .aab
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