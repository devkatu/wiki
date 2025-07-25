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
- Authentication、storageも同様に左側ナビゲーションから、表示される手順通りに追加していく。**本番環境**でOK。Authenticationについては、使用したいsignin方法を設定しておく。
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
---

## FirebaseEmulator
本番のFirebaseを気にせずにローカルでFirebaseのテストができる。
1. `npx fibase init` で初期化しておく
2. `npx firebase emulators:start` で起動
3. アプリ側からエミュレータに接続する
    ```javascript
    import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

    // initializeApp()済みであること
    const db = getFirestore();
    connectFirestoreEmulator(db, 'localhost', 8080);
    ```  
但し使えない機能もあるみたいなので注意。使ったらまたまとめ記入する

---

## Authentication
`auth`はfirebaseの中で`firebase.auth.getAuth`で取得している。  
**まずはfirebaseコンソールから、メールアドレスを使ったログインとかの、使用したいsignin方法を選択して有効にしておくこと。**  
Firestore、Storageのルール設定において、ログイン済みユーザーの一意のユーザー ID を auth 変数から取得し、認証状態によってアクセスの権限をかけることができる。

### 用語
- フェデレーション  
  一つの認証で、許可されている全てのサービスを使う仕組み。よくあるgoogleでログインとか
- OAuth(Open Authentication)  
  フェデレーションを実現するための技術の一つ  

### 認証の種類
- FirebaseUIなる予め用意されたログイン方法もあり、それを使うと簡単にUIを実装できそう(但しreact-nativeでは無理っぽい)。ここには纏めていない。
- Firebase SDK Authenticationでは、自分でUIを実装してログイン処理を実装付けていく。こちらがメインかも？但しUIは自分で実装するので**入力フォームのバリデーション等しっかり作りこまなければならない**

### Authコンポーネント
自分でカスタムしてつくるコンポーネント。  
 onAuthStateChangeイベントでサインイン状態をへ判定して、随時state等の状態に反映して、サインイン状態によって子要素をレンダリングするか判定する。  
 サインイン状態でなければサインイン画面をレンダリングしたりするのもありかも
```
import React, {useEffect, useState} from 'react';
import { onAuthStateChanged } from 'firebas,e/auth';
import { auth } from './firebase';

const Auth = (props) => {
  
  const [isSignedIn, setIsSignedIn] = useState(false);
  
  useEffect( () => {
    // ログイン状態が変更されたら走るイベントを登録
    onAuthStateChanged(auth, (user) => {
      if(user){
        setIsSignedIn(true)
      }else{
        setIsSignedIn(false)
      }
    })
  },[])

  if(!isSignedIn){
    return <></>
  }else{
    return props.children
  }
}

export default Auth;
```
作成したコンポーネントで認証状態でなければ見られないコンポーネントを囲えばOK
```
function App() {
  return (
    <div className="App">
        <Switch>
          <Route exact path="/SignUp" component={SignUp}/>
          <Route exact path="/SignIn" component={SignIn}/>          
          <Auth>
            <Route exact path="/" component={Todo}/>
            <Route exact path="/detail" component={Detail}/>
            <Route exact path="/a" component={Setting} />
          </Auth>
        </Switch>
    </div>
  );
}
```

### 認証状態イベント
ユーザーのログイン状態に変更があったときに発火するイベント。Authコンポーネントで使うこととなる。
```javascript 
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

// authオブジェクトにログイン状態が変更あったときのイベントを設定する
onAuthStateChanged(auth, (user) => {
  if (user) {
    // ユーザーはログイン状態の時の処理。ここでstateに認証状態であることを保存したりする
    // userのプロパティは
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    // ...
  } else {
    // ユーザーがサインアウト状態の時の処理
    // ここでstateに認証状態で無くなったことを保存したりする
    // ...
  }
});
```

### メールアドレスとパスワードでの認証
Firebaseコンソールでメールアドレスとパスワードによるログインを有効にしておくこと
- アカウント作成
  ```javascript
  import { createUserWithEmailAndPassword } from "firebase/auth";
  import { auth } from "./firebase";

  // アカウントを作成する。email,passwordは各自作ったフォームで取得する
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // ☆Firestoreにもresult.user.uidをidとするドキュメントを登録するとよい。
      // 作成したユーザーを記録しておき、必要に応じて使えるよ
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
  ```
