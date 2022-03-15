# Firebase

## firebase導入方法ざっくり

hint: web(react)開発時の使いかたをメインにメモしてるけど、expoとかreactnativeのプロジェクトでもほぼ同じような感じで使える。所々expoならこうするとかメモしてあるよ！**但しなぜかtsではうまく動作してくれなかった(initializeAppしようとすると cant find valiable IDBindexみたいな感じにメッセージ出てた)**
基本はfirebaseコンソールでの設定→プロジェクトへ構成設定張り付け→initializeAppして各種のサービスを使うイメージ

### firebaseコンソールでの作業
以下予め、アカウント作成、支払い方法設定とかしている前提での手順

- ブラウザ上でfirebaseコンソールを開いて、トップにある**プロジェクトを追加**をクリックして表示される手順通りに情報入力してプロジェクトを作成する。
- 作成したfirebaseプロジェクトについて追加するWEBアプリ等を設定する。firebaseコンソールで作成したプロジェクトを選択後、追加する種類の**アプリを追加**で表示される手順通りでOK。ホスティングを設定するのであればここで指定することもできる。この時点で、アプリを作成させておく必要はなく、あとでアプリ側からこのfirebaseプロジェクトへアクセスするようなイメージとなる。
- "プロジェクトの設定"からリソースロケーションを設定する
  - **asia-northeast1**のリージョンにしておけばよい。**一回設定すると変更不可のはずなので注意**
- プロジェクトに、FirestoreDatabaseを作成しする。ナビゲーションに表示されているFirestoreDatabaseをクリックして表示される手順通りでOK。本番環境でOK。
- その他、使いたいものはナビゲーションに表示されるメニューからアプリに追加していき、コーディングする感じになるはず。

hint: **ReactもReactNative(expo)もwebアプリの追加**でOKなはず。どちらもmodular javascript SDKを使用するみたいなので同じくWEB向けのドキュメントを見ればよさそう。ただし両環境により使えるサービスに違いがあるみたい

### PC上コンソールからの作業
- `$ npm install -g firebase-tools`  
これをインストールするとfirebaseのCLIが使えるようになる
- `$ npm install -s firebase` またはexpoなら`$ expo install firebase`  
アプリでfirebaseを使う為にこのパッケージをインストールしておく。firebaseをimportして`storage`やら`database`やらが使えるよになる
- アプリのディレクトリから `$ firebase login` を行い作成したプロジェクトにログインする。アカウントにログイン後、先にfirebaseコンソールで作成したプロジェクトが選択できるはず。
- `$ firebase init` で初期化を行う  

  hint: **この初期化は各種のルールとか(firestore.rules等)functions,hosting等のローカルからデプロイが必要な場合行う。expo使ったりとかデプロイいらない場合は初期化しなくてもOK**

    - 使用サービスをスペースキーで選択する。firestoreとかfunctionsとかhostingとかstorageとか選べる。
    - 使用するプロジェクトを選択する。既存のプロジェクトや新規プロジェクトとか選べる。hostingの選択ではホストするディレクトリを選択するので、`build`ディレクトリを選択しておく。あとはほとんどデフォルト。ここでいろんなディレクトリとか設定ファイルが作成される。
    - initが終わると新しいフォルダやファイルができている。
      - functionsフォルダはサーバー側での処理を記述するやつ
      - firestore.rules,storage.rulesはfirestoreやstorageとかのパーミッションを指定するもの。**変更したら**`$ firestore deploy`**する必要あり**。rulesはブラウザ上firebaseコンソールで設定することも可能
      - firebase.jsonでデプロイするファイルの設定とかが記述してある
- `$ npm run build` してから `$ firebase deploy`をするとhostやらrulesなんやらがfirebaseへデプロイされる。**この後はアプリ作ればbuildしてdeploy、rules変えたりしてもdeployする必要あり。**
- `$ firebase deploy`について
以下ルールのみ、とか項目選択してデプロイするオプションあり  
  - `--only hosting`
  - `--only database`
  - `--only storage`
  - `--only firestore`
  - `--only firestore:rules`
  - `--only firestore:indexes`
  - `--only functions`

---

