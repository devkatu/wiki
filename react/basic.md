# React基礎
ある程度の基礎は理解している前提のもと、コーディングに関する備忘録と、tips的な纏めを書いておく！  
結局コンポーネントにstateがあって、それが変化するとコンポーネントの更新と判断してレンダーが起こり、それをpropsとして受け取っているコンポーネントも更新されるのを理解しておけば概ねいいかな

- インストール、createreactapp
- イミュータブル？
- コンテキストについて

## インストール
- create react app を使用するなら  
  `$ npx create-react-app my-app`  
  `$ cd my-app`  
  `$ npm start`  
  でプロジェクト作成、開発開始できる

  `$ npm run build`  
  で`build`フォルダーが出来上がり、その中にデプロイするものが出来上がる。
- Next.jsも選択肢。使ったらそのうちまとめる

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

- jsxでの
  ```
  <MyButton color="blue" shadowSize={2}>
    Click Me
  </MyButton>
  ```
  のような記述は下のように変換される
  ```javascript
  React.createElement(
    MyButton,
    {color: 'blue', shadowSize: },
    'Click Me'
  )
  ```
```

```


attention: 
・レンダリングの都度コンポーネント関数の呼出しが発生する
　そのためsetstateしてもvalueはその関数の実行中は変化せず
　次にレンダリングが発生したときに変化する
・コンポーネント内で定義した関数やオブジェクト等についても同じく
　コンポーネントの呼び出し毎に異なる参照の関数やオブジェクトが作られる
　その為、useeffectの第二引数とかで関数やオブジェクトをそのままぶち込んでも
　毎回実体が異なるのでusecallbackとかusememoとかしないとダメ



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

★★★メモ！★★★


## フックで使える色々
基本的には下記フックは関数コンポーネントのトップレベルで呼び出すこと。
　useState
　　→クラスコンポーネントでの初期state設定、setState、state読み出しを便利に使える
　　[value, setValue] = useState(initial);
　　とあるときに、valueが初期initialを初期stateとしてvalueに設定し、その更新用関数がsetValueとなる
　　setValue()にはそのまま更新したい値を渡してもいいが、関数を渡すとその関数の引数には更新前のstateが渡される
　　setValue(prev => prev + 1);　みたいな感じ。
　　これは以下のようにuseCallbackでstate更新関数をメモ化するときに使える。
　　useCallback(() => {
      setValue(prev => prev + 1);
　　},[setValue])
　　このsetValueの所をsetValue(value+1)とかにしちゃうとvalueが最初のcallback作ったときの値に固定されてしまう
　　なお、このsetValueは更新前のstateとマージされないのでオブジェクトや配列のセット時は
　　setValue(prev => [...prev, newValue])
　　のようにスプレッドで前回stateを反映すること
クラスコンポーネントのthis.setStateだとマージされる・・・
　useEffect
　　→クラスコンポーネントでのcomponentDidmount,componentWillunmountとかの処理を関数コンポーネントで使える上に一気にかける
　　第一引数は副作用時(副作用のタイミングは第二引数によってきまる)に実行したい処理を書く。第一引数のreturnする値はクリーンアップするためのものであり、
　　componentWillunmount時に実行される
　　第二引数を省略すると、render後に毎回、第一引数の関数を実行
　　第二引数にある値の配列を渡すと、componentDidmount時と、render時に指定されたある値に変化があったとき第一引数の関数を実行
　　第二引数に空の配列[]を渡すと、変化がまったくないものとして考えられるのでcomponentDidmount時にのみ第一引数に渡した関数を実行
　　　→useEffectでコールバックを設定をするときにこれを使うと初回のマウント時のコールバックのみを保持することに注意！
　useCallback
　　→コールバック関数の再計算をせずにすむ
　　一つ目の引数に普通にコンポーネントに渡す感じの関数を書いて、
　　二つ目の引数(配列リテラルで渡す)にはその依存する変数の配列を渡す。
　　二つ目の配列の中身が変化しなければ関数の再計算はせずにキャッシュした関数の戻り値のみを使用する
- useContext





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