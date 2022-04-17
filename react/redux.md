# Redux
Reactとかのstate管理をやってくれるフレームワーク。  
規模の大きいアプリとかだと一旦導入すればstate管理がすごい楽かもだけど、規模がそこまで大きくなければ面倒くさいのが勝っちゃうかも。。。

- ツールキットについて  
  - reducerのstateがネストしてる時に書き方楽に寝るみたい
  - 他にもstoreのセットアップが楽になったりする  
  configureStore,createSlice,createAsyncThunk,createEntityAdapterとある
  ツールキットはとりあえずこんな感じでとらえておけばおｋ？  
  →何回も書くようなファイル(ボイラープレート)がだいぶ省略できそうで便利そう。こんど使ってみるかな

## 構成について
- re-ducksパターン？？  
storeのディレクトリ構成として、  
src下に、action,reducer...のようにだけしたがボリュームが大きくなると大変なので、機能毎にファイルを分けて、action,reducer...の中身を分別したのがducksパターン(moduleﾌｫﾙﾀﾞ下にtodoSlice.js,filterSlice.jsみたいな)  
しかしこれも規模が大きくなるとつらいので、さらに機能別ファイル(slice)をさらに分割して関数の種類ごと(action,reducer,operation,selector,type)
にすることになる(todosSlice.js,filterSlice.jsがあるならtodosフォルダー、filterフォルダを作りその中にaction.js、reducer.js…な感じ)
- オペレーション、セレクタ―  
副作用(非同期処理とか)含むactionがオペレーション、stateのどれ読み出すか選択がセレクターみたいな感じ

- redux関係の設計について　actionタイプ、関数名の命名しっかりしないとあとからめんどくさい
  - アプリの主な機能として追跡したいstateを定義して初期stateを設計  
  最初にアプリのワイヤーフレームを作ってviewから必要なstateを検討するといいかも
  ```javascript
  initialState = {todos: {...}, filters: {...}}
  ```
  - stateの各プロパティについてのactionを設計する
  ```javascript
  {type: "TODOS/TODOADDED", payload: todoText}
  {type: "FILTERS/FILTER_CHANGED", payload: filter}
  ```
  typeは `'stateのプロパティ'/'具体的なアクション名'`とし、
  具体的なアクション名は、このオブジェクトを返すアクションクリエイターと同じくし、
  "システムが行う事"ではなく"外の世界で実際に起こったこと"から命名する  
  例)コメントの投稿
  `×CREATE_COMMENT  → 〇POST_COMMENT`  
  尚、アクションクリエイターの関数名は末尾にActionをつけるといいかも
  - 各actionに対するreducerを設計する
  ```javascript
  function todosReducer(state, action){}
  function filtersReducer(state, action){}
  ```
  関数名は`'stateのプロパティ'+Reducer`となる
  これらreducerはstore.jsとかでcombineされる
  - selectorを設計する(必要に応じて？createSelector見て考える)
  関数名は`select+'選択したいstate'`　かな
  - operation
  関数名はactionと同じ法則でつけていいと思う。末尾のActionは無しで
  また第一引数にはdispatch、第二引数にはgetStateが割り当てられ、storeを参照できる
  ```javascript
  export const fetchProducts = () => {
    return async (dispatch, getState) =>{

    }
  }
  ```
  この中で例えばAPIからデータを拾ってきてそのデータをdispatchしたいときは
  のaction名は `operationの関数名 + Action` とかがいいかも


## redux各フック
以下フックをコンポーネントで使うにはコンポーネントを`<Provider store={store}></Provider>`で囲う
- useDispatch  
reactコンポーネント内で`store.dispatch`が使えるようにする
- useSelector  
reactコンポーネント内でstoreの値を選択して取り出すとともに、`store.subscribe`みたいなことをしてくれる
…actionがdispatchされる度にselectorを呼出し、結果が前回と異なれば該当コンポーネントの再レンダリング
を行うが、、、厳密な比較演算===なのでdispatch時、値は同じでも新しい配列とかになると前回と違う参照として判定してしまう
これの対策として他のコンポーネントから変更される可能性のあるstateは直接selectorで読み取らずに
そのstateのプロパティにID等のプリミティブ型を持たせ、それを読み取り、コンポーネント内で使用すれば、値のみの比較なので問題ない
しかしそれでもどこかで該当のオブジェクトや配列を読み出さなければならない事が多いと思うので
`useSelector()`の第二引数に`shallowEqual`をわたしてやると、オブジェクトや配列の中の値を比較するようになる。
`createSelector`については
dispatchがあるたびに無駄な再レンダリングは`shallowEqual`で防げるが、インラインで`useselector`に
渡す関数を書いているとき、selector関数の再計算は行われしまう。再計算を防ぎ、なおかつ再レンダリングをも防ぐもの
基本`createSelecotr`使っとけば問題ないが、小規模なら`useSelector`に`shallowEqual`でも可

## storeのメソッドまとめ？
storeのメソッドには以下がある。`createStore`してその戻り値で使うことができるが、
大体フックを呼び出して使うことになる。
- getState()  
storeを介しstateそのものにアクセスできる。普通は`useSelector`使う
- dispatch(action)  
actionをreducerに送ってstateの更新をさせる。普通は`useDispatch`使う
- subscribe(listener)  
dispatch時に一緒に行うリスナーコールバックを登録。あまり使わない。多分middleWare的な感じでOK
- unsubscribe※subscribeの戻り値  
リスナー登録の解除

## 標準的なreduxのパターン
- 非同期処理で例えばAPIでデータ取りに行っている間とかの時はリクエスト状態をstoreに持たせて
値が帰ってきたときとかには都度dispatchしてリクエスト状態を変更してそれに従い読み込み中とかの表示をする。
また、storeに状態を持たせる程のものでもない場合はコンポーネント側にsetStateで状態をセットして、
APIリクエストするdispatch(大体promiseを返すサンク関数をdispatchするので)をawaitで待ち受け、
その間読込中とかinputをdisableにしたりする。
- storeには配列使わないでオブジェクトとか・・・)  
stateの正規化といい、下記の要件がある
  - 各データのコピーが一つだけである
  - IDで直接アイテムを検索できる方法でアイテムを保存する
  - アイテム全体をコピーするのではなくIDによって他のアイテムを参照する  
つまりtodosの場合
```javascript
initialState = {
  entities: {
    ...state.entities,
    [todo.id]: {newTodo},    
  }
}
```
みたいな感じで配列でエンティティを保持せずにオブジェクトでキーがIDになるように保存することとなる。  
これのtodosを取り出すセレクタ―は
```javascript
const selectTodos = createSelector(
  state => state.entities,
  entities => Object.values(entities) //オブジェクトの値をfor...inのように展開できる
)
```
となる
- reduxのstoreでrouteを管理？？  
connected-react-routerつかったらできた。ただしver.4じゃないと挙動おかしい(笑)
→storeでrouteの管理ができるようになる。
これがないと`<Link path="hoge"/>`とか書く必要があるはずだが、
storeで管理しているので`dispatch(push('/path'));`
のような感じで関数的に書くことができる。
- コンテナのcompose  
引数に渡された複数の関数を右から左に順に合成する。渡される関数は各々一つだけ引数を受取ることができ
その戻り値は左の関数の引数となる。そもそもクラスコンポーネントにすることあまりないと思う