- 作成済みアカウントにログイン
  ```javascript
  import { signInWithEmailAndPassword } from "firebase/auth";
  import { auth } from "./firebase";

  // アカウントにログイン。email,passwordは各自作ったフォームで取得する
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  ```
- ログアウト
  ```javascript
  import { getAuth, signOut } from "firebase/auth";
  import { auth } from "./firebase";

  signOut(auth).then(() => {
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
  ```
- メールアドレスの更新
  ```javascript
  import { getAuth, updateEmail } from "firebase/auth";
  import { auth } from "./firebase";

  updateEmail(auth.currentUser, "user@example.com").then(() => {
    // Email updated!
    // ...
  }).catch((error) => {
    // An error occurred
    // ...
  });
  ```
- パスワードの更新
  ```javascript
  import { getAuth, updatePassword } from "firebase/auth";
  import { auth } from "./firebase";

  const user = auth.currentUser;
  const newPassword = getASecureRandomPassword();

  updatePassword(user, newPassword).then(() => {
    // Update successful.
  }).catch((error) => {
    // An error ocurred
    // ...
  });

  ```
- パスワードのリセットメール送信
  ```javascript
  import { getAuth, sendPasswordResetEmail } from "firebase/auth";
  import { auth } from "./firebase";

  sendPasswordResetEmail(auth, email)
    .then(() => {
      // Password reset email sent!
      // ..
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
  ```
- ユーザー削除
  ```javascript
  import { deleteUser } from "firebase/auth";
  import { auth } from "./firebase";

  const user = auth.currentUser;

  deleteUser(user).then(() => {
    // User deleted.
  }).catch((error) => {
    // An error ocurred
    // ...
  });
  ```


### メールリンク認証
ログイン用のリンクを含むメールをユーザーに返信してログインしてもらう方式。通常パスワードは不要で、有効なメールアドレスがあればログイン可能。(返信メールを見られるのは自分のメールであるので)  
Firebaseコンソールでメールリンクによるログインを有効にしておくこと  
reactnativeだと、メールリンクからアプリへのディープリンクを設定したりしなければならず、Manifestをいじらなきゃだめっぽい。省略

### Googleログイン
ログインできるGoogleアカウントを用いて、ログインを行う。  
GoogleプロバイダのOAuthトークンを取得し、GoogleAPIでそのトークンを使用して追加データをフェッチすることもできる。    
ログイン方法はポップアップ方式とリダイレクト方式がある。  
- まずはポップアップ
  ```javascript
  import { signInWithPopup, signInWithRedirect, GoogleAuthProvider } from "firebase/auth";
  import { auth } from "./firebase";

  // Googleプロバイダオブジェクトのインスタンスを作成
  const provider = new GoogleAuthProvider();

  // オプションでOAuthフローの言語を指定できる。日本語なら'ja'かな？
  auth.languageCode = 'it';
  // ブラウザのデフォルト言語をつかうなら↓
  // firebase.auth().useDeviceLanguage();   // ちがう？
  // auth.useDeviceLanguage();              // こっちかも？？
  // その他にも色々オプションあり

  // ポップアップを表示してログインを促す
  signInWithPopup(auth, provider)
    .then((result) => {
      // これでGoogleアクセストークンが取得できる。ここからGoogleAPIにアクセスすることもできる
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // ログインしたユーザー情報
      const user = result.user;
      // 初回ログインだと新しくユーザー登録がされる。
      // 初回であればFirestoreにresult.user.uidをidとするドキュメントを登録するとよい。
      // 作成したユーザーを記録しておき、必要に応じて使えるよ
      // result.additionalUserInfo.isNewUserで新規さんかわかるみたい
      // ...
    }).catch((error) => {
      // エラー時の処理
      const errorCode = error.code;
      const errorMessage = error.message;
      // ユーザーアカウントのメールアドレス
      const email = error.email;
      // 使用されたcredentialタイプ
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
  ```