## firebaseを使うための下準備
- src>firebase>config.js  
  firebaseの設定オブジェクトを入れておくファイル。APIkeyとか入ってるやつ。
  該当のプロジェクトをfirebaseコンソールで開いて、プロジェクトの設定→Firebase SDK Snippet(SDKの設定と構成)→構成 から`const firebaseConfig = { apiKey: xxxxxx, ... } `を丸コピーしてこのファイルに張り付けている。
  ```javascript
  export const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  }
  ```
- src>firebase>index.js  
  上のconfig.jsの構成を読み込んでfirebaseの初期化したり、使用するFirebaseサービスを読込んで使いやすくエクスポートしたりする。あとは他のコンポーネントにおいて、ここでエクスポートしたdbだとかstorageだとかをインポートして使用する。

  **version8までの書き方**
    ```javascript
  // firebaseの各サービスを使うためのインポート
  // import firebase from 'firebase/app';
  import firebase from 'firebase/app';
  import 'firebase/auth';
  import 'firebase/firestore';
  import 'firebase/storage';
  import 'firebase/functions';
  import {firebaseConfig} from './config';

  // firebaseの設定ファイルをもとにこのfirebaseの初期化を行って、
  // このアプリでfirebaseを使えるようにする
  firebase.initializeApp(firebaseConfig);

  // エントリポイントとしてexportするもの
  // ここで一括しておけば他で使うとき楽
  // auth     : 認証関係で使う
  // db       : データベース格納
  // storage  : ファイル関係格納
  // functions: サーバー側の処理記述する？
  // FirebaseTimestamp: サーバーからタイムスタンプを取得する。このタイムスタンプを
  // データベースのフィールドにセットしておいて、データのソートをしたりする。
  export const auth = firebase.auth();
  export const db = firebase.firestore();
  export const storage = firebase.storage();
  export const functions = firebase.functions();
  export const FirebaseTimestamp = firebase.firestore.Timestamp;
  ```

  **version9の書き方**
  ```javascript
  import { initializeApp } from "firebase/app"
  import { getAuth } from "firebase/auth"
  import { getFirestore } from "firebase/firestore"
  import { getStorage } from "firebase/storage"
  import { firebaseConfig } from "./config"

  const firebaseApp = initializeApp(firebaseConfig);

  export const auth = getAuth();
  export const db = getFirestore();
  export const storage = getStorage();

  ```


## auth(firebase.auth)のユーザー認証等の各メソッドについて
- まずはfirebaseコンソールから、signin方法を選択して有効にする。
  動画ではこの後にconfig.jsへ設定コピーしていたがいつでもいいと思う
- `auth.createUserWithEmailAndPassword(email, password).then(result => {})`  
  →メールアドレスとパスワードでユーザーアカウントを作成する。resultにはuser情報とかが入っているオブジェクトが入る。作成に成功したら、dbにもresult.user.uidをidとするドキュメントを登録するとよい。作成したユーザーを記録しておき、必要に応じて使えるよ
- `auth.signInWithEmailAndPassword(email, password).then(result => {})`  
  →メールアドレスとパスワードでログインする。resultにはuser情報とかが入っているオブジェクトが入る。
- `auth.signOut().then(() => {})`
  →ログアウトを行う。
- `auth.onAuthStateChanged(user => {})`  
  →現在のログイン状態を確認できる。userにはユーザー情報が入りuser.uidがユーザーIDとなる。rulesでのresource.auth.uidとかと一緒のはず？
  
---

## db(firebase.firestore)の構造
dbにアクセスするときは**collection**,**document**,**data**の三つの要素が出てくる。下の画像のようなイメージをとらえておくと良い。
![画像](structure-data.png)
- collection  
  各種のdocumentのコンテナとなる。  
  例)usersコレクションを作っておいてサービスに登録しているユーザーの情報を管理したり、messageコレクションを作って、サービス上にユーザーの投稿したメッセージデータを保存したりする。  
  `collection(db, 'collection')`の戻り値でコレクションへの参照を取得できる
- document  
  各種のデータを格納する。各documentはIDで識別される。  
  `doc(db, 'collection', 'document')`の戻り値でドキュメントへの参照を取得できる
- data  
  実際のデータ。同じdocument内にはいっているdataは構造が同じものになる。  
  例)実際にユーザーのIDとか、メールアドレスとかユーザーの情報を入れておく


---

