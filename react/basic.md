# React基礎

メモ

934行目くらいまで見直し中

1. ざっくりゴール・目的を説明
2. コード構文・考え方
3. 補足・詳細説明
4. コードサンプル

- [x] UI記述方法
- [x] props
- [x] リストや条件付きレンダー（UI記述方法に統一したい？）
- [x] state、レンダリングについて
- [ ] その他フック useEffectもこちら
- [ ] いい感じのコンポーネントのサンプルコード？？

- 純関数
  - 同じ入力に対して同じ出力…同じ入力なのに呼び出すたびに違う結果はNG
  - でもスクリーン更新、データ取得などで新たに画面を表示するものが副作用(sideEffect)






## Reactってなに？

今までの記事で紹介していたjQueryでは、「slick等でスライドショーを動かす」、「ボタンを任意の箇所までスクロール」等、**静的なページ(HTML)に部分的に動きを付ける**のが主な役割でした。

対してReactは、SNS、ECサイトのような**ユーザーの操作・サーバーの応答によって変化するデータに応じて画面を最適に書き換えるWEBアプリケーションの制作**に特化したJavaScriptライブラリです。

また、モバイルアプリの制作にもReactの技術が使用されているものもあります。

Reactでは次のような**JSX記法**と呼ばれる、HTML等の要素を返り値とするJavaScript関数により各要素を記述していきます。

```jsx
const MyButton = () => {
  return (
    <button>I'm a button</button>
  );
}
```

### コンポーネント指向

WEBサイト制作では基本的には画面を「1枚のページ」として捉えていましたが、Reactでは先の例のように「部品(コンポーネント)」単位で要素をパーツ化することができ、一度作ったパーツを他のページ等で使い回す事が可能です。


```jsx{11-13}
// 独自のコンポーネントを定義
const MyComponent = () => {
  return (
    <p>Hello world!</p>
  )
}

// 一度作ったコンポーネントを使いまわせる
const MyApp = () => {
  return (
    <>
      <MyComponent />
      <MyComponent />
      <MyComponent />
    </>
  )
}
```

この例では次のようなHTML要素が出力されます。

```html
<p>Hello world!</p>
<p>Hello world!</p>
<p>Hello world!</p>
```


### 宣言的なUI

各コンポーネントには状態(データ)を持たせることが可能です。各コンポーネントで、「**データがこうなったら画面はこう見える**」という定義をして画面の見え方を変えることが可能です。

例えばjQueryで、「ボタンを押したらある要素を書き換える」のようなケースでは次のようなコードとなります。

```javascript
// 下記のHTMLがある状態
// <button id="btn">Click me</button>
// <p id="text">Hello</p>

$('#btn').on('click', function() {
  // 1. 要素を見つける
  // 2. テキストを書き換える
  $('#text').text('Clicked!');
});
```

この例ではシンプルですが、ページが複雑になっていくと「**どの処理がどの要素を操作しているか**」の把握が困難になり、スパゲティコードになってしまいやすいです。

同じ処理をReactで表すと次のようになります。

```jsx{4,5,9-16}
import { useState } from 'react';

const App = () => {
  // 1. 状態（データ）を定義する
  const [text, setText] = useState('Hello');

  return (
    <>
      {/* 2. 状態に基づいた見た目を書く */}
      {/* ボタンを押すと、 Hello →  Clicked! となる */}
      <p>{text}</p>
      
      {/* 3. 状態を更新する関数を呼ぶだけ */}
      <button onClick={() => setText('Clicked!')}>
        Click me
      </button>
    </>
  );
}
```

これが宣言型のUIと呼ばれるもので、`text`という状態を定義し、`<p>`要素の中身はこの`text`という状態が書き換えられる度に更新されます。(これに対しjQueryの例は命令型UIと呼ばれる)

jQueryの例のような「どの処理がどの要素を操作しているか？」を考える必要がなく、バグが発生しにくい構造となっています。

## インストール

多くの場合、Reactを単体で使用するケースは少なく、Next.jsやExpo(Android,iOSアプリ用)等のフレームワーク内でReactを使用します。

フレームワークによってルートコンポーネント(App.js等の一番上の階層にあるコンポーネント)も異なります。

`create-react-app`を使用して単体でのReactを使うこともできましたが、現在は非推奨となっているようです。

## コンポーネントについて

コンポーネントは簡単に言うと**JSXを返すJavaScript関数**となります。

**JSX**は、JavaScriptファイル内にHTMLのようなマークアップを記述する記法です。これにより、HTMLはもちろん、自分で作成したコンポーネント等を記述することができます。

`MyComponent`という名前の最小限のコンポーネントを作る例を示します。

`MyComponent.jsx`ファイルを作成し、下記を記述します。拡張子は基本は`jsx`、TypeScriptを使用する場合は`tsx`となります。

```jsx
// MyComponent.js
// jsxを使うためにReactをインポート
import React from 'react';

// コンポーネント関数 MyComponent を定義
const MyComponent = () => {
  // JSXを返す
  return (
    <h1>Hello, world!</h1>
  );
}

// 定義したコンポーネントをデフォルトエクスポート
export default MyComponent;
```

定義した`MyComponent`は次のように使用することができます。

```jsx{3,8}
// App.js
import React from 'react';
import MyComponent from './MyComponent';  // 定義したMyComponentをインポート

// Appコンポーネント中でMyComponentを呼び出す
const App = () => {
  return (
    <MyComponent />
  );
}

export default App;
```

後述するpropsを渡す場合は、HTMLの属性と同様に記述します。

また、子要素を渡す場合もHTML同様に、`<開始タグ>子要素</閉じタグ>`のように記述します。

```jsx{8-10}
// App.js
import React from 'react';
import MyComponent from './MyComponent';  // 定義したMyComponentをインポート

// Appコンポーネント中でMyComponentを呼び出す
const App = () => {
  return (
    <MyComponent hoge="hoge">
      子要素
    </MyComponent>
  );
}

export default App;
```

### コンポーネント定義のルールとJSX記法

コンポーネントを定義する際には、Reactが定めるルールがいくつかあり、アプリをビルドする際にチェックされます。

#### コンポーネント関数の頭文字は大文字にする。

自作コンポーネント関数の頭文字は大文字にしましょう。

Reactが自作コンポーネントとそれ以外のHTMLタグ等を区別するために必要な仕組みであり、小文字とした場合はエラーになってしまいます。

```jsx
// NG 頭文字が小文字になっている
const articleCard = () => {
  return <h2>title</h2>
}
```

```jsx
// OK
const ArticleCard = () => {
  return <h2>title</h2>
}
```

#### `return`文内で改行する場合は`()`で要素を囲う

`return`文が一行で終わる場合はそのまま`()`無しでもOKです。

```jsx{2}
const ArticleCard = () => {
  return <h2>title</h2>
}
```

要素のネスト等により改行が必要となった場合は`()`で要素全体を囲います。