- ログインページへリダイレクトさせてログインを促すときはこちら
  ```javascript
  // 以下をsignInWithPopupと置き換える

  // ログインページへリダイレクトしてログインを促す
  // このメソッドはPromise<void>を返す
  signInWithRedirect(auth, provider);

  // 上のsignInWithRedirectをawaitした方がいい？そのまま実行していいのかな
  // Google プロバイダの OAuth トークンを取得することもできます。
  getRedirectResult(auth)
    .then((result) => {
      // これでGoogleアクセストークンが取得できる。ここからGoogleAPIにアクセスすることもできる
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      // ログインしたユーザー情報
      const user = result.user;
    }).catch((error) => {
      // エラー時の処理
      const errorCode = error.code;
      const errorMessage = error.message;
      // ユーザーアカウントのメールアドレス
      const email = error.email;
      // 使用されたcredentialタイプ
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
  ```
- ログアウト
  ```javascript
  import { signOut } from "firebase/auth";
  import { auth } from "./firebase";

  signOut(auth).then(() => {
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
  ```  
---
## Firestore

### db(firebase.firestore)の構造
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

### まずはdbのデータ構造の設計をしっかりと
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

### FireStoreのメソッド色々使用例
`db`はfirebaseの中で`firebase.firestore.getFirestore`で取得している。
手軽に使えるデータベース。

#### コレクション、ドキュメントの参照の取得
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

#### データの書込み <small>設定・追加・更新</small>
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

#### データの読取 <small>読出・選択・並替・制限・データ変更検知</small>
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


#### データの削除
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

### Firestoreのルール設定
firestore.rulesにdbへのオペレーションを制御するルールを記述できる。  
基本的にはデフォルト状態では全てのドキュメントへのオペレーションはfalseで  
許可するオペレーションを一つ一つ条件付きで許可する形で書く。  
ルールの記述は**セキュリティルール**にて  
更新したら `$ firebase deploy --only firestore:rules` でデプロイすること  
新しいコレクションを追加したときには忘れずに。。

---

## Storageのメソッド色々使用例
`storage`はfirebaseの中で`firebase.storage.getStorage`で取得している
storageを使うためには、`firebaseConfig`オブジェクトに、バケットURLを含めておく必要がある。多分デフォルトで設定されてるはずだけど、 `storageBucket`プロパティがあるか確認！   
画像・音声・動画やらなんやらのファイルを保存できるサービスだよ  
### 参照の作成
`firestore`でいうところのコレクション、ドキュメントへの参照のような感じでパスをスラッシュ区切りで指定して、`storage`への参照を取得できる。取得した参照から相対的に階層を移動したり、各種のプロパティが使える。
アップロードするときは、まだアップロードしていないファイルの参照を作成することになるが、作成には問題ない。
```javascript
import { getStorage, ref } from "firebase/storage";
import { storage } from "./firebase";

// 'images'への参照を作成
const imagesRef = ref(storage, 'images');

// 'images/space.jpg'への参照を作成
const spaceRef = ref(storage, 'images/space.jpg');

// parentで'images/space.jpg'から親の'iamges'への参照へ移動
const imagesRef2 = spaceRef.parent;

// rootで最上位の階層へ移動
const rootRef = spaceRef.root;

// fullPathで'images/space.jpg'となる。普通にPC上のファイルパスと思っていい
spaceRef.fullPath;

// nameで'space.jpg'となる。普通にPC上のファイル名と思っていい
spaceRef.name;

// bucketでファイルが実際に保存されるストレージバケットの名前が取得できる
spaceRef.bucket;

// Google Cloud Storage URI を用いて参照を作成する
// ダウンロードに使用できる
const gsReference = ref(storage, 'gs://bucket/images/stars.jpg');

// HTTPS URL を用いて参照を作成する
// ダウンロードに使用できる
// URLでは、文字はURLエスケープされていることに注意してください。
const httpsReference = ref(storage, 'https://firebasestorage.googleapis.com/b/bucket/o/images%20stars.jpg');  

```


