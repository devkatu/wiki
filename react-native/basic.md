# React Native

## 開発環境について

### React Native CLI
プロジェクトでネイティブコード(javaとかswiftとか)をビルドする必要があるならこちら  
そこまで凝ったもの作らないなら必要なし。しかも環境構築めんどくさい。expo使用中のため省略。
てかexpoつかってもある程度使えるSDKに制限はあるもののベアワークフローでネイティブコードいじれるみたい

### Expo CLI
expoなるフレームワークを使った超便利なやつ  
スマホにexpo goアプリをいれると超絶簡単デバッグが可能となる  
expoで標準で用意されているAPIとかもあってめっちゃ便利  

`npm install -g expo-cli`  
`expo init newProject`  
`cd newProject`  
`npm start`  

たったこれだけで開発ｽﾀｰﾄOK!  
あとは[http://localhost:19002/](http://localhost:19002/) がブラウザ上で立ち上がるので  
そこのQRコードをスマホにインストールしたEXPO GOアプリで読取るか、エミュレータ―を立ち上げてから  
http://localhost:19002/ 上でエミュレーターの開始をすると開発スタートできる状態になる

---

## デバッグ環境について(expoの場合)

コンソールからホームディレクトリにて`npm start`または`[npx] expo start`などを  
行うとexpoでの開発がすぐに始まる。  
該当のコンソールから`r`でリロード、`m`かエミュ上で`ctrl+M`で開発者メニューが開く  
JSコードのデバッグにおいてはの`Debug JS Remotely`を選択しなければデバッガーが動作しないものも。

### エミュレーター
AndroidStudioのAVDマネージャーから、エミュのセットアップを行い、起動する。まよったらとりあえずpixel選択  
毎回AVDマネージャー開くのは面倒なので、コマンドで起動できるようにバッチ化してある。
`C:\Users\katu\AppData\Local\Android\Sdk\emulator\emulator.exe -avd Pixel_3a_API_30_x86`    
起動後、初回の`expo start`で自動でexpogoをインストールし、立ち上がる

開発者メニューを開いて`Show Inspector`をクリックするとコンポーネントの  
簡単なスタイルをみられるReact Native Inspectorが予め入っており開かれる

hint: 動作がおかしくなったら同じくAVDマネージャーからリセット(actions > wipe data)を行うとよい

### 実機
expo goアプリをインストールしておくだけ。

### Chrome デベロッパーツール
コンソールで`expo start`を実行すると自動的にlocalhost:19002にこのツールが立ち上がる  
表示されないときは自分でchromeにlocalhost:19002を入力してアクセスする。  
ここに表示される(またはコンソールで表示される)QRコードをスマホで読み込むと  
expo goが立ち上がり、実機デバッグが始まる。  
エミュレーターデバッグするときはエミュレーターを先に立ち上げてから`expo go`  
するか後からでも`Run on Android device/emurator`をクリックすればOK  

hint: localhost:19000/debugger-ui/の方ではjsのブレークポイントとか設定してデバッグ  
できるらしいがやったことない

### ReactDevTools
`npm install -g react-devtools`でこのツールをインストールできる。  
デバッグ開始し、このツールを起動し、エミュレーターまたは実機のメニューから`Debug JS Remotely`  
を選択すると各階層のコンポーネントのprops、state、styleを見ることができる様子。便利そう
もともと入っているReact Native Inspectorと組み合わせて使うとweb開発時のブラウザ検証ツール  
みたいに使うことができる

hint: これとは別にReactNativeDebuggerというのを入れるとReactDevToolsを含むさらに便利なツール(ネットワークインスペクター、AsyncStorageをログに記録したり)があるのでこれを入れるといいかも Expo公式より

--- 

## 開発の流れ

どんなアプリを作りたいか、テキトーに開発を進めていくと手戻りが発生しやすく効率が悪い。<br>
以下のように設計を進めていくといいかも。小さなアプリでも以下の通り進めてメモを残しておくと開発がスムーズかも

1. 開発するアプリの昨日をできるだけ細かく挙げていく
2. 画面別にするなら 1. で挙げた昨日を画面別に割り当てていく  
この時、ナビゲーションの種類(タブ、スタック、ドロワー等)やネストも決めたい
3. 画面の中でどの部分がstateになるか検討、設計する
4. アプリでデータを保存する必要があれば、使うstorageに適したデータ形式で必要なデータのひな形を設計する
5. 開発を始める

---

## コンポーネントとスタイリングについて
いろいろコンポーネントはあるが基本`View`と`ScrollView`を押さえておけばほとんど問題ない  
自分でいろいろスタイルをいじくりたいなら別だけど、[react native directory](https://reactnative.directory/)やら[npm js](https://www.npmjs.com/)で便利なUIセットがたくさん用意されているので基本はそっちを使うと思う

一応は[コアコンポーネントとAPI](https://reactnative.dev/docs/components-and-apis)とかに標準で用意されているものいろいろ記載されている
[expoのAPIリファレンス](https://docs.expo.dev/versions/latest/)の方にもreact nativeのコンポーネントとAPI含め使えそうなexpoSDK記載されているのでここから探してみるのもいいかも

### コアコンポーネント
これらコアコンポーネントを記述するとネイティブのコンポーネント(android,iphone上でのコンポーネント)を呼出す。  
あくまで画面上に表示されるのはネイティブのコンポーネントなので、同じコードでも機種によっては見た目が違う事もある
代表的なのはこんなの

| コンポーネント | 説明(htmlのタグでいうと)                                                                                                                                                                                                        |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| View           | スクロール無いdiv                                                                                                                                                                                                               |
| Text           | p  &lt;Text&gt;&lt;/Text&gt;のなかに&lt;Text&gt;&lt;/Text&gt;をネストすると<br>内側のtextはインラインっぽくなってくれるらしい                                                                                                                               |
| Image          | img                                                                                                                                                                                                                             |
| ScrollView     | div                                                                                                                                                                                                                             |
| TextInput      | input:text                                                                                                                                                                                                                      |
| FlatList       | リストスタイル無しのul。itemはdata属性でオブジェクト配列で渡す。<br> renderItem属性でどのようにレンダリングするかコールバックで指定                                                                                             |
| SectionList    | セクションヘッダー付きのul。itemはsections属性でオブジェクト配列で渡す<br>renderItem属性でitemをどのようにレンダリングするかコールバックで指定<br>renderSectionHeader属性でheaderをどのようにレンダリングするかコールバック指定 |

### スタイルの設定
スタイルの設定はコンポーネントにstyle属性を記述し、そこにcssっぽいオブジェクトを渡す。  
cssっぽいオブジェクトのプロパティに、cssのプロパティを記述(ただしケバブケースではなく、キャメルケースで)<<br>、  
値もcssっぽい値を書いていくが、あくまでオブジェクトなので、数値のみならそのまま数値を、<br>
単位のある数値や、なんらかの文字列であれば`""` で括って記述する。 

```javascript
// styleの一番外側の{}はjsを記述するためのもの
// 内側の{}はオブジェクトの括弧
<View
    style={{
        width: 100,
        height: 100,
        bacgroundColor: "red"
    }}
>
    BOX
</View>
// 以下も同じ
const styles = {
    box:{
        width: 100,
        height: 100,
        bacgroundColor: "red"
    }
}
<View
    style={styles.box}
>
    box
</View>
```

コンポーネントのstyle属性に直書き(インライン)で書くのはモジュールがしっかり分かれていれば
保守しづらくない思う。しかし複雑化してきたときや、特にパフォーマンスの観点から、
下のようなStyleShett.create()したほうがいいらしい

note: オブジェクトを記述する場合に比べ、sytlesにはプリミティブな数値(id)が入るらしい。実際に使用するときにはそのIDからオブジェクトを復元するみたい

```javascript
const styles = StyleSheet.create({
    box:{
        width: 100,
        height: 100,
        bacgroundColor: "red"
    }
})
<View
    style={styles.box}
>
```

style属性にスタイルの配列を渡す事もできる。配列を渡したとき、全てのスタイルが適用されるが、  
**重複するプロパティがあるとき、配列の一番最後のプロパティが優先される**。  
これを使うとBEMでいうところのModifierみたいに使える

```

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
    },
    bigBlue: {
        color: 'blue',
        fontWeight: 'bold',
        fontSize: 30,
    },
    red: {
       color: 'red',
    },
});

<View style={styles.container}>
    <Text style={[styles.bigBlue, styles.red]}>bigBlue, then red</Text>
    <Text style={[styles.red, styles.bigBlue]}>red, then bigBlue</Text>
</View>

// 一個目のtextのスタイルには
{
    color: 'red',
    fontWeight: 'bold',
    fontSize: 30
}
// 二個目のtextのスタイルには
{
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 30
}

```

プラットフォームごとに違う処理やスタイルを実装したいときは`Platform`を使用すると良い<br>
`Platform.OS`の値はiosなら'ios'、アンドロイドなら'android'になる<br>
`Platform.select()`メソッドは引数にios,android,native,defaultをキーにとるオブジェクトを渡し、
実行されている環境にふさわしいものを返す。

```javascript
// 以下のstylesにスタイルが設定されるので
// コンポーネントのstyle属性に
// styles.containerとかしてあげればスタイル適用される
import {Platform} from 'react-native';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        ...Platform.select({
            ios: {
                backgroundColor: 'red'
            },
            android: {
                backgroundColor: 'green'
            },
            default: {
                // other platforms, web for example
                backgroundColor: 'blue'
            }
        })
    }
});
```

### サイズの指定について

#### 幅高さについて
基本的にはコンポーネントはwebのブロック要素のように**幅は親いっぱいに、高さは子要素によって変わる**。  

#### 直接数値のみ入力する方法
これはandroidでは*dp*(density-independent pixels)、iosでは*ポイント*なる単位になる。
androidのdpは画面密度(dpi...dot per inch)に依存しないサイズ指定の方法。  
結局は画素の一つ一つ(px)に表示を行うがpxで指定をしてしまうと、ディスプレイの画素の密度により見た目の大きさに違いがでてきてしまう  
この画素密度(dpi)に依存しないような統一されたサイズ指定の方法である。

note: 解像度に依存、じゃないよ dpiに依存しないようにしているんだよ
     同じ解像度でも、ディスプレイの幅高さが違えばpxの大きさは変わっちゃうからね

##### もうちょっと詳しく
端末ごとにdpiが存在するが、ある程度のdpiの区分を設けて汎用密度とし、それぞれに倍率を設定。  
**単位dpの基準はmdpiで、mdpiの時の1dpはそのまま1pxへ変換される。
そのほかの区分は各dpi倍率を掛けてdp->pxへの変換が行われる。**

| 汎用密度         | 倍率  | dp  | px   |
| ---------------- | ----- | --- | ---- |
| ldpi(~120dpi)    | x0.75 | 4dp | 3px  |
| mdpi(~160dpi)    | x1    | 4dp | 4px  |
| hdpi(~240dpi)    | x1.5  | 4dp | 6px  |
| xhdpi(~320dpi)   | x2    | 4dp | 8px  |
| xxhdpi(~480dpi)  | x3    | 4dp | 12px |
| xxxhdpi(~640dpi) | x4    | 4dp | 16px |

なので汎用密度から大きくずれるdpiを持つ端末では若干表示が異なることがある。

自分で厳密にdp -> pxへの変換をしたいときは以下で。mdpiの160dpiを基準としておこなう。

[gimmick: math]()

$$ px = dp \times \frac{dpi}{160} $$

#### flexで入力する方法
`{flex: 1}`等をコンポーネントに指定するとそのコンポーネントが利用可能なスペースをflexで指定した分だけ埋めるようにする。  
- 兄弟要素がいないときには`{flex: 1}`は利用可能な領域を全て埋めつくす
- 兄弟要素がいるときにはお互いのflexに設定した値の分だけの領域を確保する

```
// 以下の3つの子要素は縦方向に 1:2:3 の割合で領域を確保する
<View style={{ flex: 1 }}>
    <View style={{ flex: 1, backgroundColor: 'powderblue' }} />
    <View style={{ flex: 2, backgroundColor: 'skyblue' }} />
    <View style={{ flex: 3, backgroundColor: 'steelblue' }} />
</View>

```

#### %指定で入力する方法
基本的にはflexレイアウトにしたくないときにのみ使う。  
親要素に対するパーセンテージで指定するwebと同じ使い方。詳細省略

### flexbox

基本コンポーネントのレイアウトはflexboxで指定していくと良い。webと馴染みがあるのですごく使いやすい。  
よく使用するプロパティのみここに上げていく。  
*基本的に親要素に以下のstyleを設定してく。*

| プロパティ     | プロパティの説明                                                                                         | 値             | 効果                                                                           | 備考                                                                                           |
| -------------- | -------------------------------------------------------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| flexDirection  | 子要素の並び方向を決める<br>この並び方向を*主軸*ともいう                                                 | column         | 縦方向に要素を並べる                                                           | デフォルト                                                                                     |
|                |                                                                                                          | row            | 横方向に要素を並べる                                                           |                                                                                                |
|                |                                                                                                          | column-reverse | 縦方向に逆順で要素を並べる                                                     |                                                                                                |
|                |                                                                                                          | row-reverse    | 横方向に逆順で要素を並べる                                                     |                                                                                                |
| diretcion      | 子要素の横方向の並べ方を指定                                                                             | ltr            | 左から右方向に並べる                                                           | デフォルト                                                                                     |
|                |                                                                                                          | rtl            | 右から左方向に並べる                                                           |                                                                                                |
| justifyContent | 主軸方向の子要素の整列方法を指定                                                                         | flex-start     | 主軸の始点側に揃える                                                           | デフォルト                                                                                     |
|                |                                                                                                          | flex-end       | 主軸の終点側に揃える                                                           |                                                                                                |
|                |                                                                                                          | center         | 主軸の中心に揃える                                                             |                                                                                                |
|                |                                                                                                          | space-between  | 主軸全体で子要素を均等に離し配置<br>残りのスペースは*子の間*に分散             |                                                                                                |
|                |                                                                                                          | space-around   | 主軸全体で子要素を均等に離し配置<br>残りのスペースは*子の間と両端*に均等に分散 |                                                                                                |
| alignItems     | 交差軸方向の子要素の並べ方を指定                                                                         | stretch        | 交差軸いっぱいに子要素を広げる                                                 | デフォルト<br> 一部の子要素にのみ違う効果を与えたいときは該当の子要素に*alignSelf*を設定しよう |
|                |                                                                                                          | flex-start     | 交差軸の始点方向に揃える                                                       |                                                                                                |
|                |                                                                                                          | flex-end       | 交差軸の終点方向に揃える                                                       |                                                                                                |
| alignContents  | 交差軸方向の子要素の並べ方を指定<br>flexWrapがwrapの時のみ適用<br>*alignitemsと同じ値に加え次の値を持つ* | space-between  | justifuContentの効果と同様                                                     |                                                                                                |
|                |                                                                                                          | space-around   | justifuContentの効果と同様                                                     |                                                                                                |
| flexWrap       | 主軸上の子要素が親要素のサイズを超えるときどうするか指定                                                 | wrap           | 親要素を超えるときに折り返して表示する                                         |                                                                                                |
|                |                                                                                                          | nowrap         | 親要素を超えるときに折り返しさずそのまま表示する                               |                                                                                                |

### 画面幅を取得する方法
画面幅、高さを取得する方法は以下の`Dimensions`APIを使用する。
```javascript
const {height, width} = Dimensions.get('window');
```
画面幅いっぱいの要素の中に、画面幅-20dpとかの子要素を入れる時に使った

---

## 画像の表示方法

以下reacatnativeとexpoで少し違ったがどちらでもいけるみたい

> react native公式で紹介されていた例
> ```
> // importと変わらない
> // 構文の違いだけ
> // ちなみにrequireに変数を渡すとかの動的な読込はできない
> // やりかたはあるみたいだけど面倒なのでexpoの方のimport使う法がいいかも
> <Image
>     source={require('./icon.png')}
> >
> 
> // backgroundに画像を指定したいときは
> // ImageBackgroundを使うといいらしい
> <ImageBackground source={...} style={{width: '100%', height: '100%'}}>
>   <Text>Inside</Text>
> </ImageBackground>
> ```

> expoで紹介されていた例
> ```
> import {Image, ...} from 'react-netive';
> import logo from './assets/logo.png';
> ...
> 
> // 静的な画像リソースを読込みたい時は
> // 予め画像ファイルをimportし、それをsource属性に指定する
> <Image
>     source={logo}
>     style={{width:300, height: 300}}
> >
> 
> // webから画像を読込たい時は
> // source属性にuriキーと値としてアドレスの文字列を持つオブジェクトを指定する
> <Image
>     source={{uri: "https://~~~~~~/.jpg}}
>     style={{width:300, height: 300}}
> >
> 
> ```

---

## インタラクティブ
大体のボタンとかのインタラクティブな要素は以下の属性があり、そこにコールバックを渡してイベント処理ができる。

- onPress  
要素をタップしたときに発火
- onLongPress
要素をロングタップしたときに発火

コールバック関数に渡される引数には`PresseEvent`オブジェクトであり、これを参照するとタッチした箇所の座標が取得できたりする。自分で`TouchableXXXX`コンポーネントをカスタマイズしてタップ時の座標を取得してなんかしたいときに使えるかも

---