```jsx{2-6}
const ArticleCard = () => {
  return (
    <article>
      <h2>title</h2>
    </article>
  )
}
```

#### コンポーネントは単一のルート要素を返す

コンポーネントは単一のルート要素しか返せません。複数の要素を返したいときは全体を`<div></div>`等の親タグで囲う必要があります。

下記は複数の要素が横並びの状態なのでNGです。

```jsx{3-6}
const ArticleCard = () => {
  // これはNG
  return (
    <span>date</span>
    <h2>title</h2>
  )
}
```

次のように親タグを用意しましょう。

```jsx{3-8}
const ArticleCard = () => {
  // ここではarticleタグで囲っている
  return (
    <article>
      <span>date</span>
      <h2>title</h2>
    </article>
  )
}
```

また、親タグとして適当なものが無い場合は、`<>`と`</>`で全体を囲います。(`React.Fragment`)

```jsx{3-8}
const ArticleCard = () => {
  // <>と</>で囲う
  return (
    <>
      <span>date</span>
      <h2>title</h2>
    </>
  )
}
```

#### JSX中での属性名に注意

HTMLの属性名には`class`や`for`等、JavaScriptの予約語と被っているものがあります。

JSXは、飽くまでJavaScriptとして解釈されるため、そのまま`class`や`for`等を使用することはできません。

代わりに`class`は`className`、`for`は`htmlFor`等に変える必要があります。

```jsx{4,5}
const ArticleCard = () => {
  // classのかわりにclassNameを使用する
  return (
    <article className="card">
      <span className="date">date</span>
      <h2>title</h2>
    </article>
  );
};
```

また、`onclick`は、JavaScriptのプロパティ名に合わせて`onClick`等、キャメルケースで記述する必要があります。

主なHTML属性と、それに対応するJSXでの属性名の対応は以下の通りです。

| HTML属性名   | JSX（React）属性名 | 備考                                           |
| :----------- | :----------------- | :--------------------------------------------- |
| class        | className          | JSの class 構文と重複を避けるため              |
| for          | htmlFor            | labelで使用。JSの for ループと重複を避けるため |
| onclick      | onClick            | イベントはすべてキャメルケースになる           |
| onchange     | onChange           | 入力値の変更検知                               |
| tabindex     | tabIndex           | キーボード操作の順序                           |
| readonly     | readOnly           | フォームの読み取り専用設定                     |
| maxlength    | maxLength          | 入力できる最大文字数                           |
| autocomplete | autoComplete       | オートコンプリート設定                         |
| rowspan      | rowSpan            | テーブルの行結合                               |
| colspan      | colSpan            | テーブルの列結合                               |

#### JSX中で式、変数を使用したい場合は`{}`を使用する

宣言的UIにおいて最も重要な部分です！

JSX内で波括弧`{}`を用いると、この**波括弧`{}`内に記述したものはJavaScriptとして解釈され、テキスト・属性値に変数・関数等を適用**することができます。

```jsx{10,11}
const ArticleCard = () => {

  // 変数を定義
  const date = new Date();
  const title = 'Hello, world!';
  const toggleLike = () => {...}

  // 定義した変数を{}内に展開
  return (
    <article className="card">
      <span className="date">{date}</span>
      <h2>{title}</h2>
      <button
        className="like-button"
        onClick={toggleLike}
      >
        いいね！
      </button>
    </article>
  );
};
```

属性にオブジェクトを渡す場合等は、JSXとしての`{}`とオブジェクトリテラルとしての`{}`で二重の波括弧となります。

```jsx{5,8}
const ArticleCard = () => {
  // styleにオブジェクトを渡す
  return (
    <article
      style={{
        backgroundColor: "pink",
        padding: "20px"
      }}
    >
      <span className="date">date</span>
      <h2>title</h2>
    </article>
  );
};
```

また、JSX内でのコメントは`{}`を使い、JavaScriptとしてコメントを追加できます。

```jsx{4}
const ArticleCard = () => {
  return (
    <article className="card">
      {/* JSX内でコメントを追加できる */}
      <span className="date">date</span>
      <h2>title</h2>
    </article>
  );
};
```

#### CSSの記述

インラインでCSSを記述する場合は、JavaScriptのオブジェクトとして記述しなければなりません。

`background-color`のようなプロパティは、`-`がJavaScriptでの算術演算子として認識されてしまうため、`backgroundColor`のようなキャメルケースとして記述します。

主なCSSプロパティと、それに対応するJSXでの属性名の対応は以下の通りです。

| CSSプロパティ名  | JSXでのプロパティ名 | 記述例（JSX）                              |
| :--------------- | :------------------ | :----------------------------------------- |
| background-color | backgroundColor     | { backgroundColor: "red" }                 |
| font-size        | fontSize            | { fontSize: "16px" }                       |
| margin-top       | marginTop           | { marginTop: "10px" }                      |
| padding-left     | paddingLeft         | { paddingLeft: "20px" }                    |
| flex-direction   | flexDirection       | { flexDirection: "column" }                |
| justify-content  | justifyContent      | { justifyContent: "space-between" }        |
| align-items      | alignItems          | { alignItems: "center" }                   |
| box-shadow       | boxShadow           | { boxShadow: "0 2px 4px rgba(0,0,0,0.1)" } |

また、設定する値も数値・文字列である必要があり、`10px`のような記述では妥当ではなく、`"10px"`のように変換する必要があります。次の様なルールとなっています。

- 単位無しの数値 : そのまま数値として記述
- 単位ありの数値やキーワード : 文字列として記述

以下に例を挙げます。

```jsx
// NG
// プロパティ名に「‐」が入っており引き算しようとする
// 値の「10px」という変数をさがしてしまう
<div style={{
  margin-top: 10px
}}>

// OK
<div style={{ 
  marginTop: 10,        // 数値なら自動で "10px" になる
  width: "50%",         // 単位付き数値は文字列にする
  display: "flex"       // キーワードも文字列にする
}}>
```

このルールはインラインでのCSS記述に関するものです。

ReactではCSSを記述する手段として、CSS Modules、Tailwind、CSS-in-JS等があり、これらは上記の様な制約はなく、通常のCSSとして記述できます。

### props

HTMLに属性を設定して様々な設定ができるように、**コンポーネントに`props`を渡して、コンポーネントの見た目を変えたり、イベントハンドラを渡す**等の事ができます。

コンポーネントへの`props`の渡し方には主に次の2通りがあります。

- HTMLの属性と同様の方法で`props`を指定して渡す
- コンポーネントの子要素として`props.children`で渡す

#### コンポーネントにpropsを渡す

まずはHTMLの属性と同様に渡す方法です。

自作のコンポーネントには任意の名前のpropsを指定して渡すことが出来ます。

`ArticleCard`に`title`と`date`を渡す例を示します。

```jsx{7}
const App = () => {
  // propsとして渡す変数
  const title = "記事タイトル";
  const date = new Date();

  // title,dateというpropsを渡す
  return <ArticleCard title={title} date={date}/>
}
```

