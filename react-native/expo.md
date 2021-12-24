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
基本最低限のコンポーネントreact nativeの組み込みのコンポーネントとして準備されていて、[コアコンポーネントとAPI](https://reactnative.dev/docs/components-and-apis)リファレンス記載されている
expoではカメラ、オーディオ、バーコードスキャン、カレンダー、マップとかのデバイス、システム機能へのアクセスを提供するものがたくさんある。[expoのAPIリファレンス](https://docs.expo.dev/versions/latest/)の方にreact nativeのコアコンポーネントとAPI含め使えそうなexpoSDK記載されているのでexpoを使う場合はここから探してみるのもいいかも

サードパーティのライブラリは[react native directory](https://reactnative.directory/)やら[npm js](https://www.npmjs.com/)で検索できるが、*ExpoGo*タグがついているか確認する事。  
*ExpoGo*タグがないものはexpoで使用できないっぽい。ベアワークフローにイジェクトすればなんとかなるっぽいけど…またそのライブラリで 

- ディレクトリに`ios`や`android`がある
- READMEでプロジェクトに**リンク**しなきゃダメとかかいてある  

とかだと使えない可能性大  


### プロダクションモード、開発モード
expo開発時のlocalhost:19002の"PRODUCTION MODE"スイッチをオフにすると開発モードとなる。
もしくはコンソール上にてPを押し下げすると開発モードと本番モードの切り替えができる。

開発モード中は非推奨のプロパティを使用している場合や、必要なプロパティをコンポーネントに渡すのを忘れた場合に警告が表示される。
本番モードでは、本番環境でしか発生しないようなバグを探すときに役立つので覚えておくといいかも

attention:
[ここ](https://docs.expo.dev/introduction/walkthrough/#use-the-expo-sdk-and-community-standard)にあるApp.web.jsとは？
たぶんwebアプリ版の事を言っていると思うんだけど

### app.jsonを編集してiconやバージョン情報を編集
プロジェクトのルートにあるapp.json内でアプリに関するいろんな設定を行うことができる。
expoを使用する場合は全ての親に`expo`を設定するみたい。
適宜必要なものについて記述していくとよい
また、コード中からapp.jsonの値を使用したいときは`expo-constants`でアクセスすることができる。
以下重要そうな奴は**太字**タイトルで

#### **slug**
expoサーバー内で使われるIDのようなもの。
publishしたときのURL末尾に使用される。

#### privacy
デフォルトは`unlisted`で`unlisted`はexpo上で検索しても出てこない。
`hidden`でアクセス許可のあるもののみに、`public`で誰でも表示される。

#### updates
`updates.fallbackToCacheTimeout`でOTAのアップデートのリクエストタイムアウトの設定を行える。
ミリ秒で指定するか、`enabled`を追加して`false`に設定するとアップデートを無効にできる

#### **icon**
ホーム画面に使うアイコン画像は

- `expo.icon`でも設定可能1024x1024pxのpngファイルを使用推奨。
- iosにも共通で使うなら1024px×1024pxの.pngファイルを用意する。android単体で良いなら512px×512pxの.pngファイルでOK。ビルドするとexpoが勝手に他のサイズの画像を用意してくれる
- 以下のような感じで`app.json`中の`android.adaptiveIcon.foregroundImage`と`android.adaptiveIcon.backgroundColor`にそれぞれ前景の画像と背景色を各々設定できる。デフォルトの背景色は白。自分で作成した好きな画像を設定したいときは、
`android.adaptiveIcon.badckgroundImage`に置き換えることもできる。

```javascript
// app.jsonファイル
// documentではandroid.adaptiveIcon...だけど
// 実際につくったアプリではexpo.android.adaptiveIcon...
// となっている。多分後者が正解？
{
  "expo": {
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/icon_front.png",
        "backgroundImage": "./assets/icon_back.png"
      },
      "package": "com.katu.TrainingMemoApp",
      "versionCode": 1
    },
    ...
  }
}
```

androidのアダプティブアイコンについては

- アイコンサイズは前景、背景どちらも108×108dp(512px)
- アイコンの内側72×72dp(512pxなら341px相当)分に表示される部分を設定する。大体外側サイズの66%くらい
- 残りの18dp(512pxなら28px相当)分はパララックスとか点滅とかの視覚効果のために使われる領域になっているので、ここにアイコンが描画されていると見切れたりする
- 古いデバイスではアダプティブアイコンをサポートしていない場合もあるので`android.icon`で前景と背景を組み合わせた画像ファイルを設定することもできる



#### **スプラッシュ画面**
スプラッシュ画面で使う画像は

- 1242×2436pxの.png画像を使用する(iphoneの最大サイズ)
- `expo.splash.image`には上記の.png画像ファイルを
- `expo.splash.backgroundColor`には背景色を
- `expo.splash.resizeMode`には`contain`もしくは`cover`を。cssのbackground-sizeと同様に"contain"なら画像全体を表示できるように、"cover"なら表示領域を全て覆うようにできる
- 通常は以下のようにするといいと思う
  1. 画像ファイルが画面大の縦長の大きさを意識して作って、
  2. splash.resizeModeを"contain"にして画像全体を表示できるようにして、
  3. 表示領域が余ると、そこが白く表示されてしまい格好悪いので、指定した画像の背景色と一緒になるようにsplash.backgroundColorへ設定する

```javascript
// app.jsonファイル
{
  "expo": {
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    ...
  }
}
```

#### **versionについて**

- `expo.version`  
ユーザー向けに表示することのみを目的としたもの。純粋なandroidでいうところの`versionName`に相当する。
メジャー.マイナー.ポイントで表現される。
  1. APIの変更に互換性のない場合はメジャーバージョンを、
  2. 後方互換性があり機能性を追加した場合はマイナーバージョンを、
  3. 後方互換性を伴うバグ修正をした場合はパッチバージョン(ポイント)を上げます。
- `expo.android.versionCode`  
ユーザーには表示されない内部バージョンを示す。正の整数で表現される。更新のごとに＋１する。これを比較することでアプリの新しい、古いを判断するためだけに使用され、古いバージョンのアプリをインストールしないようにできている。
- 実行時にこれらの値を使用したいときは`expo-constants`でアクセスすることができる。バージョン表示したいときとかにいいかも
- ios向けにもビルドするなら`expo.ios.buildNumber`もメンテ必要となる。詳細未確認

#### **package**
`expo.android.package`にアンドロイドでのパッケージ名を設定する。英数字とアンダースコアで記述する。これはアプリのクラスの名前空間解決に使用したり(？)、アプリのIDとしても使われる。アプリの名前が異なっても、このpackage名が同じなら同じアプリとして認識される。
このため一意のものであることが必須であり、他のものと被りにくいことから、ドメイン名の逆順にしたものを使用することが一般的。ドメインがなければ一意のパッケージを登録するサービスもあるが、特に被らないような名前ならなんでもいいのかも
attention: ドメインの逆引きのやつを設定するはず

#### androidでのパーミッション
`expo.android.permissions`にてアプリに必要な権限のみを指定する。
これを指定しないとexpo標準では余計な権限も含まれてしまうのでユーザーに不信感を与えかねない。
例えばただのメモアプリでカメラ使用しないのに、カメラ権限を使用したりすると怪しいアプリに思えてしまう。
値として、[使用する権限](https://docs.expo.dev/versions/latest/config/app/#permissions)を配列で与える

```javascript
{
...
  "permissions" : [ "CAMERA", "ACCESS_FINE_LOCATION" ]

}

```

#### app.jsonの構成例
```javascript
{
  "expo": {
    "name": "my-app-name",
    "slug": "my-app-slug",
    "privacy": "unlisted",
    "sdkVersion": "35.0.0",
    "platforms": [
      "ios",
      "android"
    ],
    "version": "1.3.2",
    "orientation": "portrait",
    "primaryColor": "#FFE483",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#FFE483"
    },
    "updates": {
      "fallbackToCacheTimeout": 10000
    },
    "ios": {
      "bundleIdentifier": "my-app-id",
      "buildNumber":"1.3.2",
      "icon": "./assets/icon_ios.png",
      "splash": {
        "backgroundColor": "#FFE483",
        "image": "./assets/splash.png"
      },
      "config": {
        "googleMobileAdsAppId": "abc123"
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/icon_front.png",
        "backgroundImage": "./assets/icon_back.png"
      },
      "package": "com.katu.TrainingMemoApp",
      "permissions": [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION"
      ], 
      "versionCode": 23,
      "playStoreUrl": "https://play.google.com/store/apps/details?id=abc123",
      "config": {
        "googleMobileAdsAppId": "abc123"
      }
    }
  }
}
```

hint: 
app.config.jsを使って動的に設定情報を編集することもできる(未使用)
開発モード、プロダクションモードで設定を変更したりとかいろいろできる。
これがあるとapp.jsonより優先されて使われるみたい
vscodeの拡張でapp.jsonのプロパティの補完機能もあったりするので便利かも

### アプリをビルドする
ストアに提出するための.apkまたは.aab等のバイナリファイルを作成することをビルドという。
`$ expo build:android --release-channel production`
のコマンドを実行するとapk、aabの選択があったのち、expoサーバーにコードがアップロードされてビルドが開始されてしばらくするとサーバー上にバイナリができあがる。
`--release-channel production`
の部分はオプションになり、ストアアップロード後のOTAの時にリリースチャネルを使用するときに生きてくる。
`--release-channel`を指定しないときは`default`チャネルにアプリが公開される
ios向けや、web向けのビルドも別途ある。

ビルドして初回のストアアップロードのみ審査がいるが、公開を用いればストア通さずに更新できる
ただしjavasciptで書いてる部分のみ。アイコン変えたいとかスプラッシュ画面変えたいとかはビルドしなきゃだめ

attention: ビルドしたときもデフォルトでOTA配布がされるので注意。初回のビルドならいいが、ストアアップロード後の変更でビルドをするときはビルドして即OTAが配布されてしまうことがあるので注意。ビルドするときは大体OTA配布で賄えないときに(アイコン更新とか細かい修正じゃないもの)行うはずなので**予め`expo.updates.enabled`をfalseに設定**しおくといいかも。ビルド後にいろいろテストしたくても即ユーザー配布されちゃうよ！

hint: ストアの提出が便利なEASbuildというのもあるのでいずれ使ってみたい

#### .apk .aabとは
attention: .apkは署名が必要。だけどexpoがやってくれるはず
.aabはgoogleが署名を行ってくれるが、結局アップロードするための署名が必要

#### リリースチャネルとは
build、publishを行うチャンネルが色々あり、それぞれ設定できる。
build時、publish時にオプションで指定すると該当のチャンネルへ更新したものが公開される。

### ストア公開後にアプリをOTAアップデートする
expoで作成したアプリはインストール後の起動毎にCDN上の同じチャネルにリリースがあるか確認して、新しいリリースがあればそれを読込む動作をする。これがOTA(Over The Air)
(publishするとexpo goでも反映されるし、インストールした後のアプリでも再度起動するとpublishしたもの反映される動作確認済み)
リリースチャネルを使用することでアプリをビルドしたときと同じリリースチャネルにアプリをOTAすることもできるし、テストように`staging`などの名前でリリースチャネルを設定して公開済みのアプリには反映されないようにすることもできる。

また、このpublishとはプロジェクトをexpoのサーバーにデプロイすることであり、アプリをストアに公開しなくても、CDN上にアプリが配置されるので、expo goアプリを使用してこのアプリを試すことができる

attention: ストアにアプリを公開した後にOTA配布を行っている場合、インストールしたアプリは初回起動時にはOTAの分が反映されていない。その後起動するたびにOTAの分が順次反映されていく。なので**細かい修正であればpublishでいいがあまり回数はたくさんやらないほうがいい。**
`$ expo publish --release-channel production`

OTAについて[ここ](https://zenn.dev/marin_a___/articles/7eec197a8c3579)で紹介している。わかりやすい。

javascriptで記述しているところのみがOTA可能であり、アイコンの変更やスプラッシュ画面の変更はビルドしなおしてストアに提出する必要がある。またpublishやりすぎるのもあまりよくないので極端にpublish回数多くなってきたらこれもビルドし直しの方がいいかも

---

## 使ったもの、使えそうなもの
### 通知
attention: ローカル通知のみつかったよ

- ImagePicker
- ImageSharering
- [App.Loadingを使ってUIの準備できてから表示する](https://docs.expo.dev/versions/latest/sdk/app-loading/)
- [アセットのプリロード](https://docs.expo.dev/guides/preloading-and-caching-assets/)


--- 