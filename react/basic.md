# React基礎

メモ

- [x] UI記述方法
- [x] props
- [x] リストや条件付きレンダー（UI記述方法に統一したい？）
- [ ] state、レンダリングについて
- [ ] その他フック

- 純関数
  - 同じ入力に対して同じ出力…同じ入力なのに呼び出すたびに違う結果はNG
  - でもスクリーン更新、データ取得などで新たに画面を表示するものが副作用(sideEffect)
- state
  - 本来、関数そのものは状態を保存しておくことができません。コンポーネント関数はレンダリングの都度呼ばれ、そのローカル変数はレンダリングが終わると破棄されてしまいます。Reactでは、本体側にコンポーネント専用の変数領域を用意してもらい、その領域にデータを保存しておくことで、関数が状態を持っているように見せかけることができます。
  - stateが変化した時、そのコンポーネントと子コンポーネントがレンダーされる
  - setStateを行っても、今回レンダーの中ではstateの値は更新されず、次回レンダーで更新された値によるレンダーが行われる
  - 関数を渡した場合は「stateの値に対してこう変更してね」を定義するので複雑な更新も可能。また、同じコールバック内で`setstate(value + 1)`を連続して実行してもその`value + 1`がセットされるだけだたが、`setState(v => v + 1)`とすると回数分`v+1`される。なお、この連続した`setState`はreactがバッチ処理として一括して行い、コールバック内の処理が全て終わってからstateを計算し、レンダーが発生する(setStateの都度レンダーが発生するわけではない)
  - 更新用関数の引数は、対応するstate変数の頭文字を使って付ける、`prev`のようなプレフィックスを付けるのが一般的


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

各コンポーネントには状態(データ)を持たせることが可能です。各コンポーネントで、**「データがこうなったら画面はこう見える」**という定義をして画面の見え方を変えることが可能です。

例えばjQueryで、「ボタンを押したらある要素を書き換える」のようなケースでは次のようなコードとなります。

```javascript
// HTMLでは下記がある状態
// <button id="btn">Click me</button>
// <p id="text">Hello</p>

$('#btn').on('click', function() {
  // 1. 要素を見つける
  // 2. テキストを書き換える
  $('#text').text('Clicked!');
});
```

この例ではシンプルですが、ページが複雑になっていくと**どの処理がどの要素を操作しているか？**の把握が困難になり、スパゲティコードになりやすいです。

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

これが宣言型のUIと呼ばれるもので、`text`という状態を定義し、`<p>`要素の中身はこの`text`という状態が書き換えられる度に更新されます。(対しjQueryの例は命令型UIと呼ばれる)

jQueryの例のような「どの処理がどの要素を操作しているか？」を考える必要がなく、バグが発生しにくいものとなっています。

## インストール

多くの場合、Reactを単体で使用するケースは少なく、Next.jsやExpo(Android,iOSアプリ用)等のフレームワーク内でReactを使用します。

フレームワークによってルートコンポーネント(App.js等の一番上の階層にあるコンポーネント)も異なります。

`create-react-app`を使用して単体でのReactを使うこともできましたが、現在は非推奨となっているようです。

## コンポーネントの定義

コンポーネントは簡単に言うと**JSXを返すJavaScript関数**となります。

**JSX**は、JavaScriptファイル内にHTMLのようなマークアップを記述する記法です。これにより、HTMLはもちろん、自分で作成したコンポーネント等を記述することができます。

`MyComponent`という名前の最小限のコンポーネントを作る例を示します。

`MyComponent.jsx`ファイルを作成し、下記を記述します。拡張子は基本は`jsx`、TypeScriptを使用する場合は`tsx`となります。

```jsx
// MyComponent.js
import React from 'react';

// MyComponentを定義
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

```jsx
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

### コンポーネント定義のルールとJSX記法

#### コンポーネント関数の頭文字は大文字にする。

自作コンポーネント関数の頭文字は大文字にしましょう。

Reactが自作コンポーネントとそれ以外のHTMLタグ等を区別するために必要な仕組みであり、小文字とした場合はエラーになってしまいます。

