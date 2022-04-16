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
関数コンポーネントにクラスコンポーネントのような色々な機能をもたせることができる。
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
- `setValue()`にはそのまま更新したい値を渡してもいいが、関数を渡すとその関数の引数には更新前のstateが渡される
  ```javascript
  setValue(prev => prev + 1);
  ```
  これは`setValue`を連打したりしてレンダリングが複数回発生したりするとstateが正しく更新されない問題を解決したり、、  
  また以下のようにuseCallbackでstate更新関数をメモ化するときに使える。
  ```javascript
  useCallback(() => {
      setValue(prev => prev + 1);
  },[setValue])
  ```
  この`setValue`の所を`setValue(value+1)`とかにしちゃうと`value`が最初の`callback`作ったときの値に固定されてしまう
- なお、この`setValue`は更新前の`state`とマージされないのでオブジェクトや配列のセット時は以下のようにスプレッドで前回stateを反映すること
  ```javascript
  setValue(prev => [...prev, newValue])
  ```
  クラスコンポーネントの`this.setState`だとマージされるみたいで分かりずらい・・・
- レンダリングの都度コンポーネント関数の呼出しが発生する  
そのため`setstate`しても`value`はその関数の実行中は変化せず、次にレンダリングが発生(関数呼び出し)したときに`value`に反映されることに注意

- レンダリングの都度コンポーネント関数の呼出しが発生する  
コンポーネント内で定義した関数やオブジェクト等についても同じく
  コンポーネントの呼び出し毎に異なる参照の関数やオブジェクトが作られる
  その為、`useEffect`の第二引数とかで関数やオブジェクトをそのままぶち込んでも
  毎回実体が異なるので`usecallback`とか`usememo`とかしないとダメ

### useEffect
　　→クラスコンポーネントでのcomponentDidmount,componentWillunmountとかの処理を関数コンポーネントで使える上に一気にかける
　　第一引数は副作用時(副作用のタイミングは第二引数によってきまる)に実行したい処理を書く。第一引数のreturnする値はクリーンアップするためのものであり、
　　componentWillunmount時に実行される
　　第二引数を省略すると、render後に毎回、第一引数の関数を実行
　　第二引数にある値の配列を渡すと、componentDidmount時と、render時に指定されたある値に変化があったとき第一引数の関数を実行
　　第二引数に空の配列[]を渡すと、変化がまったくないものとして考えられるのでcomponentDidmount時にのみ第一引数に渡した関数を実行
　　　→useEffectでコールバックを設定をするときにこれを使うと初回のマウント時のコールバックのみを保持することに注意！

### useCallback
→コールバック関数の再計算をせずにすむ
一つ目の引数に普通にコンポーネントに渡す感じの関数を書いて、
二つ目の引数(配列リテラルで渡す)にはその依存する変数の配列を渡す。
二つ目の配列の中身が変化しなければ関数の再計算はせずにキャッシュした関数の戻り値のみを使用する

### useContext

## その他tips
- view関係は共通要素のcomponentsとページ呼出し単位のpagesくらいの分け方で
　componentsの中身はatomicデザインのざっくりした感じ。
　pagesの中身はcomponentsのつなぎ合わせとpage固有の要素
　普通にpagesとして作っていって使いまわした要素がでてきたらcomponentsに纏める感じでもいいかも
　componentsもその中でフォルダ分けしてpage毎に分けたりreducer毎に分けたりするのもいいかも
- assetsとかは？
　スタイルは基本cssインポートと、materialUiならmakestyleでいいけど
　assetsにいれるスタイルは共通のスタイル入れる？
　imgは基本importでいいはず。publicフォルダはfaviconとか？？
　assetsもpagesと同じような分け方のほうが見やすいかな
　各ページに細かくスタイル分けるなら…



・開発モードだとlogとかしないようにするやつは・・・？
　process.env.NODE_ENV === 'development'
　にdevelopmentかproductのような値が入っているのでこれをif文で見て処理を分岐するといいかも
　開発中の仮サーバーではdevelpmentだが、buildするとproductionが入る

createreactの公式読む
・パブリックフォルダの使用
　publicフォルダ内のアセットを参照するにはPUBLIC_URLの環境変数を使用する。
　例えば<link rel="icon" href"%PUBLIC_URL%/favicon.ico"/>のような感じで
　javascript側からはprocess.env.PUBLIC_URLでアクセスできる...が色々欠点あるので
　アセットはsrc側に置いておき、importして使うのが無難

・環境変数(開発モードでは、のやつとかぶるけど)
　NODE_ENVやREACT_APP_(こちらはカスタム可能)から始まる環境変数というものがあり、
　あらかじめ宣言されている変数のように使用することができる。
　html側からは %環境変数% 、javsscript側からはprocess.env.環境変数で使用できる。
　特にprocess.env.NODE_ENVは
　　npm start しているときは'development'
　　npm test しているときは'test'
　　npm run build したときは'production'となるので
　　開発時、テスト時、のみ必要なコードを条件分岐して使用したりするのに良い。
　カスタム環境変数REACT_APP_にはコマンドラインから一時的に変数の設定もできるし、
　プロジェクトのルートから REACT_APP_HOGE = "foo" みたいに永続的な変数の定義もできる

・スタイル(cssモジュール)について
　cssの読み込みは各ページ等に対応したcssファイルを用意してある。
　複数のcssを読込む場合があるときにクラス名の衝突が考えられるが、
　用意したcssのファイル拡張子を.cssから.module.cssにして
　import styles from 'style.module.css';
　<div className={styles.class}/>
　のようにすると与えられたクラス名に__ハッシュ値が付与されて名前の衝突が起きなくなる。
　ちなみに普通にcssを読込むときは
　import '../assets/css/styles.css';
　みたいな感じ
・画像等のassetの追加
　import logo from './logo.png';
　とするとlogoにはバンドル後のパス文字列が入る。これにもハッシュ値が付与される。
　<img src={logo}/>で使用可能となる
　css側でも
　background: url(./logo.png);
　とかで同じような感じになる。