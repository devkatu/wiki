# React基礎

公式のpropsやってるところ

- [ ] UI記述方法
- [ ] props
- [ ] リストや条件付きレンダー（UI記述方法に統一したい？）
- [ ] state、レンダリングについて
- [ ] その他フック



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

### コンポーネント定義のルール

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

また、propsとして関数を渡す場合は、`onClick={toggleLike()}`とはせずに、`onClick={toggleLike}`と、`()`を付けないようにしましょう。

HTMLの場合は前者のような感じで「実行したいJavaScriptコードを文字列で記述」できましたが、Reactの場合は飽くまでも全てJavaScriptであるので、レンダリングの都度`toggleLike`が実行されてしまいます。

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




これらを踏まえてArticleCard(記事カード)というコンポーネントの例は

```jsx
const ArticleCard = ({ title, date }) => {

  const toggleLike = () => {...}

  return (
    <article className="card">
      <span className="date">{date}</span>
      <h2>{title}</h2>
      <button onClick={toggleLike}>いいね！</button>
    </article>
  );
};
```

```jsx
import { useState } from "react";

const LikeButton = () => {
  // 1. 状態（State）を定義する
  // liked: いいね中かどうか (true/false)
  // count: いいねの数
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(100);

  // 2. ボタンが押された時の処理
  const toggleLike = () => {
    if (liked) {
      // すでに「いいね」なら解除する
      setLiked(false);
      setCount(count - 1);
    } else {
      // 「いいね」していなければ追加する
      setLiked(true);
      setCount(count + 1);
    }
  };

  return (
    <div className="like-container">
      {/* 3. 状態(liked)によって、見た目（クラス名やテキスト）を切り替える */}
      <button 
        className={`like-button ${liked ? "active" : ""}`}
        onClick={toggleLike}
      >
        {liked ? "❤️ いいね済み" : "🤍 いいね"}
      </button>

      <span className="like-count">{count}</span>
    </div>
  );
};

export default LikeButton;
```


- コールバックの記述について
  - クラスコンポーネントで記述する場合は、基本的にはアロー関数で記述してリスナに登録する。これでクラスコンポーネントでもbindが不要になる
  - リスナに設定する際はhtmlのような`onclick="hanle()"`にせずに`onClick={handle}`と()省略すること。あくまでjavascriptとして記述しているので()付きだとレンダリングの都度その関数が実行されてしまう
  - イベントハンドラには`SyntheticEvent`のインスタンスが渡される。ブラウザのイベントと同様に使える  
  `e.preventDefault();` はハンドラが設定された要素の規定の動作をキャンセルする。aタグだったらページ遷移したりチェックボックスだったらチェック入れるのやめたり。
  バニラjavascriptで`return false;`は有効だったけど、ReactではNGなので注意。
  `return false;`のことはjqueryの基礎の所に纏めてある
  ```
  function Form() {
    function handleSubmit(e) {
      e.preventDefault();
      console.log('You clicked submit.');
    }

    return (
      <form onSubmit={handleSubmit}>
        <button type="submit">Submit</button>
      </form>
    );
  }
  ```
- 条件付きでのレンダリング
  レンダリングしたい変数が存在するかチェックするパターン
  ```
  function Mailbox(props) {
    const unreadMessages = props.unreadMessages;
    return (
      <div>
        <h1>Hello!</h1>
        {unreadMessages.length > 0 &&
          <h2>
            You have {unreadMessages.length} unread messages.
          </h2>
        }
      </div>
    );
  }
  ```
  三項演算子のパターン
  ```
  function Loggin() {
    // 中略
    return (
      <div>
        {isLoggedIn
          ? <LogoutButton onClick={handleLogoutClick} />
          : <LoginButton onClick={handleLoginClick} />
        }
      </div>
    );
  }
  ```
