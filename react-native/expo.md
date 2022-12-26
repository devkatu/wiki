# Expo

attention: EAS導入にて見直し必要！

基本的なexpo開発の流れはここ→[https://docs.expo.dev/introduction/walkthrough/](https://docs.expo.dev/introduction/walkthrough/)

## ワークフローについて
プロジェクト初期化時に以下のワークフローを選択できるはず。

- マネージドワークフロー  
  基本的にこっちをつかうはず。js/tsで開発していくだけで、expoの機能をフルに使える
- ベアワークフロー  
  ネイティブのコード(androidならjavaとかiosならswiftとか)を弄りたいのであればこっちを使用する。但しexpoSDKの課金処理とかが一部使えない。ビルドはEASビルドを使用する

途中でマネージドワークフローからベアワークフローに移行する事も可能。その操作はイジェクトという。
expoを使用しないreactnativeの開発もベアプロジェクトとかいうらしいけど？？

---

## デバッグ環境

コンソールからホームディレクトリにて`npm start`または`[npx] expo start`などを  
行うとexpoでの開発がすぐに始まる。  
該当のコンソールから`r`でリロード、`m`かエミュ上で`ctrl+M`で開発者メニューが開く  
JSコードのデバッグにおいては開発者メニューの`Debug JS Remotely`を選択しなければデバッガーが動作しないものも。

### エミュレーター
AndroidStudioのAVDマネージャーから、エミュのセットアップを行い、起動する。まよったらとりあえずpixel選択  
毎回AVDマネージャー開くのは面倒なので、コマンドで起動できるようにバッチ化してある。
`C:\Users\katu\AppData\Local\Android\Sdk\emulator\emulator.exe -avd Pixel_3a_API_30_x86`    
起動後、初回の`expo start`で自動でexpogoをインストールし、立ち上がる

開発者メニューを開いて`Show Inspector`をクリックするとコンポーネントの  
簡単なスタイルをみられるReact Native Inspectorが予め入っており開かれる

hint: 動作がおかしくなったら同じくAVDマネージャーからリセット(actions > wipe data)を行うとよい

hint: [react native公式](https://reactnative.dev/docs/environment-setup)や[expo公式](https://docs.expo.dev/workflow/android-studio-emulator/)が参考になるかも

### 実機
expo goアプリをインストールしておくだけでもある程度なんとかなるが、サードパーティのライブラリを使用したりしていると、**開発ビルド**が必要になることがある。**開発ビルド**はeasコマンドから.apkファイルを作成して、実機にインストールして使用する。作り方は[ここ](#アプリをビルドする)

### プロダクションモード、開発モード
**デベロッパーツールは開かなくなった？**  
~~expo開発時のlocalhost:19002の"PRODUCTION MODE"スイッチをオフにすると開発モードとなる。~~
`$ npx expo start --no-dev --minify`
もしくはコンソール上にてPを押し下げすると開発モードと本番モードの切り替えができる。

開発モード中は非推奨のプロパティを使用している場合や、必要なプロパティをコンポーネントに渡すのを忘れた場合に警告が表示される。
本番モードでは、本番環境でしか発生しないようなバグを探すときに役立つので覚えておくといいかも

attention:
[ここ](https://docs.expo.dev/introduction/walkthrough/#use-the-expo-sdk-and-community-standard)にあるApp.web.jsとは？
たぶんwebアプリ版の事を言っていると思うんだけど

### Chrome デベロッパーツール
**デベロッパーツールは開かなくなった？**  
コンソールで`expo start`を実行すると自動的にlocalhost:19002にこのツールが立ち上がる表示されないときは自分でchromeにlocalhost:19002を入力してアクセスする。ここに表示される(またはコンソールで表示される)QRコードをスマホで読み込むとexpo goが立ち上がり、実機デバッグが始まる。  
エミュレーターデバッグするときはエミュレーターを先に立ち上げてから`expo go`するか後からでも`Run on Android device/emurator`をクリックすればOK  

### debugger-ui
`localhost:19000/debugger-ui/`の方ではjsのブレークポイントとか設定してデバッグできる。`@react-native-community/cli-debugger-ui`のインストールが必要みたい

### ReactDevTools
`npm install -g react-devtools`でこのツールをインストールできる。  
デバッグ開始し、このツールを起動し、エミュレーターまたは実機のメニューから`Debug JS Remotely`  
を選択すると各階層のコンポーネントのprops、state、styleを見ることができる様子。便利そうもともと入っているReact Native Inspectorと組み合わせて使うとweb開発時のブラウザ検証ツール みたいに使うことができる

hint: これとは別にReactNativeDebuggerというのを入れるとReactDevToolsを含むさらに便利なツール(ネットワークインスペクター、AsyncStorageをログに記録したり)があるのでこれを入れるといいかも Expo公式より

---

## expoの開発流れ

### プロジェクト初期化、開発スタート
~~まずは`$ npm install -g expo-cli`でexpoのcliをインストール~~  
`$ npx expo コマンド`の形が推奨されているみたい

1. `$ npx create-expo-app my-app`  
  または、テンプレートを使いたいときは  
  `$ npx create-expo-app my-app --template`  
  でテンプレート一覧が表示されるので選択  
2. `$ cd my-app`
3. `$ npx expo start`  
   開発ビルドを使う場合は`$ npx expo start --dev-client`

以上でmy-appディレクトリが作成され新規expoプロジェクトが作られる。
MetroBundlerが起動して開発スタートできる。

### 各ライブラリのコンポーネントを組み合わせていく
基本最低限のコンポーネントreact nativeの組み込みのコンポーネントとして準備されていて、[コアコンポーネントとAPI](https://reactnative.dev/docs/components-and-apis)リファレンス記載されている
expoではカメラ、オーディオ、バーコードスキャン、カレンダー、マップとかのデバイス、システム機能へのアクセスを提供するものがたくさんある。[expoのAPIリファレンス](https://docs.expo.dev/versions/latest/)の方にreact nativeのコアコンポーネントとAPI含め使えそうなexpoSDK記載されているのでexpoを使う場合はここから探してみるのもいいかも

サードパーティのライブラリは[react native directory](https://reactnative.directory/)やら[npm js](https://www.npmjs.com/)で検索できるが、*ExpoGo*タグがついているか確認する事。  
*ExpoGo*タグがないものはexpoで使用できないっぽい。ベアワークフローにイジェクトすればなんとかなるっぽいけど…またそのライブラリで 

- ディレクトリに`ios`や`android`がある
- READMEでプロジェクトに**リンク**しなきゃダメとかかいてある  

とかだと使えない可能性大  

### app.jsonを編集してiconやバージョン情報を編集
プロジェクトのルートにあるapp.json内でアプリに関するいろんな設定を行うことができる。
expoを使用する場合は全ての親に`expo`を設定するみたい。
適宜必要なものについて記述していくとよい
また、コード中からapp.jsonの値を使用したいときは`expo-constants`でアクセスすることができる。
以下重要そうな奴は**太字**タイトルで

#### **name**
アプリの名称。多分プロジェクト開始したときに自動で付くと思うけど、あとから名称変えたいときでもこの項目変更するだけで全てOK。

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

hint: AppLoadingコンポーネントと組合せてコンポーネントのロード中はスプラッシュを維持することもできるみたい(未使用)

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

#### androidでのパーミッション
`expo.android.permissions`にてアプリに必要な権限のみを指定する。
これを指定しないとexpo標準ではデフォルトで色々な権限が含まれてしまうのでユーザーに不信感を与えかねない。
例えばただのメモアプリでカメラ使用しないのに、カメラ権限を使用したりすると怪しいアプリに思えてしまう。
値として、[使用する権限](https://docs.expo.dev/versions/latest/config/app/#permissions)を配列で与える
大体のライブラリのドキュメントに必要な権限が記述されいるはずなのでそれを参考にするとよい。
anrdroidのマニフェストとかで表示されているやつもあるけど大体は分かるはず…
ちなみにexpoのSDKだとpermissionsに空配列わたしてもOKなやつがあった。あとからaaptコマンドで調べてもpermissionsなかったっけど…
ちなみに以下のコマンドで作成した.apkファイルがあれば付与されているpermissionを調べることができる。(パスが通っていること)
`$ aapt d permissions [apkファイル]`
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

### app.config.js
app.jsonは静的に設定することしかできないけど、`app.config.js`は動的な設定をすることができる。  
ベースとなる設定項目は`app.json`に記述して、動的にスイッチしたい設定項目は`app.config.js`に記述する。  
ビルド時にまず`app.json`を読込んだ後に`app.config.js`を処理する流れとなる。

オブジェクトをエクスポートする例
```javascript
const myValue = 'My App';
module.exports = {
  name: myValue,
  version: process.env.MY_CUSTOM_PROJECT_VERSION || '1.0.0',
  // 任意のキーの構成データをアプリに渡す事ができる
  extra: {
    fact: 'kittens are cool',
  },
};
```
```javascript
// 渡された構成データはアプリ側にて`expo-constants`ライブラリで参照することができる
import Constants from 'expo-constants';
Constants.expoConfig.extra.fact === 'kittens are cool';
```

オブジェクトを返す関数をエクスポートする例  
引数の`{config}`には`app.json`の`"expo"`のプロパティの中身が入っている
```javascript
// app.json
{
  "expo": {
    "name": "My App"
  }
}
```
```javascript
// app.config.js
module.exports = ({ config }) => {
  console.log(config.name); // prints 'My App'
  return {
    ...config,
  };
};
```

応用としてアプリのビルド時に、開発用ビルドと本番用ビルドの切替を行えるように設定できる  
まず`eas.json`に環境変数の設定を行う。以下のように`env`プロパティを設定すると、各ビルド時の環境変数の設定を行う事ができるので、`development`ビルドの場合は`process.env.APP_VARIANT`は`development`となる
```javascript
{
  "build": {
    "development": {
      "developmentClient": true,
      "env": {
        "APP_VARIANT": "development"
      }
    },
    "production": {}
  }
}
```
次に`app.config.js`を下記のようにする。`app.json`をベースに使いたい時はオブジェクトを返す関数式に適宜書き換えること
```javascript
const IS_DEV = process.env.APP_VARIANT === 'development';
export default {
  // You can also switch out the app icon and other properties to further
  // differentiate the app on your device.
  name: IS_DEV ? 'MyApp (Dev)' : 'MyApp',
  slug: 'my-app',
  ios: {
    bundleIdentifier: IS_DEV ? 'com.myapp.dev' : 'com.myapp',
  },
  android: {
    package: IS_DEV ? 'com.myapp.dev' : 'com.myapp',
  },
};

// 関数式に書き換えたらこんな感じ？？(未検証)
const IS_DEV = process.env.APP_VARIANT === 'development';
module.exports = ({ config }) => {
  const newConfig = {...config};
  newConfig.name = IS_DEV ? 'MyApp (Dev)' : 'MyApp';
  newConfig.ios.bundleIdentifie = IS_DEV ? 'com.myapp.dev' : 'com.myapp';
  newConfig.android.package = IS_DEV ? 'com.myapp.dev' : 'com.myapp';
  return newConfig;
};
```
これで開発ビルド時は開発用のバリアント(開発ビルド)を別途インストールすることができる。

hint: 
vscodeの拡張でapp.jsonのプロパティの補完機能もあったりするので便利かも

### EAS 
前準備として、  
`$ npm install -g eas-cli`  
`$ eas login`  
を行っておくこと
#### ビルド
`$ eas build:configure`を行うと、下記の最小限の構成のeas.jsonが出来上がる。
```javascript
// eas.jsonの最小限の構成
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```
`build.development`が開発ビルドプロファイルであり、開発用apkを作成するときの構成。  
`build.preview`プレビュービルドプロファイルで、本番リリース前の確認apk(ほぼ本番と変わらないけど、署名されていない、アプリストア用に最適化されていないようなapk)の構成。  
`build.production`が本番ビルドの構成、  
と管理することができ、ビルドコマンド時にどのプロファイルを使うかオプション選択する事ができる。

開発ビルドを作成するときは、上記の構成に加えて`expo-dev-client`をインストールする必要あり  
`$ npx expo install expo-dev-client`  

実際にビルドするコマンドは  
`$ eas build --platform android --profile <profile-name>`  
もしくは
`$ eas build -p android --profile <profile-name>`  
となり、profileを省略すると、productが選択される

基本的にはexpo buildからの移行でもSDKや、app.jsonはそのまま使用できる。(部分的に手を加えるものはあるかも)。尚、expo buildと異なり、**ビルド時に自動的にpublishされない**ので安心！

expoのビルドと同じく、EAS上にビルドファイルができあがる。  
開発の場合は実機orエミュレーターにインストール後`$ npx expo start --dev-client`してから、インストールしたアプリ上でUrl入力等でサーバーに接続するとアプリでデバッグを行うことができる。

#### ビルドにメッセージをつける
`$ eas build --platform ios --message "Some message"`でメッセージがEAS上に表示されるので、メモを残すのに便利かも

#### アプリストアへ提出
※ストア送信は一回でも手動での送信を行ってからでないとできない。  
送信の際は、eas.jsonへの構成は必須ではないみたいだけど、あると便利
```javascript
{
  "cli": {
    "version": ">= 0.34.0"
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "../path/to/api-xxx-yyy-zzz.json",
        "track": "internal"
      }
    }
  }
}
```
- `submit.production.android.serviceAccountKeyPath`にgoogleplayでの認証に使用するサービス アカウント キーを含む JSON ファイルへのパスを設定する。
- `submit.production.android.track`はアプリのトラックを指定し、次のいずれかの値を入れる`(enum: production, beta, alpha, internal)`

実際の提出は  
`$ eas submit --platform android --profile <profile-name>`  
もしくは`$ eas submit -p android --profile <profile-name>`
で対話形式でやりとりしたあと、ストアへの提出が開始される

#### アプリの更新
※アプリの更新は、最低一回はビルドを行っていること  

アプリの更新は`expo-updates`ライブラリで行っているみたいなのでインストール  
`$ npx expo install expo-updates`  
その後、更新設定をeas.jsonに構成するために
`$ eas update:configure`  
すると、、
```javascript
{
  "build": {
    "preview": {
      "channel": "preview"
      // ...
    },
    "production": {
      "channel": "production"
      // ...
    }
  }
}
```

実際に更新を行うには  
`$ eas update --branch [branch] --message [message]`  
で、新たにビルドが行われEAS上に送信され、先のビルドに対する更新が行われる。
- `branch`はチャネル内で複数のブランチを指定して使い分けられるみたい？？多分後に公開した方が優先なのかな？未使用機能なのでよくわからない
- `message`はEAS上に表示されるコメント

### テスト
テストに必要なデータを用意したいときは[jsonジェネレータ](https://json-generator.com/)があるので使ってみよう

モックAPIが使いたいならjson-server入れてみよう  
`db.json`に下記を入れて、 
```javascript
{
  "posts": [
    { "id": 1, "title": "json-server", "author": "typicode" }
  ],
  "comments": [
    { "id": 1, "body": "some comment", "postId": 1 }
  ],
  "profile": { "name": "typicode" }
}
```
`$ npx json-server -w db.json`で起動する  
初期設定であれば`http://localhost:3000/posts/1`にアクセスすると、
```javascript
{ "id": 1, "title": "json-server", "author": "typicode" }
```

`json-server.json`で色々オプション設定できる！

多分Firestore使ってそのテスト機能使うだろうからそんなに出番なさそうかも？

#### .apk .aabとは
.apkファイルは古いタイプのバイナリファイル。.aabは次のような特徴がある。

- aabをアップロードするだけで複数のapkのバージョンをストアで勝手に作成。通常apkのアップロード適用するサイズ以外のすべてのアセットを含むのでサイズが大きくなるが、**aabの方式だとは該当するものだけをユーザーがダウンロードするのでサイズは小さくなる**。
- アプリの署名方法が異なる
  - そもそもアプリの署名は、作成元を明らかにしておくことで、改竄を防ぐ事や、アプリのアップデートの際に第三者からの違法なアップデートを防ぐ事が目的
  - apkはアップロードする前にアプリ署名証明書で署名してからアップする
  - aabはプレイストアがapkを作成するときに勝手にアプリ署名(Playアプリ署名)してくれる。このときのアプリ署名鍵はgoogleplayで勝手に生成してくれるものと、アカウントに既存の鍵と、全く新しい署名鍵をアップロードするものとがある。
  - 但しplayアプリ署名はプレイストアが最終的にアプリに署名してくれるが、aabをアップロードする際のアップロード証明書による署名は必要

#### アプリ署名クレデンシャルの管理
expoアプリを初めてビルドする際に署名用のキーストアをアップロードするか、expoにて生成してもらうかを選択することができる。特段自分で作りたい理由がなければ生成してもらう法が楽だが、あとからアプリの更新に必須のものなので`expo fetch:android:keystore`のコマンドでexpoサーバー上に保存されているキーストアをバックアップしておくのがいいみたい。
expoで作ったアプリがアップロード証明書で署名されているのか、アプリ署名書で署名されているのかに大きな違いはなく、ビルドコマンドでは現在アプリに関連付けられているキーストアで署名されてapk、aabが作成されるのみ。

hint: 基本的にはexpoでaabビルドして、アップロード証明書を自動生成＋Playアプリ署名書をPlayストアで自動生成が楽な感じになると思う

#### リリースチャネルとは
build、publishを行うチャンネルが色々あり、それぞれ設定できる。
build時、publish時にオプションで指定すると該当のチャンネルへ更新したものが公開される。
例えば実際に運用するproductチャネルとテスト用のstagingチャネルとか、バージョン更新毎にリリースチャネルを分別するなどの運用ができる。

### ストア公開後にアプリをOTAアップデートする
expoで作成、ストアにアップしたアプリはインストール後の起動毎に、CDN上の自分と同じチャネルに(build時に指定する)リリースがあるか確認して、新しいリリースがあればそれを読込む動作をする。これがOTA(Over The Air)
`$ expo publish --release-channel production`を実行すると`production`チャネルに現行のリリースが公開される。`--release-chanel`を省略すると`default`チャネルに公開される。
リリースチャネルを使用することでアプリをビルドしたときと同じリリースチャネルにアプリをOTAすることもできるし、テストように`staging`などの名前でリリースチャネルを設定して公開済みのアプリには反映されないようにすることもできる。

また、このpublishとはプロジェクトをexpoのサーバーにデプロイすることであり、アプリをストアに公開しなくても、CDN上にアプリが配置されるので、expo goアプリを使用してこのアプリを試すことができる。[https://exp.host/@katu/TrainingMemoApp?release-channel=default](https://exp.host/@katu/TrainingMemoApp?release-channel=default)とかのような形でリリースが公開される様子
(publishするとexpo goでも反映されるし、インストールした後のアプリでも再度起動するとpublishしたもの反映される動作確認済み)

attention: ストアにアプリを公開した後にOTA配布を行っている場合、インストールしたアプリは初回起動時にはOTAの分が反映されていない。その後起動するたびにOTAの分が順次反映されていく。なので**細かいバグ等の修正であればpublishでいいがあまり回数はたくさんやらないほうがいい。**

OTAについて[ここ](https://zenn.dev/marin_a___/articles/7eec197a8c3579)で紹介している。わかりやすい。

javascriptで記述しているところのみがOTA可能であり、アイコンの変更やスプラッシュ画面の変更はビルドしなおしてストアに提出する必要がある。またpublishやりすぎるのもあまりよくないので極端にpublish回数多くなってきたらこれもビルドし直しの方がいいかも

また、`expo-updates`を使用するとアプリを再起動しなくても最新のリリースを取りに行く処理をさせたりすることができるっぽい(未使用)

#### publishについてのコマンドいろいろ
gitぽくいろいろなコマンドが使えるみたい

- `expo publish:history --platform ios`
  過去に公開したリリースの一覧を見ることができる
- `expo publish:details --publish-id 80b1ffd7-4e05-4851-95f9-697e122033c3`
  リリースの一覧に表示されるIDを指定して詳細を確認できる
- `expo publish:set --publish-id 80b1ffd7-4e05-4851-95f9-697e122033c3 --release-channel production`
  過去に公開したリリースのIDを指定して、新しくチャネル指定して公開する。例えばstagingで公開したものがうまくいったのでproductionとして公開したいときなどに使う。(この場合は複雑なプロジェクトでなければ普通のリリースでいいとおもう)。または公開したものがうまくいかなかったのでもとに戻したい時につかう。
- `expo publish:rollback --release-channel production --sdk-version 36.0.0`
  sdkバージョンのロールバックを行いたいときに使う。指定したsdkバージョンの最後のリリースを公開する。⇒該当の公開IDを指定して`expo publish:set`するのと同じ

#### 更新するアプリの最適化
OTAにて更新をダウンロードする際に更新サイズを縮小しておくのがよい。

- 更新サイズの見積は、`expo export`で更新をエクスポートして、そのファイルを`gzip <file>`するとサイズが分かる
- `expo-optimize`、`jpegoptim`、`guetzli`、`pngcrush`、`optipng`、`imagemin`、等のツールで画像サイズの圧縮をしておく
- npmであまり大きなサイズの依存関係をつくらない
- アプリにそこまで必要でない画像は`<Image source={{ uri: url }}>`のような感じでweb上から読み込む用にしてもいいかも

### web向けの開発
expoのサービスとしてwebアプリ向けのビルドができたり、App.web.jsを別のエントリポイントとして使ってストアへ案内するようなこともできるみたい(未使用にて詳細不明)

`npx serve web-build`で http://localhost:5000 にてweb版がみられるらしい

---

## 使ったもの、使えそうなもの
### 通知
`expo-notifications`を使うと簡単にローカル通知が設定できる

- 通知トレイに表示されるアイコンや通知トレイの表示色の設定はapp.jsonで行う
  ```javascript
  {
    "expo":{
      "notification":{
        // アイコンはローカルパスかリモートのURLを指定。96*96の.pngが良いみたい
        "icon": "path",
        "color": "#000000"
      }
    }
  }
  ```
- アプリを開いている時の通知ができるようにしておく
  デフォルトではアプリを開いているときは通知が表示されないが、以下で通知がされるようになる
  ```javascript
  import * as Notifications from 'expo-notifications';

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
  ```
- 通知の権限確認と要求
  起動時に通知に関する権限があるか確認し、なければ権限を要求する  
  ***androidでは通知に権限は特にないけど(近々つくみたい)iphoneように用意されているみたい***
  ```javascript
  const requestPermissionsAsync = async () => {
  const { granted } = await Notifications.getPermissionsAsync();
  if (granted) {
    console.log('notification granted')
    return
  }
  console.log('notification not granted')
  await Notifications.requestPermissionsAsync();
  }

  // ---- このuseEffectはapp.js等にて(アプリ起動時に走ればOK)
  useEffect(() => {
    // 通知の権限の確認と要求
    requestPermissionsAsync()
  });
  ```
- ローカル通知のキャンセル、設定、設定済み通知の確認
  筋トレメモアプリの計画作成の部分抜粋
  ```javascript
  if (notificationId) {
    // ★通知IDを指定して、スケジュールされた通知を削除する
    // 通知IDはスケジュール時に決定する
    await Notifications.cancelScheduledNotificationAsync(notificationId)
  }

  // ★通知のスケジュールを行う。
  // 戻り値は設定した通知IDでキャンセルするとき等に使うのでstorage等に保存しておく
  // 引数にはオブジェクトを渡し、
  // content.titleに通知トレイに表示されるタイトル、
  // content.bodyに通知トレイに表示される本文、
  // content.dataに通知トレイからアプリに渡すデータ(あまり使わないと思う)
  // triggerにはスケジュールする日時等を設定する
  //   Date型でやるのが一番弄りやすそうかな。他にもnumberでもいいし
  //   その他{seconds: number}  とか  {hour: number, minute: number, repeats: boolean} ができる
  newNotificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: "トレーニング予定時間です！",
      body: trainingTitleInput !== "" ? trainingTitleInput : "no title",
      data: { data: 'goes here' },
    },
    trigger
  }).catch(e => console.log(e))

  // ★スケジュール済みの通知の確認
  // 戻り値に通知日時や通知ID、通知内容等のオブジェクトが返ってくる
  const notifications = await Notifications.getAllScheduledNotificationsAsync();
  ```

hint: ローカルでのみの通知はこれだけだが、外部からのなんらかの通知をしたいときはFCM(Firebase CloudMessaging)とかと組合せて使う事ができる。FCMで使用する場合はクレデンシャル関係の設定とか、通知時にデバイス起動するためのpermissionとかが必要になる

### ImagePicker
ReactNative自体には画像ピッカーが存在しない。
expo側にて画像ピッカーが提供されている。
```
export default function App() {
  
  // ピッカーで選択した画像を覚えておくstate
  const [selectedImage, setSelectedImage] = React.useState(null);

  let openImagePickerAsync = async () => {

    // メディアライブラリへのアクセス権限の確認
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    // 権限無し時の処理
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    // メディアライブラリを起動する
    let pickerResult = await ImagePicker.launchImageLibraryAsync();

    // メディアライブラリでキャンセルされた時はここで関数を終了する
    if (pickerResult.cancelled === true) {
      return;
    }

    // 画像が選択されたら選択された画像のuriをオブジェクトにしてsetする
    setSelectedImage({ localUri: pickerResult.uri });
  };

  // 画像が選択されていれば表示する
  if (selectedImage !== null) {
    return (
      <View style={styles.container}>
        <Image
          // sourceにuriを指定して選択した画像を表示するようにする
          source={{ uri: selectedImage.localUri }}
          style={styles.thumbnail}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Our logo, instructions, and picker button are hidden here to keep the example brief */}
    </View>
  );
}
```

### ImageSharering
画像の共有(LINEで共有とかtwitterで共有とかのできるアレ)機能を提供するexpoライブラリ

```
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing'; 
export default function App() {
  const [selectedImage, setSelectedImage] = React.useState(null);

  let openImagePickerAsync = async () => {
    /* imagepickerのやつとまったく同じコードなので省略 */

    setSelectedImage({ localUri: pickerResult.uri });
  };

  // 画像共有のダイアログを表示
  let openShareDialogAsync = async () => {

    // 使っているデバイスで画像共有ができない場合アラートをだして終了
    if (!(await Sharing.isAvailableAsync())) {
      alert(`Uh oh, sharing isn't available on your platform`);
      return;
    }

    // 選択している画像(uriを指定)で共有ダイアログを開く
    await Sharing.shareAsync(selectedImage.localUri);
  }; 

  if (selectedImage !== null) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: selectedImage.localUri }} style={styles.thumbnail} />
        
        {/* 画像共有ダイアログを開くボタン */}
        <TouchableOpacity onPress={openShareDialogAsync} style={styles.button}>
          <Text style={styles.buttonText}>Share this photo</Text>
        </TouchableOpacity>
        </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Our logo, instructions, and picker button are hidden here to keep the example brief */}
    </View>
  );
}
```

### [App.Loadingを使ってUIの準備できてから表示する](https://docs.expo.dev/versions/latest/sdk/app-loading/)

### [アセットのプリロード](https://docs.expo.dev/guides/preloading-and-caching-assets/)


--- 

## EXPO SDKのアップデート
ストアに提出しようとしたらandroid12(APIレベル31)を求められて、expo sdkを44→45にしなければならなかったことあり、そのメモ

- expoの[https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/)を、アップデートするバージョンのものを読込んで、廃止されたライブラリ等がないか確認し、対応すべき事をピックアップしておく
- `expo-cli upgrade`でexposdkの更新を行う(結局46にした)
- ここで`yarnpkg exited with non-zero code: 134`とか出たのでyarn.lockとnode_modulesを削除して`yarn install`するとsdk更新できた
- ある程度のライブラリはexpo側で勝手に更新してくれるようなので、`expo-cli doctor`でどのライブラリを、どのバージョンまで更新すればいいか確認する
- `yarn outdated`を行うと最新版でないパッケージが表示される
- `yarn upgrade-interactive --latest`で、最新へ更新するパッケージは纏めて行う
- nodeが最新版じゃないとダメって言われたので更新する
- もう一度`yarn upgrade-interactive --latest`したら実行できた
- 最新以外のパッケージは個別に`yarn upgrade package@version`で地道に更新(package.jsonを弄ってinstallでもいいのかも)
- ビルドしてテストしていく。パッケージ変わっているのが多数あるので地道にやろう