コンポーネントに渡した`props`は、コンポーネント関数にて`props`というオブジェクトで引数として受け取ることが出来ます。次のように引数の所で`{}`を用いて分割代入をするのが一般的です。

```jsx{1,2,6,9,10}
// title,dateとしてpropsを受け取る
const ArticleCard = ({ title, date }) => {

  const toggleLike = () => {...}

  // 受け取ったtitle,dateのpropsを使用
  return (
    <article className="card">
      <span className="date">{date}</span>
      <h2>{title}</h2>
      <button onClick={toggleLike}>いいね！</button>
    </article>
  );
};
```

`props`オブジェクトとしてそのまま受け取るコードでも同じですが、あまりやりません。

```jsx{1,4}
const ArticleCard = ( props ) => {

  // propsオブジェクトからtitle, dateを取り出す
  const { title, date } = props;

  ...

}
```

#### イベントハンドラを渡す

また、propsとしてイベントハンドラを渡す場合は、コンポーネント関数内にイベントハンドラを定義したうえで、`onClick={toggleLike()}`のようにはせずに、`onClick={toggleLike}`と、`()`を付けずに渡しましょう。

```jsx{1,2,6,9,10}
const ArticleCard = ({ title, date }) => {

  // コンポーネント関数内にイベントハンドラを定義
  const toggleLike = () => {...}

  return (
    <article className="card">
      <span className="date">{date}</span>
      <h2>{title}</h2>
      {/* 定義したイベントハンドラを()を付けずに渡す */}
      <button onClick={toggleLike}>いいね！</button>
    </article>
  );
};
```

HTMLでの場合は前者のような感じで「実行したいJavaScriptコードを文字列で記述」できました。しかし、Reactの場合は飽くまでも全てJavaScriptであるので、`()`がついていると、コンポーネントのレンダリングの都度`toggleLike`が実行されてしまう事になります。

または、イベントハンドラでの処理が短いものであれば、インラインで`onClick={() => alert()}`のように即時関数をその場で書く方法もアリです。

#### イベント伝搬、デフォルト動作の停止

イベントの伝播(バブリング)とは、子要素をクリックした等のイベントが発生したときに、親要素へもそのイベントが発生していくことです。これは`e.stopPropagation()`で停止できます。

```javascript{2}
const handleButtonClick = (e) => {
  e.stopPropagation(); // 親の onClick が呼ばれるのを止める
  console.log("子のボタンだけが押されました");
};
```

デフォルト動作とは、`<a>`タグだったらページ遷移したり、`<form>`だったらフォーム内のボタンをクリックしたらページ全体をリロードしたりといったブラウザの標準の動作のことです。これは、`e.preventDefault()`で停止できます。

```javascript{2}
const handleSubmit = (e) => {
  e.preventDefault(); // ページがリロードされるのを防ぐ
  console.log("フォームを送信しました（リロードなし）");
};
```

jQueryを使い慣れた人であれば、これらはイベントハンドラの終わりに`return false;`とすればよかったですが、Reactではできないので注意しましょう。

#### コンポーネントに子要素を渡す(props.children)

`props.children`を使用すると、**そのコンポーネントの子要素を受け取ることが出来ます**。コンテナのような親コンポーネントでよく使います。

`<ContentBlock>`コンポーネントで子要素を挟む例を示します。

```jsx{4-7}
const App = () => {
  return (
    {/* ContentBlockの子要素を記述する */}
    <ContentBlock title="最新のニュース">
      <p>ここにお知らせの文章が入ります。</p>
      <button>一覧を見る</button>
    </ContentBlock>
  );
};
```

子要素としたもの(ここでは`<p></p>`と`<button></button>`)が、コンポーネント関数にて`props.children`で受け取れます。

他のpropsと同様に、コンポーネント関数の引数として、`{children}`を受け取り、適当な場所に配置します。

```jsx{2,7}
// 子要素に記述した要素はchildrenとして受け取る
const ContentBlock = ({ title, children }) => {
  return (
    <div className="content-block">
      <h2 className="block-title">{title}</h2>
      {/* 子要素(children)を以下に流し込む */}
      <div className="block-body">{children}</div>
    </div>
  );
};
```

なお、この`<ContentBlock>`の例では最終的に次のようなHTMLとなります。

```html
<div className="content-block">
  <h2 className="block-title">最新のニュース</h2>
  <div className="block-body">
    <p>ここにお知らせの文章が入ります。</p>
    <button>一覧を見る</button>
  </div>
</div>
```

#### その他のpropsのルール・挙動について

propsでは下記のようなルールがあります。

**★コンポーネントに与えられたpropsを変更してはいけません。**

```jsx{4,5}
const ArticleCard = ({ title, date }) => {

  const changeTitle = () => {
    // propsを変えてはいけない！
    props.title = "new title";
  }

  return (
    <article className="card">
      <span className="date">{date}</span>
      <h2>{title}</h2>
      <button onClick={changeTitle}>タイトルを変える</button>
    </article>
  );
};
```

画面の再描画をしたい場合は後に説明する**state**を変更する必要があります。

与えられたpropsを変更しても、**データは変わるものの画面の見え方は変わらず、「データと見た目の不一致」等のバグが発生**します。

---

**★propsを指定せずにコンポーネントを呼び出した場合に、そのpropsは`undefined`となります。**

```jsx
{/* コンポーネントにsizeが存在するが指定しなかった場合はundefined扱いになる */}
<ArticleCard title={title} date={date} />
```

デフォルト値を指定したい場合は、コンポーネント関数の分割代入時に、デフォルト値を設定します。  

```javascript
// sizeのデフォルト値を20として扱う
const ArticleCard = ({ title, date, size = 20}) => {
  ...
}
```

---

**★propsに値を代入せずにコンポーネントを呼び出した場合、そのpropsは`true`として扱われます。**

下記のように`isNew`に値を指定せずに呼び出します。

```jsx
{/* isNewに値を代入しないで呼び出し */}
<ArticleCard title={title} date={date} isNew />
```

コンポーネントでは`isNew`は`true`として扱われます。

```javascript{2,3}
const ArticleCard = ({ title, date, isNew}){
  // isNewはtrueとして扱われる！
  if ( isNew ) {
    ...
  }
}
```

---

**★スプレッド構文でオブジェクトの各プロパティを展開して渡すことができます。**

コンポーネントに複数のpropsを渡す時、オブジェクトにそれらをまとめて渡すことが出来ます。

例えば次のように各propsをそのまま同じ名前で渡している場合です。

```jsx{4-10}
const Profile = ({ person, size, isSepia, thickBorder }) => {
  return (
    <div className="card">
      {/* 受取ったpropsをそのまま同じ名前で渡す */}
      <Avatar
        person={person}
        size={size}
        isSepia={isSepia}
        thickBorder={thickBorder}
      />
    </div>
  );
}
```

これは次のようにpropsをスプレッドで展開して渡すことができます。

