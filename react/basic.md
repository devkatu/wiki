# React基礎
ある程度の基礎は理解している前提のもと、コーディングに関する備忘録と、tips的な纏めを書いておく！  
結局コンポーネントにstateがあって、それが変化するとコンポーネントの更新と判断してレンダーが起こり、それをpropsとして受け取っているコンポーネントも更新されるのを理解しておけば概ねいいかな

## インストール
- create react app を使用するなら  
  `$ npx create-react-app my-app`  
  `$ cd my-app`  
  `$ npm start`  
  でプロジェクト作成、開発開始できる

  `$ npm run build`  
  で`build`フォルダーが出来上がり、その中にデプロイするものが出来上がる。
- Next.jsも選択肢。使ったらそのうちまとめる

---

## jsx記法について
- 変数にjsx記法でコンポーネントを代入していく事ができる。
  ```
  const element = <h1>Hello, world!</h1>;
  ```
- jsx中で式、変数を使う場合は波括弧`{}`で囲う
  ```
  const name = 'Josh Perez';
  const element = <h1>Hello, {name}</h1>;
  ```
  ```
  function formatName(user) {
    return user.firstName + ' ' + user.lastName;
  }
  const element = (
    <h1>
      Hello, {formatName(user)}!
    </h1>
  );
  ```
  ```
  const element = <img src={user.avatarUrl}></img>;
  ```
- クラスコンポーネントの`render`や関数コンポーネントの戻り値では一つの要素のみしか返せない。複数の要素を返したいときは`<div></div>`で囲う、または`<div>`だとセマンティックでなくなってしまうなら、`<> </>`(`<React.Fragment></React.Fragment>`)で囲う必要あり
  ```
  const Columns = () => {
    return (
      <>
        <td>Hello</td>
        <td>World</td>
      </>
    );
  }
  ```
- 属性においては予約語とかぶったりしないように記述する。
  - `class`   →   `className`
  - (labelの)`for`   →   `htmlFor` など
- 基本的に属性やcssのプロパティなどは**キャメルケース**を使う
  - `onclick="handle"`   →   `onClick={handle}`
  - `tabindex`   →   `tabIndex` など
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
```javascript
useMemo(() => ({
  count,
  countUp,
}), [count, countUp]);
```

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

これらから、**レンダリングが発生しない、値が同期的に更新される点から、直接描画に関与しないが、クラスでのインスタンス変数のような感じで値を保存して扱う事が考えられる。コンポーネントに保持したいけど、レンダリングしなくていいんだよな～ってやつはコレを使える。**  
以下の例はコンポーネントの呼出し時に一度だけ処理を行いたい時のもの。
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

## パフォーマンス向上
attention: 書きかけの項目

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