### ファイルのアップロード
- `uploadBytes`  
  途中で一時停止したり再開したりできないアップロード
  ```javascript
  import { ref, uploadBytes } from "firebase/storage";

  // ファイル名を含む、任意の階層の参照を作成
  const storageRef = ref(storage, 'images/mountains.jpg');

  // ファイル名被らないようにランダムなファイル名生成する際はこちらを使う
  const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const N = 16;
  const fileName = Array.from(crypto.getRandomValues(new Uint32Array(N))).map((n) => S[n % S.length]).join('')
  const storageRef2 = ref(storage, 'images/' + filename);

  // アップロードする画像ファイルをblobオブジェクトにする。
  // MIMEタイプを指定するが、後でアップロードする際にもオプションで指定できたりするみたい
  let blob = new Blob(imageFile, { type: "image/jpeg" });

  // 'blob'はBlob か File APIで取得してくる
  // 'images/montains.jpg'がアップロードされる
  // storageRef2で'images/'にランダムに名前生成したファイルがアップロードされる
  uploadBytes(storageRef, blob).then((snapshot) => {
    console.log('Uploaded a blob or file!');
  });

  // awaitするならこう
  try{
    const snapshot = await uploadBytes(storageRef, file);
    console.log('upload 完了')
  }catch(e){
    console.log(e)
  }
  ```
- `uploadBytesResumable`  
  途中で一時停止したり再開したり進行状況の確認をできるアップロード
  ```javascript
  import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
  import { storage } from "./firebase";

  const storageRef = ref(storage, 'images/mountains.jpg');

  // 任意のファイルをアップロード
  const uploadTask = uploadBytesResumable(storageRef, file);

  // アップロードの一時停止
  uploadTask.pause();

  // アップロードの再開
  uploadTask.resume();

  // アップロードのキャンセル
  uploadTask.cancel();
  ```
  アップロードの進行状況によってイベントが発生するので、処理を追加できる
  ```javascript
  import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

  const storageRef = ref(storage, 'images/rivers.jpg');

  // アップロードを開始
  // 戻り値のuploadTaskにてアップロードの操作が可能
  const uploadTask = uploadBytesResumable(storageRef, file);

  // uploadTask.onにてオブザーバーを登録
  // 1. 'state_changed' 状態変化毎に呼出し
  // 2. 'Error' 失敗したときに呼出し
  // 3. 'Completion' 正常完了時に呼出し
  uploadTask.on('state_changed',
    (snapshot) => {
      // 進行状況、一時停止、再開などの状態変更イベントを監視する
      // ここではアップロード済みバイト数/合計バイト数でプログレスを管理
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        // アップロード状態によって処理分岐
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
          console.log('Upload is running');
          break;
      }
    },
    (error) => {
      // アップロード失敗時の処理
      // エラーコードの完全なリストは
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/unauthorized':
          // オブジェクトにアクセスする権限がない場合
          break;
        case 'storage/canceled':
          // アップロードをキャンセルした場合
          break;

        // ...

        case 'storage/unknown':
          // 不明なエラー error.serverResponseで調査する
          break;
      }
    },
    () => {
      // アップロード成功時の処理
      // アップロードしたファイルのダウンロードURLの取得
      // URL: https://firebasestorage.googleapis.com/...
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
      });
    }
  );
  ```

### ファイルのダウンロード
- `getDownloadURL`  
  渡したファイル参照のダウンロードするためのURLを取得する。  
  取得したURLに対してajaxすることでOK  
  ver9.5以降ではURLをいちいち取得しなくてもよくなるメソッドが追加されるらしい
  ```javascript
  import { ref, getDownloadURL } from "firebase/storage";
  import { storage } from "./firebase";

  getDownloadURL(ref(storage, 'images/stars.jpg'))
    .then((url) => {
      // `url` が 'images/stars.jpg'をダウンロードするためのURLとなる

      // 直接ダウンロードする
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = (event) => {
        const blob = xhr.response;
      };
      xhr.open('GET', url);
      xhr.send();

      // <img>要素等に直接URL属性として設定してもOK。
      const img = document.getElementById('myimg');
      img.setAttribute('src', url);
    })
    .catch((error) => {
      // エラー時の処理
      // エラーコードの完全なリストは
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/object-not-found':
          // ファイルが存在しない
          break;
        case 'storage/unauthorized':
          // オブジェクトにアクセスする権限がない
          break;
        case 'storage/canceled':
          // アップロードがキャンセルされている
          break;

        // ...

        case 'storage/unknown':
          // 不明なエラー。サーバーレスポンスを確認
          break;
      }
    });
  ```