```jsx{4}
const Profile = ( props ) =>  {
  return (
    <div className="card">
      <Avatar { ...props } />
    </div>
  );
}
```

但し、このようにpropsを丸々渡している場合、わざわざ`Profile`というコンポーネントを介して`Avatar`にpropsを渡すのは無駄なので、`Profile`をコンテナとして独立させて次のようにするのがいいでしょう。

```jsx
// コンテナとなるコンポーネントとする
const ProfileCard = ({ children }) => {
  return (
    <div className="card">
      {children}
    </div>
  )
}
```

```jsx
{/* propsは子コンポーネントに直接渡す */}
<ProfileCard>
  <Avatar src="...">
</ProfileCard>
```

### 条件付きでレンダーする

アコーディオンメニューの開閉や、「NEW」や「SALE」といったバッジの表示・非表示などのように、「**特定の条件のときだけこの要素を表示したい**」場合、論理積 `&&`や、三項演算子 `? :`を使って実装することが可能です。

```javascript
// flagがtrueなら要素を表示、falseなら何も表示しない
flag && <div>trueの時に表示する要素</div>

// flagによって表示する要素を変える
flag ? <div>trueの時に表示する要素</div> : <div>falseの時に表示する要素</div>
```

例えば、「セール中（`isSale`）」の値によってレンダリングする要素を変えたい場合は次のようにします。

```jsx{6,7,9-12}
const ProductCard = ({ name, isSale }) => {
  return (
    <div className="product-card">
      <h3>{name}</h3>
      
      {/* isSaleが true のときだけSALEバッジを表示 */}
      {isSale && <span className="badge-sale">SALE!</span>}

      {/* isSaleの値によって表示するテキストを切り替える場合（三項演算子） */}
      <p className="price-text">
        {isSale ? "今だけ特別価格！" : "通常価格"}
      </p>
    </div>
  );
}
```

### リストをレンダーする

お知らせ一覧やギャラリーの画像リスト、ナビゲーションメニューなど、**同じ形式のデータを繰り返し表示する場合には`map()`等を使って、JSXの配列を生成**することで実装可能です。

※`map()`は配列のメソッドで、元の配列をもとに、中身を別の形へ変換した新しい配列を作成するメソッドです。

```javascript
// このようなitems配列があり・・・
const items = [
  { id: 1, value: "A"},
  { id: 2, value: "B"},
  { id: 3, value: "C"}
]
```

```jsx
// items配列から<li>の配列を作る
items.map((item) => (
  <li key={item.id}>{item.value}</li>
))
```

ここで注意すべきなのが、繰り返し出力している `<li>` タグに付与している `key={item.id}` です。

Reactは、リストの中の「どのアイテムが追加・変更・削除されたか」を効率よく把握するために、この `key` を目印にします。データが持っている一意のID（記事IDやデータベースのプライマリーキーなど）を `key` に指定するのを忘れないようにしましょう。

例として、お知らせ（ニュース）の配列データから、`<ul>` と `<li>` を使ったリストを生成してみましょう。

```jsx{11-17}
const NewsList = () => {
  // お知らせデータの配列（実際の制作ではWordPressなどのAPIから取得したりします）
  const newsItems = [
    { id: 1, date: '2026.03.29', title: 'Webサイトをリニューアルしました', isImportant: true},
    { id: 2, date: '2026.03.15', title: '春のキャンペーンのお知らせ', isImportant: false },
    { id: 3, date: '2026.03.01', title: '新サービス開始について', isImportant: true }
  ];

  return (
    <ul className="news-list">
      {newsItems.map((item) => (
        // リストの各項目には、必ず一意の「key」プロパティを設定します
        <li key={item.id} className="news-item">
          <time className="news-date">{item.date}</time>
          <a href={`/news/${item.id}`}>{item.title}</a>
        </li>
      ))}
    </ul>
  );
}
```

上記の例で実際にレンダリングされる要素は次のようになります。

```html
<ul class="news-list">
  <li class="news-item">
    <time class="news-date">2026.03.29</time>
    <a href="/news/1">Webサイトをリニューアルしました</a>
  </li>
  <li class="news-item">
    <time class="news-date">2026.03.15</time>
    <a href="/news/2">春のキャンペーンのお知らせ</a>
  </li>
  <li class="news-item">
    <time class="news-date">2026.03.01</time>
    <a href="/news/3">新サービス開始について</a>
  </li>
</ul>
```

また、`filter()`を使うと引数に与える関数により、特定の要素のみを返すことも可能です。

```jsx{12}
const NewsList = () => {
  // お知らせデータの配列（実際の制作ではWordPressなどのAPIから取得したりします）
  const newsItems = [
    { id: 1, date: '2026.03.29', title: 'Webサイトをリニューアルしました', isImportant: true},
    { id: 2, date: '2026.03.15', title: '春のキャンペーンのお知らせ', isImportant: false },
    { id: 3, date: '2026.03.01', title: '新サービス開始について', isImportant: true }
  ];

  return (
    <ul className="news-list">
      {newsItems
        .filter((item) => item.isImportant)  // isImportantがtrueの要素のみ返す
        .map((item) => (
          <li key={item.id} className="news-item">
            <time className="news-date">{item.date}</time>
            <a href={`/news/${item.id}`}>{item.title}</a>
          </li>
      ))}
    </ul>
  );
}
```

次の要素が返されます。

```html
<ul class="news-list">
  <li class="news-item">
    <time class="news-date">2026.03.29</time>
    <a href="/news/1">Webサイトをリニューアルしました</a>
  </li>
  <li class="news-item">
    <time class="news-date">2026.03.01</time>
    <a href="/news/3">新サービス開始について</a>
  </li>
</ul>
```

### stateとその仕組み

コンポーネントに与えるpropsで、画面に表示する要素を色々変えられることはわかりました。

しかし、propsだけでは、コンポーネント内のボタンを押してアコーディオンメニューを開閉したり、タブメニューを切り替えたりなどの実装はできません。

ユーザーの操作に応じて画面の表示内容を変えたいとき、Reactでは**state(状態)**を使用します。

propsが「外部から渡されるデータ」だったのに対し、state は「**コンポーネント自身が保持するデータ**」のことです。**このstateに変更を与えてやることで、再びレンダリング(表示する要素の再計算)が発生し、画面の表示内容が更新されます。**

※・・・しかし本来、JavaScriptの関数そのものは状態を保存しておくことができません。コンポーネント関数はレンダリングの都度呼び出され、その中のローカル変数はレンダリングが終わると破棄されてしまいます。Reactでは、React本体側にコンポーネント専用の変数領域にデータを保存し、あたかも関数が状態を持っているように見せかけることができます。これはフックと呼ばれる仕組みで実現され、stateの他にも様々なフックがあります。

#### useStateフック

Reactでstateを扱うための基本的なフックが`useState`です。

例として次のように使います。

