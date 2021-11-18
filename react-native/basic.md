# React Native

## 開発環境について

### React Native CLI
プロジェクトでネイティブコード(javaとかswiftとか)をビルドする必要があるならこちら  
そこまで凝ったもの作らないなら必要なし。しかも環境構築めんどくさいのでexpo使用中のため省略

### Expo CLI
expoなるフレームワークを使った超便利なやつ  
スマホにexpo goアプリをいれると超絶簡単デバッグが可能となる  
expoで標準で用意されているAPIとかもあってめっちゃ便利  

`npm install -g expo-cli`  
`expo init newProject`  
`cd newProject`  
`npm start`  

たったこれだけでOK!  
あとは[http://localhost:8081/debugger-ui/](http://localhost:8081/debugger-ui/) がブラウザ上で立ち上がるので  
そこのQRコードをスマホにインストールしたEXPO GOアプリで読取るか、エミュレータ―を立ち上げてから  
http://localhost:8081/debugger-ui/ 上でエミュレーターの  
開始をすると開発スタートできる状態になる

---

## デバッグ環境について

attention: 
chromeデバッグ画面にて
- 更新
- メニュー表示
リモートデバッグの開始の仕方
reactnativedevtoolのこと

--- 

## コンポーネントについて
いろいろコンポーネントはあるが基本`View`と`ScrollView`を押さえておけばほとんど問題ない  
自分でいろいろスタイルをいじくりたいなら別だけど、[react native directory](https://reactnative.directory/)やら[npm js](https://www.npmjs.com/)で便利なUIセットがたくさん用意されているので基本はそっちを使うと思う

### コアコンポーネント
これらコアコンポーネントを記述するとネイティブのコンポーネント(android,iphone上でのコンポーネント)を呼出す。  
あくまで画面上に表示されるのはネイティブのコンポーネントなので、同じコードでも機種によっては見た目が違う事もある
代表的なのはこんなの

| コンポーネント | 説明(htmlのタグでいうと)                                                                                                                                                                                                                            |
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
保守しづらくない思う。しかし複雑化してきたときや、特にパフォーマンスの観点から、<br>下のようにしたほうがいいらしい

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