- mapを使った複数のコンポーネントレンダーをする際、兄弟属性の中で一意となるkey属性を渡す。一意であるならなんでもいい。reactがどの要素に変更あったかを識別するために必要。 
  ```
  // mapの第二引数に配列のindexがくるのでそれを渡すのが簡単
  const todoItems = todos.map((todo, index) =>
    // Only do this if items have no stable IDs
    <li key={index}>
      {todo.text}
    </li>
  );
  ```
- カスタムコンポーネントでは属性を指定すると、コンポーネント内で`props.属性名`で引数のように指定ができる。  
  呼び出し側は以下の通り
  ```
  const function App(){
    return (
      <MyComponent title="My Title" discription="My Discription"/>
    )
  }
  ```
  定義は以下の通り
  ```
  const MyComponent = (props) => {
    return (
      <>
        <Title value={props.title}/>
        <Discription value={props.discription}/>
      </>
    )
  }
  ```
  下はpropsを分割代入にしている。
  ```
  const MyComponent = ({title, discription}) => {
    return (
      <>
        <Title value={title}/>
        <Discription value={discription}/>
      </>
    )
  }
  ```
- カスタムコンポーネントで挟んだ要素は該当のカスタムコンポーネント内で`props.children`で呼出せる。containerのようなコンポーネントで使う事がある
  以下のようなコンテナを用意して
  ```
  function FancyBorder(props) {
    return (
      <div className={'FancyBorder FancyBorder-' + props.color}>
        {props.children}
      </div>
    );
  }
  ```
  下のように使う
  ```
  function WelcomeDialog() {
    return (
      <FancyBorder color="blue">
        <h1 className="Dialog-title">
          Welcome
        </h1>
        <p className="Dialog-message">
          Thank you for visiting our spacecraft!
        </p>
      </FancyBorder>
    );
  }
  ```
- プロパティのデフォルト値は`true`になるがなるべく記述するのが推奨  
  以下二つは同義
  ```
  <MyTextBox autocomplete />

  <MyTextBox autocomplete={true} />
  ```

- jsxでの以下のような記述は
  ```
  <MyButton color="blue" shadowSize={2}>
    Click Me
  </MyButton>
  ```
  下のように変換される
  ```javascript
  React.createElement(
    MyButton,
    {color: 'blue', shadowSize: },
    'Click Me'
  )
  ```

---

## イミュータブルな操作
Reactではイミュータブルなデータの変更操作が必要となる。  

ミュータブル : 元のデータの変更を伴う(可変な)操作
```
var player = {score: 1, name: 'Jeff'};
player.score = 2;
// Now player is {score: 2, name: 'Jeff'}
```

イミュータブル : 元のデータの変更を伴わない(不変な)操作
```
var player = {score: 1, name: 'Jeff'};

var newPlayer = Object.assign({}, player, {score: 2});
// playerはもとのデータのままで変化無し
// newPlayer は {score: 2, name: 'Jeff'}

// スプレッド構文の方が楽ちん
// var newPlayer = {...player, score: 2};
```

これをやることで

- reactチュートリアルでやってたような履歴保持の機能とかが比較的簡単に実装できる
- イミュータブルな操作だと元のデータとの参照が別のものになるので変更の検出が容易になり、パフォーマンスの最適化に繋がるらしい

---