```jsx{1,2,5,6,10-13,15,16}
// useStateをインポート
import { useState } from 'react';

const ToggleMessage = () => {
  // useStateをコンポーネント関数の最初に呼び出す
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div>
      {/* stateを更新する関数を定義し、イベントハンドラとして渡す */}
      <button onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? '非表示にする' : '表示する'}
      </button>

      {/* stateを使ってUIを制御する */}
      {isVisible && <p>隠れていたメッセージが表示されました！</p>}
    </div>
  );
};
```

先に述べたように、関数はデータを保持しておくことができないので、**該当コンポーネントで固有のデータを保持する領域を`useState`で作ってもらいます**。引数に渡すものはstateの初期値です。

```javascript
const [現在state, state更新関数] = useState(state初期値)
```

ここで**受け取った「現在state」をpropsと同様にコンポーネント内で使用し、「state更新関数」を実行してstateを更新**します。

但し、次のようなルールがあります。

**★必ずコンポーネント関数内の最初に呼出す**  
`useState`の呼び出しは、必ずコンポーネント関数内の最初に呼び出し、条件分岐、ループ内、ネストされた関数内では行いません(他のフックも同様)。他にもコンポーネント内で必要なstateが出てきたら、同様に必要なだけの`useState`を追加します。

**★state更新関数名はsetXxxx**  
stateを`value`という名前にした場合、state更新関数の方は`setValue`のように`set`＋`state変数名`のようにするのが慣例となっています。この一貫性があると、state更新関数が一目で分かり、保守が容易になります。

**★stateの更新はstate更新関数のみで行う**  
**stateの更新は、state更新関数のみで行い、`state = true`のような更新はしてはいけません**。state更新関数をイベントハンドラで実行するようにしてあげます。これはreact側でstateの更新を検出できなくなってしまうためです。読取専用の変数のように扱うようにしましょう(イミュータブルともいう)

```jsx{3}
<button
  onClick={() => {
    setIsVisible(!isVisible);  // state更新関数で更新
    // isVisible = !isVisible;  これはNG
  }}
>
  {isVisible ? '非表示にする' : '表示する'}
</button>
```

state更新関数は、引数として変更したい値などを受け取ります。(その他にもあるので後述します)

例の場合は、`!isVisible`としているので、レンダリングされたときのstate値(ここでは真偽値)を反転してセットしています。

これで、ボタンクリック等のイベントに応じて表示する要素を切り替えることが可能になりました！

#### state更新関数

state更新関数は引数として2つの種類を受け取ります。

1. `setValue(変更する値)`
2. `setValue(stateをどのように更新するか定義した関数)`

1.については先に述べた通り、変更したい値をそのまま渡せばOKです。

2.の方は、**「前回state値を引数に受け取り、次にセットしたいstate値を返す関数」**を渡してあげます。

```javascript
// レンダー時のstateに+1した値へ更新する
setValue(v => v + 1)
```

また、渡す関数の引数名には、慣例的にstateが`value`なら`v`といったstate変数の頭文字を使ったり、`prev`を使います。

これは、stateをインクリメントする、値を反転する、配列に変更を加える、などのように、**「今のstate値」に対する変更を加えたい場合**に使用します。

例えば、一つのイベント内でstateの値を複数回インクリメントをしたい場合に、次のようにしてもうまくいきません。

```jsx
<button onClick={() => {
  // NG: 連続して実行しても、全て同じ現在の値に+1されるだけ
  setCount(count + 1);
  setCount(count + 1);
  setCount(count + 1);
}}>
  +1 ボタン
</button>
```

これは、レンダー時の`count`というstateは、イベントハンドラの処理が全て終わり、次のレンダーが発生するまで変化しないためです。

あるレンダー時の`count`の値が`3`であったとき、上記のコードは次のようなコードを実行しているのと同じです。

```javascript
setCount(4)
setCount(4)
setCount(4)
```

一方、次のようにstateをどのように更新するか定義した関数を渡した場合は、狙い通り処理されます。

```jsx
<button onClick={() => {
  // OK: 回数分きちんと加算される
  setCount(c => c + 1);
  setCount(c => c + 1);
  setCount(c => c + 1);
}}>
  +1 ボタン
</button>
```

`setCount`に渡す関数は、引数に前回stateの値を取るので、複数回`setCount`が実行されても都度stateの値は更新されます。

同様にあるレンダー時の`count`の値が`3`だったとき、次のコードが実行されるのと同じ意味となります。

```javascript
setCount(4)  // 3に+1される
setCount(5)  // 前回値4に+1される
setCount(6)  // 前回値5に+1される
```

ここまでは極端な例ですが、具体的には次のようなケースで効果を発揮します。

- **複数個所からのstate更新があった場合**  
  →上記の`setCount`は一つのイベントハンドラ内でしたが、複数箇所から同時多発的に発生する場合
- `setTimeout`や、後述する`useEffect`に渡す関数でのstate更新など、**関数が定義された瞬間のstateに固定される(クロージャ)場合**    
  →`setTimeout`で数秒遅延後にstateを更新する関数を実行する場合、そのstateは関数定義時の値に固定されます。その数秒間の間に他の箇所からstateが更新されていても、`setTimeout`で実行する関数のstateはそのままです。

なお、この連続したstate更新は、react側でバッチ処理として一括して行い、イベントハンドラ内の処理が全て終わってからstateを計算し、レンダーが発生するので、パフォーマンス低下にはつながらないようです。(`setCount`を実行するごとにレンダーが発生するわけではない)

#### 配列、オブジェクト型のstate更新

配列やオブジェクトの更新時にも、先に述べたように元のstateを直接変更するようなことはしてはいけません。

例えば、配列に新しい要素を加えたい、オブジェクトの中のプロパティを一つだけ変更したい場合を見てみます。

```javascript
const [items, setItems] = useState(['りんご', 'みかん']);
const [position, setPosition] = useState({x: 0, y: 0});

// どちらもNG
items.push('ぶどう')
position.x = 10;
```

この例ではstateを更新関数を使用せずに直接書き換えているのでNGです。

配列やオブジェクトのstate更新は、殆どの場合その要素の一部のみを更新する事になります。これは「今のstateに対する変更」となるので先に述べた「stateをどのように更新するか定義した関数」でstateを更新します。

「今のstate」を変更に含めるためには、**stateをスプレッド構文`...state`でコピーして、新しい配列やオブジェクトを作成し、それを新しいstateとしてセット**する事となります。

これが配列・オブジェクト型のstateの更新でよく使うパターンとなります。

先の例を正しく書き換えてみましょう。

```jsx
const [items, setItems] = useState(['りんご', 'みかん']);
const [position, setPosition] = useState({x: 0, y: 0});

// OK: スプレッド構文で元のstateをコピーして`ぶどう`を追加
setItems(i => [
  ...i,
  'ぶどう'
])

// OK: スプレッド構文で元のstateをコピーして、xを10にセットする
setPosition(p => ({
  ...p,
  x: 10
}))
```