```jsx
// 頭文字が小文字なのでNG
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

HTMLの属性名で`class`や`for`等、JavaScriptの予約語と被っているものがあります。これらはJSX中であってもあくまでJavaScriptとして解釈されるため、そのまま使用はできません。

代わりに`class`は`className`、`for`は`htmlFor`等に変える必要があります。

```jsx{3,4}
const ArticleCard = () => {
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

ここが宣言的UIにおいて最も重要な部分です。

JSX内で`{}`を用いると、この括弧内に記述したものはJavaScriptとして解釈され、テキスト・属性値に変数・関数等を適用することができます。

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

オブジェクトを渡す場合はJSXとしての`{}`とオブジェクトリテラルとしてに`{}`で二重の波括弧となります。

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

また、JSX内でのコメントも`{}`を使い、JavaScriptとしてコメントを追加できます。

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

その他のCSSを記述する手段としては、CSS Modules、Tailwind、CSS-in-JS等がありますが、これらは上記の様な制約はなく、通常のCSSとして記述できます。

### props

HTMLに属性を設定して様々な設定ができるように、コンポーネントに`props`を渡してその挙動を制御できます。

コンポーネントへの`props`の渡し方には主に次の2通りがあります。

- HTMLの属性と同様に`props`を指定して渡す
- コンポーネントの子要素として`props.children`で渡す

#### コンポーネントにpropsを渡す

まずはHTMLの属性と同様に渡す方法です。

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

```jsx
const ArticleCard = ( props ) => {

  // propsオブジェクトからtitle, dateを取り出す
  const { title, date } = props;

  ...

}
```

#### コールバック関数について

また、propsとしてコールバック関数を渡す場合は、`onClick={toggleLike()}`とはせずに、`onClick={toggleLike}`のように、`()`を付けないようにしましょう。

```jsx{1,2,6,9,10}
const ArticleCard = ({ title, date }) => {

  // コンポーネント関数内にコールバック関数を定義
  const toggleLike = () => {...}

  return (
    <article className="card">
      <span className="date">{date}</span>
      <h2>{title}</h2>
      {/* 定義したコールバック関数を()を付けずに渡す */}
      <button onClick={toggleLike}>いいね！</button>
    </article>
  );
};
```

HTMLでの場合は前者のような感じで「実行したいJavaScriptコードを文字列で記述」できましたが、Reactの場合は飽くまでも全てJavaScriptであるので、`()`がついていると、コンポーネントのレンダリングの都度`toggleLike`が実行されてしまう事になります。

または、コールバック関数での処理が短いものであれば、インラインで即時関数として`onClick={() => alert()}`のような書き方もアリです。

#### イベント伝搬、デフォルト動作の停止

イベントの伝播(バブリング)とは、あるイベントが子要素に発生したときに、親要素へもそのイベントが発生していくことです。これは`e.stopPropagation()`で停止できます。

```javascript
const handleButtonClick = (e) => {
  e.stopPropagation(); // 親の onClick が呼ばれるのを止める
  console.log("ボタンだけが押されました");
};
```

デフォルト動作とは、`<a>`タグだったらページ遷移したり、`<form>`だったらフォーム内のボタンをクリックしたらページ全体をリロードしたりといったブラウザの標準の動作のことです。これは、`e.preventDefault()`で停止できます。

```javascript
const handleSubmit = (e) => {
  e.preventDefault(); // ページがリロードされるのを防ぐ
  console.log("フォームを送信しました（リロードなし）");
};
```

jQueryを使用していた人であれば、これはコールバック関数内で`return false;`とすればよかったですが、reactではできないので注意しましょう。

#### コンポーネントに子要素を渡す(props.children)

次に、コンポーネントの子要素として渡す方法です。コンテナのような親コンポーネントとしてよく使います。

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

先程の例同様、コンポーネント関数の引数として、`{children}`を受け取ります。

```jsx
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

#### その他のpropsのルール

その他にpropsでは下記のようなルールがあります。

- propsを指定せずにコンポーネントを呼び出した場合に、そのpropsは`undefined`となります。デフォルト値を指定したい場合は、分割代入時にデフォルト値を設定します。  
    ```jsx
    {/* sizeプロパティが存在するが指定しなかった場合 */}
    <ArticleCard title={title} date={date} />
    ```

    ```javascript
    // sizeのデフォルト値を20として扱う
    const ArticleCard = ({ title, date, size = 20}) => {
      ...
    }
    ```
- propsに値を代入せずにコンポーネントを呼び出した場合、そのpropsは`true`として扱われます。  
    ```jsx
    {/* isNewに値を代入しないで呼び出し */}
    <ArticleCard title={title} date={date} isNew />
    ```

    ```javascript
    const ArticleCard = ({ title, date, isNew}){
      // isNewはtrueとして扱われる
      if ( isNew ) {
        ...
      }
    }
    ```
- コンポーネントを呼び出すときに、スプレッド構文でオブジェクトを展開して渡すことができます。  
    ```jsx
    const Profile = ({ person, size, isSepia, thickBorder }) =>  {
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
    これは次のようにできます。
    ```jsx
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
- コンポーネントに与えられたpropsを変更してはいけません。  
    ```jsx
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
    画面の再描画をしたい場合は後に説明する**state**を変更する必要があります。与えられたpropsを変更しても、データは変わるものの画面の見え方は変わらず、「データと見た目の不一致」等のバグが発生します。

### 条件付きでレンダーする

アコーディオンメニューの開閉や、「NEW」や「SALE」といったバッジの表示・非表示など、「特定の条件のときだけこの要素を表示したい」場合、三項演算子 `? :`、論理積 `&&`を使って実装することが可能です。

例えば、「セール中（`isSale`）」のときだけ「SALE!」というバッジを表示し、そうでない時は何も表示しない、または別のテキストを表示する商品カードのコンポーネントを見てみましょう。

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

このように、波括弧 `{}` の中でJavaScriptの条件式を書くことで、レンダリングする要素を柔軟に切り替えることができます。

### リストをレンダーする

お知らせ一覧やギャラリーの画像リスト、ナビゲーションメニューなど、同じ形式のデータを繰り返し表示する場合には`map()`等を使って、JSXの配列を生成することで実装可能です。

※`map()`は配列のメソッドで、引数として与えられた関数を全ての要素に対して適用して新しい配列を生成します。

例として、お知らせ（ニュース）の配列データから、`<ul>` と `<li>` を使ったリストを生成してみましょう。

```jsx
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

ここで注意すべきなのが、繰り返し出力している `<li>` タグに付与している `key={item.id}` です。

Reactは、リストの中の「どのアイテムが追加・変更・削除されたか」を効率よく把握するために、この `key` を目印にします。データが持っている一意のID（記事IDやデータベースのプライマリーキーなど）を `key` に指定するのを忘れないようにしましょう。

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

### state

#### useStateフック

#### stateの更新による再レンダー