## フックで使う色々な機能
関数コンポーネントにクラスコンポーネントのような色々な機能をもたせることができる。useStateでは
> 原理的には関数は状態を持てません。ですが、React本体側にコンポーネント専用の変数領域を用意してもらって、その領域にデータを保存しておけば、見かけ上はまるで関数が状態を持っているように見せかけることができると思いませんか？useStateはまさにそれを行っているHooksであり、関数ではなくReact本体側にデータを保存します。  
[参考](https://sbfl.net/blog/2019/11/12/react-hooks-introduction/)

Reactフックは関数コンポーネントで使い、必ずトップレベルで呼び出すこと。

### useState  
- 関数コンポーネントにstateを持たせることができる。  
`value`がstateそのもの、  
`setValue`がstate更新用関数、  
`initial`が初期stateとなる。
  ```javascript
  [value, setValue] = useState(initial);
  ```
- `setValue()`にはそのまま更新したい値を渡してもいいが、関数を渡すとその関数の引数には更新前のstateが渡され、戻り値を更新する値とする事ができる
  ```javascript
  setValue(prev => prev + 1);
  ```
  これは`setValue`を連打したりしてレンダリングが複数回発生したりするとstateが正しく更新されない問題を解決したり、、  
  また以下のように`useCallback`でstate更新関数をメモ化したり、
  ```javascript
  useCallback(() => {
      setValue(prev => prev + 1);
  },[setValue])
  ```
  前回値を使って複雑な処理をしてから値を更新するときによく使う。  
  なお、この`setValue(prev => prev + 1)`の所を`setValue(value+1)`とかにしちゃうと`value`が最初の`callback`作ったときの値に固定されてしまう
- なお、この`setValue`は更新前の`state`とマージされないのでオブジェクトや配列のセット時は以下のようにスプレッドで前回stateを反映すること
  ```javascript
  setValue(prev => [...prev, newValue])
  ```
  クラスコンポーネントの`this.setState`だとマージされるみたいで分かりずらい・・・
- レンダリングの都度コンポーネント関数の呼出しが発生する  
そのため`setstate`しても`value`はその関数の実行中は変化せず、次にレンダリングが発生(関数呼び出し)したときに`value`に反映されることに注意
- state初期値に渡すものが関数の実行結果等で、計算量が大きい場合、`useState`にコールバックを渡す事で初回呼び出し時のみ、初期値計算を行うようにすることもできる。
  ```javascript
  const [count, setCount] = useState(() => heavyFunction())
  ```
  あんまり使う機会なさそうかな？

### useEffect
- 関数コンポーネントに、ライフサイクルを持たせる事ができる。(クラスコンポーネントでのcomponentDidmount,componentWillunmountとかの処理)  
渡したコールバックを**レンダリング後**に実行する。
  ```javascript
  useEffect(() => {
    someFunc(deps);
    return () => {
      cleanUp();
    }
  },[deps])
  ```
- 第一引数は副作用時(副作用のタイミングは第二引数によってきまる)に実行したい処理を書く。
- 第一引数のreturnする値はクリーンアップするためのものであり、コンポーネントがアンマウントされるとき(componentWillunmount時)に実行される
- 第二引数を省略すると  
  render後に毎回、第一引数の関数を実行(componentDidUpdate)
- 第二引数に依存する値の配列すると  
  初回のレンダリング後(componentDidmount)と、依存する値に変化があったときのレンダリング後に、第一引数の関数を実行
- 第二引数に空の配列`[]`を渡すと  
  変化がまったくないものとして考えられるので初回のレンダリング後(componentDidmount)にのみ第一引数に渡した関数を実行  
  →クリーンアップのコールバックを設定をするときにこれを使うと初回のマウント時のコールバックのみを保持することに注意！
- レンダリングの都度コンポーネント関数の呼出しが発生する  
そのため、コンポーネントの呼び出し毎に異なる参照の関数やオブジェクトが作られることとなり、`useEffect`の第二引数でオブジェクトをそのままぶち込んでも、毎回実体が異なるので、`前回レンダリングオブジェクト === 今回レンダリングのオブジェクト`は成立しない。これを解決するには
  - オブジェクト全体を比較せず、プロパティを指定、もしくは分割代入で依存配列を指定する(プリミティブな値を指定する)
  - `useMemo`で依存配列をメモ化する(オブジェクトの中身が変わらなければ、同じインスタンスを返すようにする)

  ```
  import { useState, useCallback, useEffect, useMemo } from "react";

  // カスタムフック
  const useCounter = () => {
    const [count, setCount] = useState(0);
    const countUp = useCallback(() => setCount(count + 1), [count]);
    // 返す値をメモ化しておく。これでcount,countUpが変化しない限り同じインスタンスが返される
    return useMemo(() => ({
      count,
      countUp,
    }), [count, countUp]);
  };

  export default () => {
    const counter1 = useCounter();
    const counter2 = useCounter();

    const [message, setMessage] = useState();

    // - useCounterの返す値がメモ化されていないと、counter2のボタンをクリックしても副作用が反応してしまう
    // - counter1はオブジェクトだが、メモ化されているので、
    //   各プロパティ値が変化しない限り、同じインスタンスが返されて、
    //   無駄なレンダリングが発生しない。
    // - メモ化しないでcounter1.countを指定したり、分割代入でcountを取り出して指定してもOK
    useEffect(() => {
      setMessage(`${new Date().toString()} に counter1 が変更されました`);
    }, [counter1]);

    return (
      <>
        <div>
          <button onClick={counter1.countUp}>counter1</button>
        </div>
        <div>
          <button onClick={counter2.countUp}>counter2</button>
        </div>
        <div>
          {message}
        </div>
      </>
    );
  };
  ```

### useCallback
**コールバック関数のメモ化**が可能になる。イベントハンドラーのようなcallback関数をメモ化し、不要に生成される関数インスタンスの作成を抑制、再描画を減らすことにより、都度計算しなくて良くなることからパフォーマンスを向上が期待できる。

`memoizedCallback`がメモ化された関数、  
`() => {doSomething(a, b)}`がメモ化したい関数、  
`[a, b]`が依存する値の配列となる。  
```javascript
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```
二つ目の配列の中身が変化しなければ関数の再計算はせず、レンダリングの都度キャッシュした関数が毎回帰ってくる仕組みになっている。  

state更新関数をメモ化するのは下記
```javascript
const [count, setCount] = useState(0);
const countUp = useCallback(() => setCount(count + 1), [count]);
```

### useMemo
useCallbackが関数自体をメモ化するが、useMemoは関数の**処理結果をメモ**する。
何回やっても結果が同じ場合の値などを保存し、処理に要する時間を削減できる。  

下記は`{count: countの値, countUp: countUpの値}`オブジェクトを返す関数が渡されており、`count`、`countUp`が変化しない限り同じインスタンスのオブジェクトを返し続ける。
`useCallback`や`React.memo`ほどは使う機会少なさそう。
```javascript
useMemo(() => ({
  count,
  countUp,
}), [count, countUp]);
```

`react.memo`と似た使い方で下記のようなことも。
`child1`,`child2`のレンダーコストが高くスキップしたい場合に適用できる…がこれと各コンポーネントを`react.memo`で囲うのと何がちがう？？
```
function Parent({ a, b }) {
  // Only re-rendered if `a` changes:
  const child1 = useMemo(() => <Child1 a={a} />, [a]);
  // Only re-rendered if `b` changes:
  const child2 = useMemo(() => <Child2 b={b} />, [b]);
  return (
    <>
      {child1}
      {child2}
    </>
  )
}
```
関数コンポーネント自体のmemo化は[`React.memo`](#レンダリングの最適化)を参照

### useContext
関数コンポーネントでコンテキストを使えるようになる。

> ある React コンポーネントのツリーに対して「グローバル」とみなすことができる、現在の認証済みユーザ・テーマ・優先言語といったデータを共有するために設計されています。

React公式ではテーマの変更とかに使っている所を紹介していた。  
コンポーネントのネストが深くなって下層のコンポーネントにのみ、propsのバケツリレーを避けるためにも使える。  
ReactNavigationでもScreenに追加のpropsを与える所とかで一部おすすめされている箇所があった。Tab間のデータ共有とかに使ったりした。

以下で  
`ThemeContext = React.createContext(themes.light)`で`themes.light`を初期値とするコンテキストを作成する(初期値は省略可能)    
`<ThemeContext.Provider value={themes.dark}>`で囲った要素内にコンテキストを提供する。ここでテーマは`value`に`themes.dark`を指定してるけど、これだと固定値になちゃうのでstate化した`theme`を渡すように加筆してる  
`useContext(ThemeContext)`で関数コンポーネント内で`ThemeContext`のコンテキストを参照できるようになる。この値が変化すると該当のコンポーネントは再レンダリングがされる。
```
const themes = {
  light: {
    foreground: "#000000",
    background: "#eeeeee"
  },
  dark: {
    foreground: "#ffffff",
    background: "#222222"
  }
};

// コンテキストを作成
const ThemeContext = React.createContext(themes.light);

function App() {

  // この辺公式ドキュメントに加筆してるのでちゃんと動くかはわからん
  const [theme, setTheme] = useState(themes.light);
  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      return prev == themes.light ? themes.dark : themes.light;
    })
  },[setTheme])
  // ここまで加筆

  return (
    {/* <ThemeContext.Provider value={themes.dark}> */}
    {/* コンテキストを提供するプロバイダーを設定 */}
    <ThemeContext.Provider value={theme}>  {/* 加筆 */}
      <Toolbar />
      <Button onClick={toggleTheme}>  {/* 加筆 */}
    </ThemeContext.Provider>
  );
}

function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton() {
  // コンテキストを読みだす
  // useContextを使わない場合はConsumerとかを使わなければならない
  const theme = useContext(ThemeContext);
  return (
    <button style={{ background: theme.background, color: theme.foreground }}>
      I am styled by theme context!
    </button>
  );
}
```

### useRef

webではDOMのAPIを使ったり、サードパーティのDOMライブラリを使ったりすることができる。
ReactNativeでもサードパーティのライブラリを入れるとrefを指定するものがあったりした。
基本的な使い方は下記となる。
```
function TextInputWithFocusButton() {
  // ★refを作成
  const inputEl = useRef(null);   
  const onButtonClick = () => {
    // ★ref.currentでDOMにアクセスしてAPIを使用できる
    inputEl.current.focus();
  };
  
  // ★refをDOMに設定する
  // 　ref属性にコールバック関数をわたせばより細かい制御もできたりする
  return (
    <>
      <input ref={inputEl} type="text" />
      <input ref={element => {inputEl = element}}>
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

また、refの特徴として以下のものがあり、

- useStateと異なり、再レンダリングは発生しない
- 値の変更は同期的に行われる。  
  useStateではsetStateで値を変更しても、同じレンダー内では値は変わらない
  ```
  const Counter = () => {
    const count = useRef(0);
    return (
      <button
        onClick={() => {
          console.log(count.current);   // 0が出力される
          count.current = 1;
          console.log(count.current);   // 1が出力される

          // useStateの場合は…
          console.log(count.current);   // 0が出力される
          setState(1);
          console.log(count.current);   // 0が出力される
        }}
      >
        カウント1
      </button>
    );
  };
  ```
- レンダリング毎に返されるrefオブジェクトは同じインスタンスのものとなる
- 自作した関数コンポ―ネントにはref属性を使用できない(インスタンスがないので)

react公式より引用
> 本質的に useRef とは、書き換え可能な値を .current プロパティ内に保持することができる「箱」のようなものです。

> しかしながら useRef() は ref 属性で使うだけではなく、より便利に使えます。これはクラスでインスタンス変数を使うのと同様にして、あらゆる書き換え可能な値を保持しておくのに便利です。  
> これは useRef() がプレーンな JavaScript オブジェクトを作成するからです。useRef() を使うことと自分で {current: ...} というオブジェクトを作成することとの唯一の違いとは、useRef は毎回のレンダーで同じ ref オブジェクトを返す、ということです。

これらの、**レンダリングが発生しない、値が同期的に更新される点から、直接描画に関与しないが、クラスでのインスタンス変数のような感じで値を保存して扱う事が考えられる。コンポーネントに保持したいけど、レンダリングしなくていいんだよな～ってやつはコレを使える。**  
以下の例はコンポーネントの呼出し時に一度だけ処理を行うために、フラグの管理をuseRefで行っている。
```
const useEffectOnce = (effect: React.EffectCallback) => {
  const called = useRef(false);

  useEffect(() => {
    if (!called.current) {
      called.current = true;
      return effect();
    }
  }, []);
};
```
[この記事](https://zenn.dev/so_nishimura/articles/c7ebfade970bcc)も参照！

### カスタムフック
コンポーネントからロジック部分を抽出して纏めることで、カスタムフックとして再利用可能にする。
結局実態は普通の関数と同じであるが、フックであることが一目で分かるように関数名を`use`で始める事が推奨(linterでチェックされるみたい)
普通に各コンポーネントで共通する処理を抽出して`useXxxxxx`のような関数に纏めて、抽出した各コンポーネントから呼び出すだけである。
当然、各カスタムコンポーネントから別なフックを呼び出すこともでき、それぞれのステートは独立している。

## パフォーマンス向上

### 長いリストの仮想化
`react-window`とか`react-virtualized`とかがあるのでそのうち使ってみたい

### レンダリングの最適化
各コンポーネントのレンダリングタイミングは`props` or `state`の更新、親コンポーネントが更新されタイミングであるが、親コンポーネントが更新されても、自コンポーネントの更新は必要ないパターンある。これの最適化を図りたい。

各コンポーネントはレンダーが発生する際に以下の処理を辿る。

1. `shouldComponentUpdate`(デフォルトの実装は何もせずに`return true;`)
2. 仮想DOMの比較
3. レンダー
   
クラスコンポーネントでは、このライフサイクルメソッド`shouldComponentUpdate`をオーバーライドすることで、それ以下の処理を継続orキャンセルし、再レンダーをコントロールすることができる。このライフサイクルメソッドには引数として次レンダーでの`props`と`state`が渡されるので、これらを比較してどの条件の時にレンダーが必要かを定義する。
単純に全てのprops、stateを浅く比較するだけであれば`React.PureComponent`を継承しても実現できる。ただし、浅い比較なので、配列やオブジェクトのstateであれば、スプレッド構文とかでちゃんと新しいインスタンスを割り当ててあげなければならない。

関数コンポーネントの場合は`React.memo`でコンポーネントをラップしてあげると良い。これでラップするとpropsのみを比較するようになる。(`React.PureComponent`はstateも比較)
`React.memo`には、新旧のpropsを受け取るカスタムの比較関数を 2 つめの引数として加えることができ、その関数がtrueを返した場合はコンポーネントの更新はスキップされる。
これはフック無し。
```javascript
const Button = React.memo((props) => {
  // your component
});
```

これらのmemo化と、[useMemo](#usememo)、[useCallback](#usecallback)もパフォーマンス最適化に寄与するのでそちらも参照

## パフォーマンスの測定
> `Profiler` を使って、React アプリケーションのレンダーの頻度やレンダーの「コスト」を計測することができます。 本機能の目的は、アプリケーション中の、**低速でメモ化などの最適化が有効な可能性のある部位を特定する手助けをすることです。**

`Profiler`の使い方は下記
- レンダリングコストを測定したいコンポーネントを`<Profiler></Profiler>`で囲み、
- 識別する`id`とレンダリングしたときのcalback関数を渡す
  ```
  render(
    <App>
      <Profiler id="Panel" onRender={callback}>
        <Panel {...props}>
          <Profiler id="Content" onRender={callback}>
            <Content {...props} />
          </Profiler>
          <Profiler id="PreviewPane" onRender={callback}>
            <PreviewPane {...props} />
          </Profiler>
        </Panel>
      </Profiler>
    </App>
  );
  ```
- プロファイリングされているコンポーネントが更新をコミットした際に`onRender`で指定されたコールバックが発火する。引数には
  ```javascript
  function onRenderCallback(
    id,             // `Profiler`に指定したid
    phase,          // "mount" | "update" 初回マウントか再レンダーか
    actualDuration, // 現在の更新で Profiler とその子孫のレンダーに要した時間。これがmemo化が有効に使えているかの指標になる
    baseDuration,   // Profiler ツリー内のそれぞれのコンポーネントの直近の render 時間。これが最悪のレンダーコストを見積もることができる
    startTime,      // レンダーを開始した時刻に対応するタイムスタンプ
    commitTime,     // レンダーをコミットした時刻に対応するタイムスタンプ
    interactions    // 更新がスケジュールされた（render や setState の呼び出しなどにより）際に trace された “interaction” の Set
  ) {
    // Aggregate or log render timings...
  }
  ```


## テスト
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

## その他tips
- ディレクトリ構成について  
view関係は各ページで共通要素(ヘッダーだとか)を纏めたcomponentsと、ページ呼出し単位のpagesくらいの分け方で。pagesの中身はcomponentsのつなぎ合わせとpage固有の要素普通にpagesとして作っていって、使いまわしたい要素がでてきたらcomponentsに纏める感じでもいいかも。componentsもその中でフォルダ分けしてpage毎に分けたりreducer毎に分けたりするのもいいかも
**ルーティングとか、ディレクトリ構成とか、なにかと面倒と感じるならNext.jsを導入してもいいかも**
- assetsとかは？  
スタイルは基本cssインポートと、materialUiならmakestyleでいいけど
assetsにいれるスタイルは共通のスタイル入れる？
imgは基本importでいいはず。publicフォルダはfaviconとか？？
assetsもpagesと同じような分け方のほうが見やすいかな
各ページに細かくスタイル分けるなら…

こんなイメージ？  
src  
  ├ assets  
  │ ├ css  
  │ └ img  
  ├ components  
  │ ├ componentA  
  │ ├ componentB  
  │ └ ...  
  └ pages  
    ├ pageA  
    ├ pageB  
    └ ...  

- 開発モードだとlogとかしないようにするやつは・・・？  
`process.env.NODE_ENV === 'development'`に`development`か`product`のような値が入っているのでこれをif文で見て処理を分岐するといいかも？開発中の仮サーバーでは`develpment`だが、buildすると`production`が入る

### createreactの公式より
- パブリックフォルダの使用  
publicフォルダ内のアセットを参照するには`PUBLIC_URL`の環境変数を使用する。  
例えば`<link rel="icon" href="%PUBLIC_URL%/favicon.ico"/>`のような感じで
javascript側からは`process.env.PUBLIC_URL`でアクセスできる...が色々欠点あるので
アセットはsrc側に置いておき、`import`して使うのが無難らしい

- 環境変数(開発モードでは、のやつとかぶるけど)
`NODE_ENV`や`REACT_APP`_(こちらはカスタム可能)から始まる環境変数というものがあり、あらかじめ宣言されている変数のように使用することができる。  
html側からは `%環境変数%` 、javsscript側からは`process.env.環境変数`で使用できる。
特に`process.env.NODE_ENV`は
  - npm start しているときは`development`
  - npm test しているときは`test`
  - npm run build したときは`production`  
となるので開発時、テスト時、のみ必要なコードを条件分岐して使用したりするのに良い。
カスタム環境変数`REACT_APP_`にはコマンドラインから一時的に変数の設定もできるし、
プロジェクトのルートから `REACT_APP_HOGE = "foo"` みたいに永続的な変数の定義もできる

- スタイル(cssモジュール)について  
複数のcssを読込む場合があるときにクラス名の衝突が考えられるが、
用意したcssのファイル拡張子を.cssから.module.cssにして
  ```
  import styles from 'style.module.css';

  // ...
  <div className={styles.class}/>`
  // ...
  ```
  のようにすると与えられたクラス名に__ハッシュ値が付与されて名前の衝突が起きなくなる。
  ちなみに普通にcssを読込むときは
  ```
  import '../assets/css/styles.css';
  ```
  みたいな感じ  
  ちなみに**sassやリセットcssも公式で用意**してるみたい。
- 画像等のassetの追加
  ```
  import logo from './logo.png';

  // ...
  <img src={logo}/>
  // ...
  ```
  とすると`logo`にはバンドル後のパス文字列が入る。これにもハッシュ値が付与される。  
  css側でも
  ```
  background: url(./logo.png);
  ```
  とかで同じような感じになる。