### リストの取得
クラウドにあるデータのリストを取得する。**これを使用するルールはセキュリティルールのver2が必要らしい**
- `listAll`  
  全てのファイルの一覧を取得する。
  ```javascript
  import { ref, listAll } from "firebase/storage";
  import { storage } from "./firebase";

  // 'files/uid'の既存の参照を作成
  const listRef = ref(storage, 'files/uid');

  // 渡したlistRef以下の全てのアイテム、フォルダーを検索する
  listAll(listRef)
    .then((res) => {
      res.prefixes.forEach((folderRef) => {
        // listRef以下のフォルダーをイテレートできる
        // ここで再帰的にlistAllを行うこともできる
      });
      res.items.forEach((itemRef) => {
        // listRef以下のファイルをイテレートできる
      });
    }).catch((error) => {
      // エラー時の処理
    });
  ```
- `list`  
  リストの結果をページ分割できる。二つ目の引数に
  { maxResults: 結果を取得する制限数 }のオブジェクトを渡すと取得数が制限でき、
  さらに{ pageToken: firstPage.nextPageToken }を追加で渡すと最初に取得した
  リストの続きを取得できる。
  ```javascript
  import { ref, list } from "firebase/storage";
  import { storage } from "./firebase";

  async function pageTokenExample(){
    // 'files/uid'の既存の参照を作成
    const listRef = ref(storage, 'files/uid');

    // 最初の100個のリストをフェッチする
    const firstPage = await list(listRef, { maxResults: 100 });

    // 取得したリストの使い方は
    // processItems(firstPage.items)
    // processPrefixes(firstPage.prefixes)

    // 次のリスト取得したいとき
    // list()の二つ目の引数に{ pageToken: firstPage.nextPageToken }を追加
    if (firstPage.nextPageToken) {
      const secondPage = await list(listRef, {
        maxResults: 100,
        pageToken: firstPage.nextPageToken,
      });
      // processItems(secondPage.items)
      // processPrefixes(secondPage.prefixes)
    }
  }

  ```
### ファイルの削除
ファイルを指定して削除する。
- `deleteObject`  
  ```javascript
  import { ref, deleteObject } from "firebase/storage";
  import { storage } from "./firebase";

  // 'images/desert.jpg'への参照作成
  const desertRef = ref(storage, 'images/desert.jpg');

  // ファイルの削除
  deleteObject(desertRef).then(() => {
    // ファイルの削除成功
  }).catch((error) => {
    // ファイルの削除失敗
  });

  ```


### storageのルール設定
storage.rulesにstorageへのオペレーションを制御するルールを記述できる。  
基本的にはデフォルト状態では全てのドキュメントへのオペレーションはfalseで  
許可するオペレーションを一つ一つ条件付きで許可する形で書く。  
ルールの記述は**セキュリティルール**にて  
更新したら `$ firebase deploy --only storage:rules` でデプロイすること  
新しいパスを追加したときには忘れずに。。

---

## 各セキュリティルールの設定
Firestore(ちょっとルールの構文違うけどRealtimeDatabaseも),Storage上のデータへのセキュリティを設定できる
Firestoreにはfirestore.rules,Storageにはstorage.rulesがルール記述ファイルとして存在し、記述したらデプロイすること。もしくはFirebaseコンソールで直接ブラウザから記述することも可能

### 記述する項目
- `rules_version = '2';`  
  ルールバージョンの指定は2が最新らしい(2022年現在)
- `service <<name>>`  
  ルールを適用するサービスを指定する。  
  Firestoreなら`cloud.firestore`、Storageなら`firebase.storage`
