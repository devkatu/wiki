# Firebase

## firebase導入方法ざっくり

hint: web(react)開発時の使いかたをメインにメモしてるけど、expoとかreactnativeのプロジェクトでもほぼ同じような感じで使える。所々expoならこうするとかメモしてあるよ！**但しなぜかtsではうまく動作してくれなかった(initializeAppしようとすると cant find valiable IDBindexみたいな感じにメッセージ出てた)**
基本はfirebaseコンソールでの設定→プロジェクトへ構成設定張り付け→initializeAppして各種のサービスを使うイメージ

### firebaseコンソールでの作業
以下予め、アカウント作成、支払い方法設定とかしている前提での手順

- ブラウザ上でfirebaseコンソールを開いて、トップにある**プロジェクトを追加**をクリックして表示される手順通りに情報入力してプロジェクトを作成する。
- firebaseプロジェクトが作成されたら、このプロジェクト全体に紐付けるWEBアプリ等を設定する。firebaseコンソールで作成したプロジェクトを選択後、追加する種類の**アプリを追加**で表示される手順通りでOK。ホスティングを設定するのであればここで指定することもできる。この時点で、アプリを作成させておく必要はなく、あとでアプリ側からこのfirebaseプロジェクトへアクセスするようなイメージとなる。
- "プロジェクトの設定"からリソースロケーションを設定する(firestore,storageともに共通の設定)
  - **asia-northeast1**のリージョンにしておけばよい。**一回設定すると変更不可のはずなので注意**
- プロジェクトに、FirestoreDatabaseを作成しする。ナビゲーションに表示されているFirestoreDatabaseをクリックして表示される手順通りでOK。**本番環境**でOK。
- Authentication、storageも同様に左側ナビゲーションから、表示される手順通りに追加していく。**本番環境**で
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
  version9ではタイムスタンプは個別にインポートできるので必要な箇所で直接importする。そして公式では`firebase.firestore.Timestamp.now()`ではなく`firebase.firestore.FieldValue?.serverTimestamp()`の方が推奨みたい
  ```javascript
  import { initializeApp } from "firebase/app"
  import { getAuth } from "firebase/auth"
  import { getFirestore } from "firebase/firestore"
  import { getStorage } from "firebase/storage"
  import { firebaseConfig } from "./config"

  const firebaseApp = initializeApp(firebaseConfig);

  // 各getXxxxxに渡すfirebaseAppは必要か？
  // ドキュメントによってなかったりする。APIリファレンスでは必要っぽい
  // たしか渡さなくても動く気がする
  export const auth = getAuth(firebaseApp);
  export const db = getFirestore(firebaseApp);
  export const storage = getStorage(firebaseApp);

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
dbにアクセスするときは**collection**,**document**,**data**の三つの要素が出てくる。画像のようなイメージをとらえておくと良い。

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

![画像](structure-data.png)



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
### コレクション、ドキュメントの参照の取得
コレクション、ドキュメントに対して色々処理したいときに、各々の参照を使いまわしたいときがある。
以下の方法で参照を取得して使いまわすことができる。
```javascript
import { collection, doc } from 'firebase/firestore';
import { db } from './firebase';

// documentへの参照
// usersコレクションのdoc(doc2)ドキュメントへの参照を取得できる
const docRef = doc(db, 'users', 'doc');
const doc2Ref = doc(db, 'users/doc2');

// doc()は、collectionへの参照を渡すと、
// 新しくドキュメントのIDを採番したドキュメント参照を返す
// setDocでよく使うと思う
const docRef3 = doc(colRef);