## まずはdbのデータ構造の設計をしっかりと
→reduxのように！DBで保存したい項目(コレクション)をリストアップして予めしっかり設計しておくこと。これ考えておかないとあとから手戻り必須なので  
例えば
```
  category
  product
  user
    └cart
    └orders
```
みたいな。エクセルとかで書いておくといいかも

---

## db(firebase.firestore)のメソッド色々
### データの追加
- `const id = db.collection('todos').doc()`  
→対象コレクションの新しいドキュメントにセットするIDを取得できる  
これをやらずに次の`set()`をやってもID自動採番されるけど、アプリ側で他にもID使いたい処理が多いのでこれだと楽にできる
- `await db.collection('todos').doc(id).set(initTodo).catch(e => { throw new Error(e) });`  
→firestore上のtodosコレクションのid指定したドキュメントにinitTodoを登録する  
`set()`の第二引数に`{marge: true}`というオブジェクトをつけることができる。
これは元のドキュメントとのmargeをするということになる
### データの更新
- `db.collection('todos').doc(id).update(sendTodo)`  
→firestore上のtodosコレクションのid指定したドキュメントにsendTodoを更新する  
### データの削除
- `db.collection('todos').doc(id).delete()`  
→firestore上のtodosコレクションのid指定したドキュメントを削除する  
### トランザクション処理
  ```javascript
  const batch = db.batch();
  batch.update(
    todosRef.doc(id),{text: "test"}
  );
  batch.delete(
    todosRef.doc(id);
  );
  batch.update(
    todosRef.doc(id),{text: "test"}, {marge: true}
  );
  batch.commit().then(() => {
    ...
  }).catch(() => {
    throw new Error("batch error")
  });
  ```
  一つ以上のfirestoreへのバッチ書き込み処理(読み取りは別)を行う。最初に作った`batch`へ.`batch.update(書き込みしたいドキュメント, {書き込むデータ}, {marge: true})`または`batch.delete(削除したいドキュメント)`としてどんどん書いていく。`batch.update()`は複数回書いてもOK。`batch.commit()`時に実際に書き込み処理をまとめて行い、一つでも失敗した場合は全ての`batch.update`に記述したdb書き込みの処理をロールバックし、成功した場合は`batch.then(()=>{ })`の処理を行う。`{marge:true}`はセットの時と同じような使い方になる
### データの取得
### データを選択して取得
- `db.collection('todos').orderBy('timestamp', 'asc').get()`  
→firestore上のtodosコレクションからtimestampのフィールドについて、ascなら昇順、descなら降順でドキュメントを取得する
- `db.collection('todos').orderBy('timestamp', 'asc).where('color', '==', color)`  
orderByしたものから更に'color'フィールドにcolorという変数値が入っているもののみ取り出す。`where`の第一引数はドキュメントのフィールドを文字列指定し、第二引数は比較演算子を文字列指定？し、第三引数は比較する値を入れる。    
尚、これは**複合クエリ**といい、firestore.indexes.jsonを修正/デプロイしないとこの複合クエリは使用できない。めんどくさければ**クエリを投げた時にでるエラーメッセージをクリックすると勝手にコンソールに飛び、複合インデックスを作成してくれる。**ちなみにfirestore.rules側で `allow read: if resource.data.xxx == 'hoge' `のような感じならばクエリも`where('xxx', '==', hoge)`のようにならなければパーミッションエラーとなる。ルールに合わせること
### データを並べ替えて取得
### データを制限して取得
### データの変更を検知する
  ```javascript
  const unsubscribe = db.collection('todos').onSnapshot(snapshots => {
      snapshots.docChagnges().forEach(change=>{
          const data = change.doc.data();
          const changeType = change.type;
          // added, modified, removedの値をとる
      })
  })
  ```
  →firestore上のtodosコレクションの変化をリッスンする事ができるようになる  
  changeTypeの値を用いて処理を分岐する。db上の値が確実に変更された事が分かるのでdb上の値を変更する処理の後、storeを更新したりするときはコレが良いかも  
  dbに`set()`とかを投げて`.then()`とかでも同じかもだけどこの`onsnapshot()`の戻り値`unsubscribe`にはリスナー登録の解除関数が入っているみたいなのでコンポーネントのマウント解除時(useEffectの第一引数コールバックの戻り値)に`return () => unsubscribe()`で呼出すようにすること。コンポーネント呼出すたびにコールバック登録されちゃうので 