また、配列に対しての更新は、他にも`map`を使って特定の要素を変更したり、`filter`を使って条件に合う要素を抽出したり等の使用がよくあります。

例えば、先の`items`の配列の二番目のstateを更新したい場合は`map`を使って次のようにします。

```javascript
const [items, setItems] = useState(['りんご', 'みかん']);

setItems(prevItems => {                    // 最新stateを引数に受け取り、 
  return prevItems.map((item, index) => {  // 最新stateに一つずつアクセスし、
    if (index === 1) {
      return 'ぶどう';                 // indexが1(2番目の要素)を更新
    } else {
      return item;                    // その他の要素はそのまま
    }
  });
});
```

条件を指定して要素を抽出したい場合は`filter`を使います。

```javascript
const [items, setItems] = useState(['りんご', 'みかん', 'ぶどう']);

setItems(prevItems => 
  // targetName（例：'みかん'）以外の要素だけで新しい配列を作る
  prevItems.filter(item => item !== 'みかん')
);
```

この`map`、`filter`内のロジックによって、複雑なstateの変更も可能となります。

※配列メソッドの中には`push`、`pop`等の、**既存の配列を変更してしまうメソッド(破壊的メソッド)があるので、これをstateに対して使ってはいけません。**

ただしスプレッド構文は**浅いコピー（shallow copy）**となり、配列やオブジェクトの最上位階層のみをコピーするため、深くネストされたオブジェクトの更新には注意が必要です。

複雑な場合は`Immer`といったライブラリを利用して、変更したいプロパティのみを指定して更新することもできます。

#### 再レンダーのタイミングと注意点

自コンポーネントでのstate更新の他にも、次のようなタイミングで再レンダーがトリガされます。

- 該当のコンポーネントのstateが更新された
- 親コンポーネントが再レンダリングされた
- useContext(後述)を使っているときに、そのデータが更新された

これらの条件で再レンダーが起こる事により、データと画面の表示が常に同期されます。

ここで注意したいのが、`setState`（状態を更新する関数）を呼び出しても、**現在のレンダー中ではstateの値はすぐに更新されない**という点です。次回レンダー時に初めて、更新された値が反映されます。

先の例の`setCount`も同様ですが、次のような例ではどうでしょう。

```jsx
const [count, setCount] = useState(0);

// --- 省略 ---

<button
  onClick={() => {
    setCount(c => c + 1); // stateを0→1に更新
    console.log(count);   // ここでは0が表示される(レンダー時の値が表示)
  }}
>
  現在のカウント：{count}
</button>
```

`setCount`によって、再レンダーが要求されるものの、そのレンダーが発生するまでは`count`の値は更新されません。

そのため、上記の例では`console.log(count);`は初回押し下げ時は`0`と、ボタンが押し下げられた時点での`count`の値が表示されることになります。

上記のように更新された値を使って何らかの処理をしたい場合は、state更新と同様の処理を行う変数を用いるなどの対策をするのが良いでしょう。

```javascript
<button
  onClick={() => {
    const newCount = count + 1;
    setCount(newCount);    
    console.log(newCount); 
  }}
>
  現在のカウント：{count}
</button>
```

### stateの管理

stateの運用方法やその他について記載する

#### コンポーネント間でstateを共有する

複数のコンポーネント間で同じstateを共有したい場合、共通の親コンポーネントへstateを移動させる**リフトアップ**という手法を用います。

次の例は、タブメニューの切替を行うものです。

タブの切替を行う`TabButton`コンポーネントと、コンテンツを表示する`TabContent`コンポーネントがあり、これらコンポーネントは兄弟関係にあります。

`TabButton`コンポーネントに持たせているstateでは、兄弟要素である`TabContent`のコンテンツを制御できません。

```jsx
import { useState } from 'react';

// --- 子コンポーネント：タブボタン ---
const TabButton = ({ label }) => {
  // 自分の「色」だけを管理するstate
  // buttonのクリックによってTabContentを制御したいけどこのままでは出来ない
  const [isActive, setIsActive] = useState(false);

  return (
    <button 
      onClick={() => setIsActive(a => !a)}
      style={{ backgroundColor: isActive ? '#007bff' : '#eee', color: isActive ? '#fff' : '#000' }}
    >
      {label}
    </button>
  );
};

// --- 子コンポーネント：表示コンテンツ ---
const TabContent = () => {
  // 自分の「表示内容」だけを管理するstate
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
      <p>現在のコンテンツstate: {activeTab}</p>
      {/* 外部から命令を受け取れないので、表示を切り替える手段がない... */}
    </div>
  );
};

// --- 親コンポーネント ---
export default function TabContainer() {
  // TabButtonにもたせているstateでは
  // TabContentの制御ができない・・・
  return (
    <div>
      <nav>
        <TabButton label="ホーム" />
        <TabButton label="プロフィール" />
      </nav>
      <TabContent />
    </div>
  );
}
```

`TabContent`の表示をコントロールするためには、**親コンポーネントの`TabContainer`でstateを管理する**必要があります。

これを**stateのリフトアップ**と呼び、以下のように変更してみます。

- `TabButton`、`TabContent`で個別にstateを持たせていたものをやめて、`TabContainer`にstateを移動させる。
- state更新用関数は、**propsとして`TabButton`に渡し**、アクティブにするタブをセットしてもらうようにする
- stateそのものは、**propsとして`TabContent`に渡し**、そのstateを用いて表示するコンテンツを制御する
- `TabButton`のアクティブ表示は、親コンポーネント側でアクティブタブと照らし合わせてpropsとして渡す

```jsx
import { useState } from 'react';

// --- 子コンポーネント：タブボタン ---
// 親コンポーネントからstateを元に判定したアクティブフラグ、state更新関数を受け取る
const TabButton = ({ label, isActive, onClick }) => {
  return (
    <button 
      onClick={onClick}
      style={{ backgroundColor: isActive ? '#007bff' : '#eee', color: isActive ? '#fff' : '#000' }}
    >
      {label}
    </button>
  );
};

// --- 子コンポーネント：表示コンテンツ ---
// 親コンポーネントからstateを受け取る
const TabContent = ({ activeTab }) => {
  return (
    <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
      {activeTab === 'home' && <p>ホーム画面のコンテンツです。</p>}
      {activeTab === 'profile' && <p>プロフィール画面のコンテンツです。</p>}
    </div>
  );
};

// --- 親コンポーネント：ここでstateを管理（リフトアップ先） ---
export default function TabContainer() {
  // 共通で使うstateを親で定義
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div>
      <nav>
        {/* 親から「今の値」と「更新用関数」をPropsで渡す */}
        <TabButton 
          label="ホーム" 
          isActive={activeTab === 'home'} 
          onClick={() => setActiveTab('home')} 
        />
        <TabButton 
          label="プロフィール" 
          isActive={activeTab === 'profile'} 
          onClick={() => setActiveTab('profile')} 
        />
      </nav>

      {/* 同じStateを別のコンポーネントにも渡す */}
      <TabContent activeTab={activeTab} />
    </div>
  );
}
```