// collectionへの参照
// usersコレクションの参照を取得できる
const colRef = collection(db, 'users');
```

### データの書込み <small>設定・追加・更新</small>
以下、asyncメソッドが殆どなので、`await`して、`try`と`catch`で例外処理をするのが良いと思う
- `setDoc()`  
  ドキュメントIDを指定したドキュメントの**追加、上書き**
  指定したドキュメントが存在しない場合は新しく作成される
  ```javascript
  import { doc, setDoc} from 'firebase/firestore';
  import { db } from './firebase';

  // citiesコレクション->BJドキュメントに
  // {hoge: "fuga"}オブジェクトを追加
  // 三つ目の引数はオプションで{merge: true}を渡すと
  // 元のBJドキュメント内のデータと統合し、オプション無しなら
  // documentがない場合は新しく作成され、documentが既存なら
  // そのdocumentを完全に上書きする
  // 戻り値はPromise<void>
  await setDoc(
    doc(db, 'cities', 'BJ'),
    {hoge: "fuga"},
    {merge: true} // オプション
  );

  // citiesコレクションに追加するドキュメントのIDを
  // doc()にコレクションの参照を渡す事で
  // 新しく自動採番してもらってからドキュメントを追加する。
  // この動作はaddDoc()と完全に同じ
  const newCityRef = doc(collection(db, 'cities'));
  await setDoc(newCityRef, {foo: "bar"});
  ```
- `addDoc()`  
  ドキュメントIDを指定せず、ドキュメントを**追加**(IDは自動で採番)
  ```javascript
  import { addDoc, collection } from 'firebase/firestore';
  import { db } from './firebase';

  // citiesコレクションに新しいIDを指定せずに
  // {hoge:"fuga"}のデータを書き込む
  // 戻り値には書き込んだドキュメントへの参照が含まれ
  // そのidプロパティには新しく採番されたidが書き込まれる
  // この動作はdoc(colRef)でID自動採番してからsetDoc()するのと全く同じ
  const docRef = await addDodc(
    collection(db, 'cities'),
    {hoge: "fuga"}
  )
  console.log("document written with id:", docRef.id)

  ```
- `updateDoc()`  
  ドキュメント全体を上書きせずに一部のフィールドを**更新**する。  
  対象のドキュメントが存在しない場合はエラーになる
  ```javascript
  import { doc, updateDoc } from 'firebase/firestore';
  import { db } from './firebase';

  // citiesコレクション内BJドキュメントの
  // hogeフィールドを更新する
  // 戻り値はPromise<void>
  await updateDoc(
    doc(db, 'cities', 'BJ'),
    {
      hoge: "fuga"
    }
  )

  // citiesコレクション内BJドキュメントの
  // fooオブジェクト内barフィールドを更新する
  // この時、{foo: {bar: "bar", hoge: "fuga"}}とあった場合
  // 更新するデータに{foo: {bar: "baz"}}としてしまうと、
  // hogeフィールドは消えてしまうので下記ドット記法を用いる。
  await updateDoc(
    doc(db, 'cities','BJ'),
    {
      "foo.bar": "baz"
    }
  )
  ```

  hint: mergeオプション付きの`setDoc`との違いは次の例で  
  
  次のデータがクラウドにあるとする
  ```javascript
  {
    users: {
      user1: "hoge",
      user2: "fuga"
    },
    foo: "bar"
  }
  ```
  ここに次mergeオプションつきの`setDoc()`を行う
  ```javascript
  setDoc(db, {
    users:{
      user3: "hoge"
    },
    {merge: true}
  })
  ```
  すると
  ```javascript
  {
    users: {
      user1: "hoge",
      user2: "fuga",
      user3: "hoge"
    },
    foo: "bar"
  }
  ```
  次の`updateDoc()`を同じイメージで行う
  ```javascript
  updateDoc(db,{
    users: {
      user3: "hoge"
    }
  })
  ```
  すると
  ```javascript
  {
    users: {
      user3: "hoge"
    },
    foo: "bar"
  }
  ```
  と、fooのフィールドは関係ないのでそのままだが、usersの**フィールドが更新**される。
  usersのフィールドをそのまま残して更新を掛けたいときは、  **ドット記法を使って**
  ```javascript
  updateDoc(db,{
    "users.user3": "hoge"
  })
  ```
  とすると良い。`setDoc()`の`{merge: true`と同じ挙動となる。
  フィールドがネストしているところの更新を掛けたいときはこの違いを理解しておくこと  
  merge付きの`setDoc()`の方が使いやすそう・・・
- `serverTimestamp`  
  サーバーのタイムスタンプを取得する。`set`や`update`するデータのフィールドの一つとして渡してあげると読みだすときの並べ替え等に使える。
  ```javascript
  import { updateDoc, serverTimestamp } from 'firebase/firestore';

  // serverTimestampを実行して更新メソッドに渡してあげる
  const updateTimestamp = await updateDoc(docRef, {
    timestamp: serverTimestamp()
  });

  ```
- `increment`
  document内の数値フィールドを増減する。
  ```javascript
  import { doc, updateDoc, increment } from "firebase/firestore";
  import { db } from "./firebase";

  const washingtonRef = doc(db, "cities", "DC");

  // 引数で指定した値だけ、数値フィールドを増減する
  // populationフィールドの値を50インクリメントする
  await updateDoc(washingtonRef, {
      population: increment(50)
  });

  ```
- `writeBatch`  
  ドキュメントに対して一連の書き込みを行う。バッチ書込みに操作したい処理を登録していき、最後に書込みを行うが、途中で書込処理が失敗したりするとバッチに登録した書込みを処理を全てキャンセルしてロールバックする。  
  読取処理も一連の動作に含めたいときはバッチではなくトランザクションというものが用意されている。が省略
  ```javascript
  import { writeBatch, doc } from "firebase/firestore";
  import { db } from "./firebase";

  // バッチ書込み処理を登録するオブジェクトを取得
  // このbatchのset、update、deleteに処理を登録していく
  const batch = writeBatch(db);

  // ここからバッチへの登録
  const nycRef = doc(db, "cities", "NYC");
  batch.set(nycRef, {name: "New York City"});

  const sfRef = doc(db, "cities", "SF");
  batch.update(sfRef, {"population": 1000000});

  const laRef = doc(db, "cities", "LA");
  batch.delete(laRef);

  // コミットにて一連の処理を実行する
  // 一連の処理の途中で失敗したら全ての処理を無かったことにする
  await batch.commit();
  ```

### データの読取 <small>読出・選択・並替・制限・データ変更検知</small>
- `getDoc` と `getDocs`  
  単一ドキュメントを丸ごと、または単一コレクション内のすべてのドキュメントを取得する  
  それぞれドキュメント、コレクションを引数に渡す
  ```javascript
  import { collection, doc, getDoc, getDocs } from "firebase/firestore";
  import { db } from "./firebase";

  // citiesコレクションのSFドキュメントを取得
  const docRef = doc(db, "cities", "SF");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // ドキュメントが存在すれば、data()で読みだすことができる
    console.log("Document data:", docSnap.data());
  } else {
    // ドキュメントがないとき、docSnap.data()は未定義になる
    console.log("No such document!");
  }

  // citiesコレクションの全てのドキュメントを取得する(配列で帰ってくる)
  // getDocs(複数形)だよ！！
  const querySnapshot = await getDocs(collection(db, "cities"));
  querySnapshot.forEach((doc) => {
    // こっちではdoc.data()が未定義になることはないみたい
    console.log(doc.id, " => ", doc.data());
  });
  ```
- `where`  
  コレクションから、条件を指定した上で複数のドキュメントを取得する。  
  一つ目の引数にフィルタするフィールド、  
  二つ目の引数に比較演算子、(jsで使う演算子+α次項参照)  
  三つ目の引数に値を渡す。  
  このwhere句は`query`で問い合わせるクエリオブジェクトを作る際に引数として渡す。  
  ⇒`query`に渡した引数の順に処理がされる様子。  
  実際にクエリが投げられるのは`getDocs()`するタイミングとなる。
  ```javascript
  import { collection, query, where, getDocs } from "firebase/firestore";
  import { db } from "./firebase";

  // citiesコレクションからcapitalフィールドがtrueのドキュメントを取得するクエリを作成
  const q = query(collection(db, "cities"), where("capital", "==", true));

  // クエリをgetdocsに渡すとドキュメントの配列が帰ってくる
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() が未定義になることはないらしい
    console.log(doc.id, " => ", doc.data());
  });
  ```
  `query`に複数の`where`等を渡すこともできる(**複合クエリ**)。 複合クエリは、一度のクエリで複数のフィールドに対する不当演算(<、<=、>、>=、!=)はできないみたい  
  ```javascript
  // この二つはOK
  // stateだけなら不当演算複数OK
  const q1 = query(citiesRef, where("state", ">=", "CA"), where("state", "<=", "IN"));
  const q2 = query(citiesRef, where("state", "==", "CA"), where("population", ">", 1000000));

  // これはNG
  // state populationに対して不当演算してる
  const q3 = query(citiesRef, where("state", ">=", "CA"), where("population", ">", 100000));
  ```
   **また、複合インデックスが必要になる。(ただしインデックスはテストするとき実際にクエリを投げればエラーが出力するのでそのエラーメッセージから直接作成することもできるのであまり気にしなくてもOK)**  
  自分でやるなら、firestore.indexes.jsonを修正/デプロイするらしい。ちなみにfirestore.rules側で `allow read: if resource.data.xxx == 'hoge' `のような感じならばクエリも`where('xxx', '==', hoge)`のようにならなければパーミッションエラーとなる。ルールに合わせること  
  次の特殊な比較演算子もある
  ```javascript
  import { query, where } from "firebase/firestore";

  // regionsフィールドが、west_coast値を含む配列である、ドキュメントを取得
  // {
  //   regions: [... weat_coast, ...]
  // }
  const q = query(citiesRef, where("regions", "array-contains", "west_coast"));

  // country フィールドが USA または Japan に設定されているすべての city ドキュメントを返す。最大10個まで
  const q = query(citiesRef, where('country', 'in', ['USA', 'Japan']));

  // country フィールドが存在し、そのフィールドが USA、Japan、null に設定されていないすべての city ドキュメントを返す。最大10個まで
  const q = query(citiesRef, where('country', 'not-in', ['USA', 'Japan']));

  // region フィールドが west_coast または east_coastを含む配列であるすべての city ドキュメントを返す。最大10個まで
  const q = query(citiesRef, where('regions', 'array-contains-any', ['west_coast', 'east_coast']));
  ```

- `orderBy` と `limit`  
  コレクションから、複数のドキュメントを取得する際に条件を指定して並べ替え、取得するデータの制限を行う。  `order`で指定したフィールドがないドキュメントはスキップになる。  
  これらも`query`で問い合わせるクエリオブジェクトを作る際に引数として渡した後、`getDocs()`に渡してあげる。⇒`query`に渡した引数の順に処理がされる様子。  
  `limit`を使ってページネーションみたいなこともできる。
  ```javascript
  import { getDocs, query, orderBy, limit } from "firebase/firestore";

  // nameフィールドについて昇順で並べ替えたものを3つ取得する
  const q = query(citiesRef, orderBy("name"), limit(3));

  // orderByに二つ目の引数"desc"を渡すと降順になる
  const q1 = query(citiesRef, orderBy("name", "desc"), limit(3));

  // これもqueryに複数渡せる
  const q2 = query(citiesRef, orderBy("state"), orderBy("population", "desc"), limit(3));

  const querySnap = await getDocs(q);
  ...
  ```
  もちろん`where`と組み合わせるのも可能。ただし`where`したあとの最初の`order`は同じフィールドを指定すること
  ```javascript
  import { query, where, orderBy } from "firebase/firestore";
  
  // OK
  const q = query(citiesRef, where("population", ">", 100000), orderBy("population"));

  // NG　whereとorderの指定するフィールドが異なる
  const q = query(citiesRef, where("population", ">", 100000), orderBy("country"));
  ```
  `limit`を使ってページ分割するには
  ```javascript
  import { collection, query, orderBy, startAfter, limit, getDocs } from "firebase/firestore";
  import { db } from "./firebase";

  // 最初のpopulation順のcitiesドキュメントを取得するクエリを投げる
  const first = query(collection(db, "cities"), orderBy("population"), limit(25));
  const documentSnapshots = await getDocs(first);

  // 最後に見た位置を入れる。stateとかに保存しておけばいいかな
  const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
  console.log("last", lastVisible);

  // 次のページを読みだす処理
  // population順に並べ替え、最後にみた位置より後の、25citiesを取り出すクエリ。
  // 当然ながらstartAfter以外は最初のクエリと一緒にすること
  // startAfterはカーソル句といい(他にもstartAtとかある)
  // プリミティブな値を入れる分にはwhereとあまり変わりないが、
  // documentを渡すと、並べ替え等して取得したドキュメントの内、
  // 渡したdocument以降のドキュメントを取得するようなことが可能になる
  const next = query(collection(db, "cities"),
      orderBy("population"),
      startAfter(lastVisible),
      limit(25));
  const nextDocSnap = await getDocs(next);
  ...
  ```
- `onSnapshot`  
  指定したドキュメントのデータの変更に対するイベントリスナを設定することができる。 
  firestore上のデータが確実に更新されたことがわかるので、firestoreへの書込み処理後に、stateやstoreを更新するならこれを使用するのがいいかも   
  一つ目の引数でリスナを設定するドキュメント、またはクエリオブジェクトを  
  二つ目の引数でイベント発火時のコールバックを渡す 
  三つ目の引数はオプションで、セキュリティ権限がない・または無効なクエリでリッスンしようとしたときなどの失敗時のコールバックを渡す  
  戻り値はリスナーを解除する関数が入る  
  単一のドキュメントに対してのリスナー設定は
  ```javascript
  import { collection, doc, query, where, onSnapshot } from "firebase/firestore";
  import { db } from "./firebase";

  // 単一のドキュメントに対するリスナー設定
  // citiesコレクションのSFドキュメントのデータが変更あればイベント発火
  const unsub = onSnapshot(doc(db, "cities", "SF"), (doc) => {
    // コールバックの引数には該当のドキュメントが入る
    console.log("Current data: ", doc.data());

    // ローカル書込み(まだサーバーに値が書き込まれていない状態)時にも
    // イベント発火し、次のプロパティで判別できる
    const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
  });
  ```
  複数のドキュメントに対するリスナーの設定は
  ```javascript
  // 複数のドキュメントに対するリスナー設定
  // citiesコレクションのstateがCAのドキュメントのデータが変更あればイベント発火
  const q = query(collection(db, "cities"), where("state", "==", "CA"));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    // コールバックの引数には該当する変更があった複数のドキュメントが入る
    const cities = [];
    querySnapshot.forEach((doc) => {
      // 該当するドキュメントのイテレート
      cities.push(doc.data().name);
    });
    console.log("Current cities in CA: ", cities.join(", "));
  });
  ```
  ドキュメントの更新の種類によって処理を分岐させたいときは
  ```javascript
  // snapshotでの変更の種類を検知する
  // added modified removedの各値を取る
  // citiesコレクション中のstateがCAのドキュメントに対して
  // イベントリスナーを設定する
  const q = query(collection(db, "cities"), where("state", "==", "CA"));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    // クエリで抽出したドキュメントに変更あったとき発火
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
          console.log("New city: ", change.doc.data());
      }
      if (change.type === "modified") {
          console.log("Modified city: ", change.doc.data());
      }
      if (change.type === "removed") {
          console.log("Removed city: ", change.doc.data());
      }
    });
  });
  ```
  イベントリスナがいらなくなったとき(大体コンポーネントが削除されたとき)には必ず、リスナーの解除をしておくこと  
  コンポーネントを呼び出す度にコールバックが登録されちゃう
    ```javascript
  const unsub = onSnapshot(...)
  
  unsub();
  ```


### データの削除
- `deleteDoc`  
  firestore上のドキュメントを削除する。    
  ただし**サブコレクションは削除されない**。コンソールから操作して削除しなければならない。同様にコレクション自体を削除するときもコンソールからの操作が必要となる。
  ```javascript
  import { doc, deleteDoc } from "firebase/firestore";
  import { db } from "./firebase";

  // citiesコレクションのDCドキュメントを削除する
  await deleteDoc(doc(db, "cities", "DC"));
  ```
- `deleteField`  
  firestore上のドキュメントの特定のフィールドを削除する。`updateDoc`の値として渡せばOK
  ```javascript
  import { doc, updateDoc, deleteField } from "firebase/firestore";
  import { db } from "./firebase";

  const cityRef = doc(db, 'cities', 'BJ');

  // capitalフィールドを削除する
  await updateDoc(cityRef, {
    capital: deleteField()
  });
  ```

- 慣例的に変数の名前は以下のようにすることが多い  
  - `const todosRef = collection(db, 'todos')`  
    コレクションやドキュメントを変数に入れるときは…Ref
  - 
    ```javascript
    const snapshot = await getDoc(doc(db,'todos','id');
    console.log(snapshot.data())

    const snapshots = await getDocs(collection(db, 'todos'));
    snapshots.forEach(doc => {console.log(doc.data())})
    ```
    なんかのdocを取得したときは引数はsnapshot、またはsnapshotsに　それをforEachで回す

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
画像・音声・動画やらなんやらのファイルを保存できるサービスだよ
storageを使うためには、`firebaseConfig`オブジェクトに、バケットURLを含めておく必要がある。多分デフォルトで設定されてるはずだけど、 `storageBucket`プロパティがあるか確認！ 
### 参照の作成
### ファイルのアップロード
```javascript
const uploadTask = storage.ref('images').child(fileName).put(blob);
uploadTask.then( () => {
  uploadTasksnapshot.ref.getDownloadURL().then((downloadURL) => {
    ...
  })
})
```
storage上の/imagesディレクトリに、blob化したファイルを、`fileName`という名前でアップロードしてそのアップロードしたファイルのダウンロード用URLを取得できる
### ファイルのダウンロード
### ファイルの削除


### storageのルール設定

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
updateとset({merge:true}つき)は何が違う？
決済の方法