- 慣例的に変数の名前は以下のようにすることが多い  
  - `const todosRef = db.collection('todos')`  
    コレクションを変数に入れるときは…Ref
  - `db.collection('todos').doc(id).get().then(snapshots => {...})`  
    なんかのdocを取得したときは引数はsnapshotsに　それをforEachで回す
  - `const query = db.collection('todos').orderBy('update', 'asc')`
    なんかのコレクションを条件付きで変数に入れるときはquery

　　
---

## dbのルール設定
firestore.rulesにdbへのオペレーションを制御するルールを記述できる。  
基本的にはデフォルト状態では全てのドキュメントへのオペレーションはfalseで  
許可するオペレーションを一つ一つ条件付きで許可する形で書く。  
書き方はfirestore.rulesにコメント書いてあるので参照。  
更新したら `$ firebase deploy --only firestore:rules` でデプロイすること  
新しいコレクションを追加したときには忘れずに。。

---

## storageのメソッド色々
```javascript
const uploadTask = storage.ref('images').child(fileName).put(blob);
uploadTask.then( () => {
  uploadTasksnapshot.ref.getDownloadURL().then((downloadURL) => {
    ...
  })
})
```
storage上の/imagesディレクトリに、blob化したファイルを、`fileName`という名前でアップロードしてそのアップロードしたファイルのダウンロード用URLを取得できる

---

## トラハックyoutube実践編で作成していた主な機能まとめ　
- 商品管理
  - 追加  
  ProductEditコンポーネントが呼ばれるとき、  
  `window.location.pathname.split('/product/edit')[1]`に値が入るときにはそれを商品IDと判断してコンポーネントの変数として保存し、`useEffect`にてidが存在すれば既存データの編集として、該当のproductsコレクションからデータを読み込み、コンポーネント単体のステートとして保存しておく。データ読み込みはstoreを更新するわけではないのでオペレーションではなく、コンポーネント側にて`useEffect`内に処理を記述している。idが存在しない場合はこれらをせずに新規データ登録画面として働く。また、この編集データを保存する時には、新規作成でも既存データ編集でも同じオペレーション関数を使うが、idが存在しなければ、オペレーション側で新しいidを採番し、dbに保存する作りになっている。
  - 一覧  
  ProductListコンポーネントが呼ばれるとき
  `window.location.search`変数をチェックして`?gender=`や`?category=`等のクエリが入っていれば  productコレクションにそれらのフィルターを適用したクエリを投げ、なければすべての
  productコレクションを要求する。
  - 削除  
  productList => productCard => MenuIcon と呼ばれるなかで商品IDがpropsとして渡されてくるのでその`props.id`を`delete`するオペレーション関数に渡すだけ。
  - ★編集の項目あたりでurlから商品IDを取得してうんぬんやってた  
  routeの方も正規表現あったりもするのでそれも   
    - `window.location.pathname.split('/detail')[1]` 動画のuseEffectで編集するのやつ  
    →クエリパラーメタで商品を表示するイメージではなく、普通に商品詳細URLを入力する感じで表示したいならこっち。windowオブジェクトはreactでなくても使えるグローバルオブジェクトなので自分で今のpathnameを取得してばらしてやるイメージ  
    - `props.match.params.id.split('/detail')[1]`  
    →react-router使ってるならこれでもいいかも。Routeコンポーネントで設定したpath属性に`detail/:id`としておくと`props.match.params.id`で取得できる上記二つはRouterコンポーネントは`path="/detail/:id"`でexact付きでもOK  
    - `selector.router.location.search.split('?id=')[1]`  
    動画の複合クエリのやつ→クエリパラメータがあるときはこっち。reduxのstoreに入ってるのでselectorで指定して取得してやる。(connected-react-routerを使っていればstoreに入っているはず)`location.pathname`でもとれるけどこっちには直接クエリパラメータが入っているので多少楽かも。Routeコンポーネントは`path="/detail"`でexact付きでもOK。exact付けてもクエリまではみていないみたい
    - `window.location.search`でも取得できると思う  
    →クエリパラメータが複数あるときは上の方法では無理かも？？こっちなら？？