#### stateの設計

state管理でバグを減らすためには、適切なstateの設計が重要です。

次のような項目に注意してstateを設計します。

- **一緒に変更されるstateはまとめる**  
  常に同時に更新するデータは、個別のstateにせずに、1つのオブジェクトにまとめます。これにより、stateの更新忘れを防ぎます。(例：マウスの座標`x`と`y`などを`{ x: 0, y: 0 }`にまとめる)
- **計算できる情報はstateにしない**  
  パフォーマンスや一貫性の観点から、既存のpropsやstateから計算で求められるものはstateとして持たないようにします。これにより、重複したstateを持ったり、複数の関連するstateが矛盾した状態になるのを防ぐことができます。
  例：`firstName`と`lastName`があるなら、`fullName`はレンダリング時に結合し作る
- **深いネストを避ける**  
  更新が複雑になるため、stateが深くネストされた構造になるのは極力避けます。

#### reducerを使用する

アプリの規模が大きくなってくると、stateが肥大化したり、更新処理が複雑化したりしていきます。

コンポーネントではUIを「どう表示するか」に集中したいのに、stateの更新処理のコードが邪魔して、コード全体の見通しが悪くなることが多いです。

例えば、ショッピングカート機能のように、「アイテムの追加」「削除」「数量変更」など、のstate更新があるとします。

```jsx
import { useState } from 'react';

export default function VanillaCart() {
  const [cart, setCart] = useState([]);

  // ★商品を追加するロジック
  const addItem = (product) => {
    setCart(prevCart => {
      const isExist = prevCart.find(item => item.id === product.id);
      if (isExist) {
        // カート内にすでにあったら数量を＋1（入れ子になったmapとスプレッドが必要で複雑...）
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // カート内になければ新規追加
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // ★数量を増やすロジック（追加時とほぼ同じコードが重複しがち）
  const incrementQuantity = (id) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // ★削除するロジック
  const removeItem = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  return (
    <div>
      <h2>ショッピングカート（useState版）</h2>
      {cart.map(item => (
        <div key={item.id} style={{ marginBottom: '10px', borderBottom: '1px solid #eee' }}>
          {item.name} - {item.price}円 (数量: {item.quantity})
          <button onClick={() => incrementQuantity(item.id)}>+</button>
          <button onClick={() => removeItem(item.id)}>削除</button>
        </div>
      ))}
      
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => addItem({ id: 1, name: 'おしゃれな椅子', price: 5000 })}>
          カートに椅子を追加
        </button>
        <button onClick={() => addItem({ id: 2, name: 'モダンな机', price: 12000 })}>
          カートに机を追加
        </button>
      </div>
    </div>
  );
}
```

コンポーネント内でstateを更新するための多数のロジックが書かれていて、なかなか見通しが悪いですね。

ここにさらに追加のstatte更新処理を加えたくなったとしたらますます悪化します

`useReducer`を使うと、このstateの更新ロジックを、コンポーネントの外へ追い出す事ができます。

次のように`useState`から`useReducer`へ移行していきます。

1. state更新のロジックを`dispatch`関数へ変更する

`useReducer`(後述)から返される`dispatch`関数へ置き換えます。`dispatch`には引数としてオブジェクトを渡します。

このオブジェクトには、**「何が起きたか」と**、**stateの更新に最低限必要な情報**を渡します。

```diff
- <button onClick={() => incrementQuantity(item.id)}>+</button>
- <button onClick={() => removeItem(item.id)}>削除</button>

+ <button onClick={() => dispatch({ type: 'INCREMENT', id: item.id })}>+</button>
+ <button onClick={() => dispatch({ type: 'REMOVE', id: item.id })}>削除</button>
```

```diff
- <button onClick={() => addItem({ id: 1, name: 'おしゃれな椅子', price: 5000 })}>
- カートに椅子を追加
- </button>
- <button onClick={() => addItem({ id: 2, name: 'モダンな机', price: 12000 })}>
- カートに机を追加
- </button>

+ <button onClick={() => dispatch({ type: 'ADD_ITEM', payload: { id: 1, name: 'おしゃれな椅子', price: 5000 } })}>
+ 椅子を追加
+ </button>
+ <button onClick={() => dispatch({ type: 'ADD_ITEM', payload: { id: 2, name: 'モダンな机', price: 12000 } })}>
+ 机を追加
+ </button>
```

`dispatch`に渡すオブジェクトは**actionオブジェクト**といい、形式は自由に決められますが、次のように`type`、`payload`を持つ形式が一般的です。

```javascript
{
  type: "ADD_ITEM" // 何が起きたか判別するための文字列
  payload: {       // state更新に最低限必要なオブジェクト
    id: 1,
    name: "おしゃれな椅子", 
    price: 5000
  }
}
```

2. reducer関数を定義する

reducer関数は変更前のstateと、`dispatch`されたactionオブジェクトを受け取って、それらを元に新しいstateを返すものです。

先程コンポーネント内で行っていたstateの更新処理をやめて、このreducer関数内でstate更新を行うようにします。

```javascript
// 1つ目のstateには変更前のstate、
// 2つ目のactionにはdispatchされたオブジェクトが入る
const cartReducer = (state, action) => {
  // actionのタイプによってstate更新方法を分岐
  // returnする値が新しいstateとなる
  switch (action.type) {

    // addItem内のstate更新と同等の処理
    case 'ADD_ITEM': {
      const isExist = state.find(item => item.id === action.payload.id);
      if (isExist) {
        return state.map(item =>
          item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    }

    // incrementQuantity内のstate更新と同等の処理
    case 'INCREMENT':
      return state.map(item =>
        item.id === action.id ? { ...item, quantity: item.quantity + 1 } : item
      );

    // removeItem内のstate更新と同等の処理
    case 'REMOVE':
      return state.filter(item => item.id !== action.id);

    default:
      return state;
  }
};

```

3. `useReducer`でコンポーネントと作成した`cartReducer`を関連付ける

コンポーネントで`useReducer`をインポートします。

```javascript
import { useReducer } from 'react';
```

コンポーネントのトップレベルで`useReducer`を呼び出し、`useState`は不要となるので削除します。

`useReducer`へ渡す引数は、先の`cartRducer`と、初期stateとなり、返り値はstateとdspatch関数になります。

```diff
- const [cart, setCart] = useState([]);
+ const [cart, dispatch] = useReducer(cartReducer, []);
```

コード全体は以下のようになります。