- `match <<path>>`  
  スラッシュ区切りでルールを適用するパスを指定していく
  - トップの`match`ブロックには   
    Firestoreなら`/databases/{database}/documents`  
    Storageなら`/b/{bucket}/o`  
    をお約束で記述。これらは  
    プロジェクト内の Cloud Firestore データベースに、、
    またはプロジェクト内のすべてのバケットに適用されることを示す。
  - トップより下位でルールを適用するパスパターンを宣言する。パスパターンは`request.path`と照合される。  
  パスパターンが**完全一致であればそのルールが適用**され、**部分一致であればネストされているパス**を探しに行く。  
  パスパターンには**ワイルドカード変数**(パスのワイルドカード指定ができる)を`{var}`のように波括弧で囲う事で宣言でき、`match`ブロック内で文字列型の変数として使用できる。`{var=**}`とすると**再帰ワイルドカード変数**となり、設定したパスの下位にある全てのパスと一致する。
  - {}内では指定したパスのルールを記述したり、さらに`match`をネストしていく。ネストされた`match`は親の`match`ブロックからの相対パスとなる。 
- `allow <<methods>> : if <<condition>>`  
  `match`で指定したデータへの操作ルールを設定する。  
  複数のルールが一つのパスに一致し、**いずれかのルールがアクセス権を与えると、その他のルールでアクセス権を拒否しようとしてもアクセス権は付与されたまま**となるので注意。  
  methodsにはデータへの下記のオペレーションを指定する。  
  - `read`  
    下記含む全ての読取リクエスト
    - `get`  
      単一のドキュメントやファイルを対象とした読み取りリクエスト
    - `list`  
      クエリとコレクションを対象とした読み取りリクエスト
  - `write`  
    下記含む全ての書込リクエスト
    - `create`  
      新しいドキュメントやファイルへの書き込み
    - `update`  
      既存のデータベース ドキュメントへの書き込み、またはファイル メタデータの更新
    - `delete`  
      データの削除  

  conditionは条件式が`true`になればアクセス許可が与えられる。conditionを指定せずに`allow <<methods>>;`のみとすると指定してた操作は常に許可されることなる。  
  ここでは`requset`、`resource`や、`match`のパス宣言でワイルドカード変数指定した変数が使用できる。
  - `request`  
    - `request.auth`  
      FirebaseAuthenticationから取得する認証情報。リクエストしたユーザーがログインしていない場合は`null`になる。  
      - `request.auth.uid`  
        リクエストしたユーザーの一意のID。サインアップ時にユーザーIDが決まるはずなのでFirestoreにもデータ登録しておくとルールで使うことができるのでいいかも
      - `request.token`  
    - `request.method`  
      リクエストした`read`、`write`等の操作の種類
    - `request.params`  
      ？？
    - `request.path`  
      対象のリソースのパス
    - `request.resource.data`  
      書込みオペレーションを行うドキュメントの書込み後の状態。該当パスのフィールドに`hoge`があるなら、`request.resource.data.hoge`で指定できるはず。
  - `resource`  
    - `resource.data`  
      指定したドキュメントの現在の全てのフィールドと値。該当パスのフィールドに`hoge`があるなら、`resource.data.hoge`で指定できるはず。

