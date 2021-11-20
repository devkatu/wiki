# React Native

## 開発環境について

### React Native CLI
プロジェクトでネイティブコード(javaとかswiftとか)をビルドする必要があるならこちら  
そこまで凝ったもの作らないなら必要なし。しかも環境構築めんどくさい。expo使用中のため省略

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

## コンポーネントについて
いろいろコンポーネントはあるが基本`View`と`ScrollView`を押さえておけばほとんど問題ない  
自分でいろいろスタイルをいじくりたいなら別だけど、[react native directory](https://reactnative.directory/)やら[npm js](https://www.npmjs.com/)で便利なUIセットがたくさん用意されているので基本はそっちを使うと思う

### コアコンポーネント
これらコアコンポーネントを記述するとネイティブのコンポーネント(android,iphone上でのコンポーネント)を呼出す。  
あくまで画面上に表示されるのはネイティブのコンポーネントなので、同じコードでも機種によっては見た目が違う事もある
代表的なのはこんなの

| コンポーネント | 説明(htmlのタグでいうと)                                                                                                                                                                                                        |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| View           | スクロール無いdiv                                                                                                                                                                                                               |
| Text           | p                                                                                                                                                                                                                               |
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

コンポーネントのstyle属性に直書き(インライン)で書くのはモジュールがしっかり分かれていれば<br>
保守しづらくない思う。しかし複雑化してきたときや、特にパフォーマンスの観点から、<br>
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
attention: 以下の方法がある

#### 直接数値のみ入力  
これはandroidでは*dp*(density-independent pixels)、iosでは*ポイント*なる単位になる。iosはよくわからないけど、  
androidのdpは画面密度(dpi...dot per inch)に依存しないサイズ指定の方法。  
pxで直接指定すると、端末の解像度が高いと比較的小さな見た目で表示され、  
逆に解像度が低いと比較的大きく表示されるが  
dpで指定すると解像度の異なる端末でも見た目のサイズは同じくらいになるようになっている。

##### もうちょっと詳しく
解像度が異なる状態でpx指定すれば当然見た目のサイズは異なる。さらに解像度
は同じでも画面の幅が異なるものであればこれも見た目が異なる。
なので***1インチの中にどれだけのドットがあるか(dpi)***を考慮したdpとういう単位を作った。  
端末ごとにdpiが存在し、全てに対応するのは面倒なので、汎用密度というものを設定。下のmdpiを基準としてdpに倍率を掛けてpxへの変換が行われる。

| 汎用密度         | 倍率  | dp  | px   |
| ---------------- | ----- | --- | ---- |
| ldpi(~120dpi)    | x0.75 | 4dp | 3px  |
| mdpi(~160dpi)    | x1    | 4dp | 4px  |
| hdpi(~240dpi)    | x1.5  | 4dp | 6px  |
| xhdpi(~320dpi)   | x2    | 4dp | 8px  |
| xxhdpi(~480dpi)  | x3    | 4dp | 12px |
| xxxhdpi(~640dpi) | x4    | 4dp | 16px |

厳密にdp -> pxへの変換をしたいときは以下で。mdpiの160dpiを基準としておこなう。

[gimmick: math]()

$$ px = dp \times \frac{dpi}{160} $$

#### %指定で入力
#### flex

### flexbox
attention: デフォルトではflex方向は縦方向になっているはず
webではdisplay: flexするだけで横方向にならんだはずだけど

### 画面幅を取得する方法
attention: width: "100%"
Dimensions.~

---

## 画像の使用方法
attention: expoと少し違うので纏める

---

## インタラクティブ
attention: onPress,onLongPressまた、コールバックの引数のpresseevent

---

## よく使うコンポーネント？
attention: 