```jsx
import { useReducer } from 'react';

// 1. 脳の部分（更新ロジックをコンポーネントの外に切り出す）
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const isExist = state.find(item => item.id === action.payload.id);
      if (isExist) {
        return state.map(item =>
          item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    }

    case 'INCREMENT':
      return state.map(item =>
        item.id === action.id ? { ...item, quantity: item.quantity + 1 } : item
      );

    case 'REMOVE':
      return state.filter(item => item.id !== action.id);

    default:
      return state;
  }
};

export default function ReducerCart() {
  // 2. stateと、命令を出すためのdispatchを受け取る
  const [cart, dispatch] = useReducer(cartReducer, []);

  return (
    <div>
      <h2>ショッピングカート（useReducer版）</h2>
      {cart.map(item => (
        <div key={item.id} style={{ marginBottom: '10px', borderBottom: '1px solid #eee' }}>
          {item.name} - {item.price}円 (数量: {item.quantity})
          {/* 3. UIは「何が起きたか」をdispatchで送るだけ！ */}
          <button onClick={() => dispatch({ type: 'INCREMENT', id: item.id })}>+</button>
          <button onClick={() => dispatch({ type: 'REMOVE', id: item.id })}>削除</button>
        </div>
      ))}
      
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => dispatch({ type: 'ADD_ITEM', payload: { id: 1, name: 'おしゃれな椅子', price: 5000 } })}>
          椅子を追加
        </button>
        <button onClick={() => dispatch({ type: 'ADD_ITEM', payload: { id: 2, name: 'モダンな机', price: 12000 } })}>
          机を追加
        </button>
      </div>
    </div>
  );
}
```

コンポーネントのコード見通しがよくなりましたね！

stateの更新ロジックも`cartReducer`にて一元化されることで管理が容易になりました。

アプリの規模が大きくなってくると更に効果を実感できるでしょう。



まとめると、

- コンポーネントでは直接stateを更新せずに、`dispatch`で「アクション（発生したこと）」を指定
- `reducer`関数側で「アクションに対してstateをどう更新するか」を定義

これにより、「何が起きたか」と「状態をどう変えるか」を分離（関心の分離）でき、コードの見通しが良くなります。誤った`setState`をしてしまうリスクも減らすことができます。

逆に、シンプルなstate更新（トグルボタンなど）であれば、reducerを入れるとコード量が増えるだけなので`useState`で十分でしょう。

#### contextを使用する

巨大なコンポーネントのツリーでstateをリフトアップしていくと、そのstateを必要としないツリー途中のコンポーネントでも、下層のコンポーネントの為だけにpropsをバケツリレーのように渡さなければならない場合があります。

例えば、`App > Header > ThemeButton`のような階層のコンポーネントツリーがあり、`ThemeButton`でライト・ダークテーマを切替て、`App`全体のテーマに適用する場合を考えてみましょう。


```jsx
import { useState } from 'react';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <div style={{ 
      backgroundColor: isDark ? '#333' : '#fff', 
      color: isDark ? '#fff' : '#000',
      height: '100vh' 
    }}>
      <h1>Propsリレーのデモ（Contextなし）</h1>
      {/* 1. AppからHeaderへ渡す */}
      <Header isDark={isDark} toggleTheme={toggleTheme} />
    </div>
  );
}

// 2. 中間のコンポーネント。
// 自分では使わないのに、下のThemeButtonに渡すためだけにPropsを受け取っている（バケツリレー）
function Header({ isDark, toggleTheme }) {
  return (
    <header style={{ border: '1px solid gray', padding: '10px' }}>
      <p>ここはヘッダーです（Propsを中継中...）</p>
      {/* 3. HeaderからThemeButtonへ渡す */}
      <ThemeButton isDark={isDark} toggleTheme={toggleTheme} />
    </header>
  );
}

// 4. 孫コンポーネント。ようやくPropsを受け取って使う。
function ThemeButton({ isDark, toggleTheme }) {
  return (
    <button onClick={toggleTheme}>
      {isDark ? 'ライトモードにする' : 'ダークモードにする'}
    </button>
  );
}
```

中間となる`Header`コンポーネントではstateを一切使っていないにも関わらず、子コンポーネントの為にstateを中継しています。

コンポーネントのツリーがもっと長かったり、受け渡すstateの数がもっと多かったりした場合、その分propsのバケツリレーも多くなりコードの見通しがどんどん悪くなっていきます。

このような場合に、**context**を使えば、**中間のコンポーネントを飛ばして、必要なコンポーネントに直接データを提供することができます。**

1. コンテクストを作成する

各コンポーネントに値を提供するためのコンテクストを作成します。`createContext`を`react`からインポートし、`createContext`に初期値を渡すと、コンテクストが作成できます。

```javascript
import { createContext } from 'react';

export const ThemeContext = createContext(false);
```

2. stateのリフトアップをしたコンポーネントをコンテクストで囲む

先に作成したコンテクスト`ThemeContext`で、リフトアップ先のコンポーネントを囲みます。

コンテクストのpropsには`value`を指定し、使用先に渡したい変数を渡します。

また、propsをバケツリレーしていた`Header`のpropsは不要となるので削除します。

```jsx
export default function App() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <ThemeContext value={{ isDark, toggleTheme }}>
      <div style={{ 
        backgroundColor: isDark ? '#333' : '#fff', 
        color: isDark ? '#fff' : '#000',
        height: '100vh' 
      }}>
        <h1>useContextのデモ</h1>
        <Header />
      </div>
    </ThemeContext>
  );
}
```

3. コンテクストを使用する

先に作成したコンテクストの値を使用します。`useContext`を`react`からインポートし、引数に先に作成したコンテクスト`ThemeContext`を渡します。

これで、`ThemeContext`の`value`に指定した値を直接受け取ることが可能になります。

```jsx
import { useContext } from 'react';

const ThemeButton = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <button onClick={toggleTheme}>
      {isDark ? 'ライトモードにする' : 'ダークモードにする'}
    </button>
  );
}
```

コードの全文はこちらです。


```jsx
import { useState, createContext, useContext } from 'react';

// 1. 「箱（Context）」を作る。
//    他のファイルからも使えるように export するのが一般的です。
export const ThemeContext = createContext(false);

export default function App() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    // 2. 「Provider（提供者）」で囲む。
    //    valueに入れたものが、配下のどこからでも取り出せるようになる。
    <ThemeContext value={{ isDark, toggleTheme }}>
      <div style={{ 
        backgroundColor: isDark ? '#333' : '#fff', 
        color: isDark ? '#fff' : '#000',
        height: '100vh' 
      }}>
        <h1>useContextのデモ</h1>
        <Header />
      </div>
    </ThemeContext>
  );
}

// 中間のコンポーネント。Propsは一切受け取っていないし、渡していない！
function Header() {
  return (
    <header style={{ border: '1px solid gray', padding: '10px' }}>
      <p>ここはヘッダーです（ただの中間層）</p>
      <ThemeButton />
    </header>
  );
}

// 孫コンポーネント。ここでいきなりデータを取り出す！
function ThemeButton() {
  // 3. useContextを使って、一番近いProviderからデータを受け取る
  const { isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <button onClick={toggleTheme}>
      {isDark ? 'ライトモードにする' : 'ダークモードにする'}
    </button>
  );
}
```