### 以上を踏まえた上でのFirestoreでのルールサンプル
```javascript
rules_version = '2';
service cloud.firestore {
  // プロジェクト内の Cloud Firestore データベースに適用される記述
  match /databases/{database}/documents {

    // ★ドキュメントの指定
    // match /コレクション/ドキュメント{...}
    // のように"ドキュメント"を指定する
    // 直接文字列を指定してもいいし、{xxx}のようなワイルドカード指定もできる
    match /todos/{todosId} {

      // ★if <<condition>>を省略すると常に許可になる
      allow read, write;
      // 以下のようなルール制限がある場合、それに合わせたクエリを投げないと失敗する
      allow read: if resource.data.color == 'none';


      // ★matchをネスト。ここでリクエストが /todos/todo/subcollection/hoge ならここのルールが適用となる。
      // 親matchブロックのルールは適用されない。
      // リクエストが /todos/todo では当然ここのブロックは適用されない
      match /subcollection/{subId}{
        allow read;
      }
      
      // ★ルールが深い階層に適用されるようにするには、再帰ワイルドカード構文{name=**}を使う
      //  この中でのdocument変数の値は対象のドキュメントのパスと一致するものになる
      //  /subcollection/landmark/tower のドキュメントのルールを設定するときには
      //  document変数にはsubcollection/landmark/towerが入っている
      match /subcollection/{document=**}{
        
        // ★ここで読取を拒否しようとしても上のmatchブロックで許可しているので意味なし
        // 一致するパスが複数あり、どこか一個でもアクセス許可が得られるとアクセス可能となる
        allow read: if false;

      }
    }

    match /users/{userId} {
      // ★usersコレクションに含まれている{userId}をIDとするドキュメントと、
      // 認証情報のuid(データ要求しているユーザーのID)が一致する時のみ許可
      // ※request.authへはでーたを要求しているクライアントの認証情報が入る
      allow read, update, delete: if request.auth != null && request.auth.uid == userId;
      
      // ★ログインしていれば許可
      allow create: if request.auth != null;

      // ★ドキュメントに格納されているデータによってもオペレーションを制御できる
      // resource.dataにはすべてのドキュメントに格納されているフィールドが指定でき、中身を参照できる
      // 書込み時にはrequset.resource.dataにはやろうとしているオペレーション後のドキュメント(の状態)
      // を指定できる。
      // ここではusersコレクションの任意のドキュメントのフィールドが(request.)resource.dataとなる
      // ※クエリを投げる場合はfirestore.rulesのread(list)で見ている条件を必ず書かなければならない
      // 以下のような条件があるならクエリは ...where('visibility', '==', visibility)のような感じ
      allow read: if resource.data.visibility == 'public';
      allow update:if request.resorce.data.population > 0 
                    && requset.resource.data.name == resource.data.name;

    }
  }
}
```

### 実用的例
- ログインしてればOK。開発中につかう  
  Firestore
  ```javascript
  service cloud.firestore {
    match /databases/{database}/documents {
      match /{document=**} {
        allow read, write: if request.auth != null;
      }
    }
  }
  ```
  Storage
  ```javascript
  service firebase.storage {
    match /b/{bucket}/o {
      match /{allPaths=**} {
        allow read, write: if request.auth != null;
      }
    }
  }
  ```
- ここから本番用。認証済みコンテンツ所有者のみ  
  {userId}を認証されている人のIDになるようにデータベースを設計しておくこと  
  Firestore
  ```javascript
  service cloud.firestore {
    match /databases/{database}/documents {
      // Allow only authenticated content owners access
      match /some_collection/{userId}/{documents=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId
      }
    }
  }
  ```
  Storage
  ```javascript
  // Grants a user access to a node matching their user ID
  service firebase.storage {
    match /b/{bucket}/o {
      // Files look like: "user/<UID>/path/to/file.txt"
      match /user/{userId}/{allPaths=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
  ```
- 誰でも読取可能。けど書込みは認証済みのコンテンツ所有者  
  Firestore
  ```javascript
  service cloud.firestore {
    match /databases/{database}/documents {
      // Allow public read access, but only content owners can write
      match /some_collection/{document} {
        allow read: if true
        allow create: if request.auth.uid == request.resource.data.author_uid;
        allow update, delete: if request.auth.uid == resource.data.author_uid;
      }
    }
  }
  ```
  Storage
  ```javascript
  service firebase.storage {
    match /b/{bucket}/o {
      // Files look like: "user/<UID>/path/to/file.txt"
      match /user/{userId}/{allPaths=**} {
        allow read;
        allow write: if request.auth.uid == userId;
      }
    }
  }
  ```

---

## 各種テストについて
エミュレーターを`$ firebase emulators:start`で起動できたり、
セキュリティルールについてはブラウザ上でプレイグラウンドなるものを使用してテストできるらしい。  
使ってみたら簡単に書く。

--- 

## トラハックyoutube実践編で作成していた主な機能まとめ(雑記)
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