- カート機能
  - 追加  
  productDetailページではルーティングにてURLが`/product/[ID]`にて呼び出される  
  `selector.router.location.pathname`からIDを取り出しコンポーネントマウント時(useEffect)に取り出したID(これは商品IDになる)をもとにproductコレクションから対象IDのデータを取り出し自コンポーネントのstateにセットする。カートに追加するボタンを押すと、自分のstateにセットされている商品IDとかの情報とこのコンポーネント内で選ぶ"サイズ"をオブジェクトにまとめてusersコレクションの、認証(auth)を受けているUIDのドキュメント内の、cartサブコレクションにセット(`db.collection('users).doc(uid).collection('cart').doc().set(addproduct)`)  
  …基本的にはusersコレクション内にカート内の商品を保存するフィールドがあり、そこに追加していくイメージ
  ★HeaderMenuコンポーネントがマウントされると(useEffectが働き)、`db`のusersコレクションの認証(auth)しているUIDドキュメントの、cartサブコレクションに変更があって初めてstoreを更新するようになっている。(`onSnapshot`で)productDetailコンポーネントではdb更新しに行っているけど、storeは更新する処理記述していないのでわかりずらい！注意。ホントは一緒のところに書いたほうが分かりやすいのかもだけどheadermenu内にカートiconがあるので、これがマウントされるとこの処理を記述したいためこうなっている。  
  尚、headermenuアンマウント時にはこのリスナを削除するようになっている。何回もリスナ登録されちゃうので
  - 一覧
  CartListコンポーネントでカートに追加を行うと、store内の`users.cart`の配列が更新されるが、その内容をセレクタで参照して、mapにてCartListItemコンポーネントに展開する流れとなる。  
  storeの`users.cart`は  
  ```
  const productsInCart = getProductsInCart(selector);
  {productsInCart.length > 0 && (
    productsInCart.map(product => <CartListItem product={product} key={product.cartId}/>)
  )}
  ```
  - 削除
  イテラブルに呼び出される`CartListItem`にて`props`としてusersコレクション内にあるcartサブコレクションが 渡されてくるのでそのID情報を用いてcart内のコレクションを削除する  
  `db.collection('users').doc(uid).collection('cart').doc(id).delete();`  
  (usersのuidはstoreの情報から取得する)これはオペレーションにては行わずコンポーネント側にて行っている。


- 注文履歴
  - 追加
  注文の処理として、storeに入っている商品について一つずつ、該当するサイズの在庫があるかどうか`db.collection('products').doc(productId)`を確認、対象サイズの在庫があればバッチ処理として  
    1. `db.collection('products').doc(productId)`の在庫減算処理を`batch.update`に登録  
    2. `db.collection('users').doc(uid).collection('cart').doc(cartId)`の削除を`batch.delete`に登録
    3. `db.collection('users').doc(uid).collection('orders')`を`batch.update`に登録となる
    ここはbatchなので登録した全ての処理が正常に走れば良いが、一個でも失敗すればロールバックして元の状態に戻ることとなる。ストライプで決済処理を行った後にこのbatchを走らせ(`batch.commit`)、登録したdb処理を実行し、その処理の中で一回でも失敗があればcommitは失敗したものとして全てのbatch処理をロールバックする

  - 一覧
  orderHistoryコンポーネントのマウント時に、認証を受けているuidの(`getState.users.uid`)の注文履歴を更新日付昇順で読みだして、storeに追加する。
  `db.collection('users').doc(uid).colletion('orders').orderBy('updated_at', 'desc').get().then(() => {})`

- 検索
  - 性別・カテゴリ
  ドロワーメニューの中にメンズ、レディースのリストボタンがあり、そのボタンをクリックすると
  `/?gender=xxx`または`/?category=xxx`のようなクエリストリングつきのURLへdispatchされる。該当パスではproductListコンポーネントが呼ばれ、そのマウント時に、`db.collection('product')`からまずupdateについて並び替えしたデータに対し`.where`へつなげて
  入力されたクエリのgenderまたはcategoryに合うデータを取り出している

ちなみにチャットボットアプリの方はdbは大した使用していず。
質問＆回答のデータセットを読込むのにつかっているだけ

★未完
updateとset({marge:true}つき)は何が違う？
決済の方法
