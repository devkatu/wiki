# React Native Async Storage

ReactNativeで簡単なデータ保存をしたいならこれ。  
バックエンドの保存として`@react-native-async-storage`を使用するが、そのまま使うとちょこっと使いずらいので`react-native-storage`なるラッパーを使用しているもの。  
詳しくは[ここ](https://github.com/sunnylqm/react-native-storage)を参照

---

## インストール
```
$ npm install react-native-storage
$ npm install @react-native-async-storage/async-storage
```
または
```
$ yarn add react-native-storage
$ yarn add @react-native-async-storage/async-storage
```

---

## 使い方
- まずはstorageのインスタンスを作成する。  
  storage.jsとかで切り出しておいて、`storage`を他ファイルでimportすると良い
  ```javascript
  import Storage from 'react-native-storage';
  import AsyncStorage from '@react-native-async-storage/async-storage';

  const storage = new Storage({
  // 最大容量の設定。デフォルトでは1000
  size: 1000,

  // 使用するstorageを設定。
  // webのlocalstorageでもつかえる
  storageBackend: AsyncStorage, // for web: window.localStorage

  // storageの保存の有効期限。単位はmsecで指定。デフォルトでは１日分
  // nullにしておけば期限切れなしに設定できる
  defaultExpires: 1000 * 3600 * 24,

  // データのキャッシュ設定。デフォルトではtrue
  enableCache: true,

  // データがストレージに見つからなかった場合、または期限切れのデータが見つかった場合、
  // 対応するsyncメソッドが呼び出され、
  // 最新のデータが返されます。
  sync: {
      // we'll talk about the details later.
  }
  });

  export default storage;
  ```
- 簡単なデータの保存
  ```javascript
  import storage from './storage';

  // 一意なkeyを設定して、データを保存する。
  // 読み出す時にもこのkeyを使用して読み出す
  // IDも指定できるみたい？
  storage.save({
    key: 'loginState', // keyにはアンダースコアは使用できない
    data: {
      from: 'some other site',
      userid: 'some userid',
      token: 'some token'
    },

    // expires(有効期限)は省略可能。省略すると初期化時のdefaultExpiresが使われる
    expires: 1000 * 3600
  });
  ```
- データの読出
  ```javascript
  import storage from './storage';

  storage
    .load({
      key: 'loginState',

      // autoSyncがtrueだと、データが見つからないか
      // 期限切れの場合、対応する同期メソッドを呼び出します
      // （デフォルト：true）
      autoSync: true,

      // syncInBackgroundがtrueだと、データの有効期限が切れた場合、
      // syncメソッドを呼び出している間、最初に古いデータを返します。
      // syncInBackgroundがfalseに設定されていて、期限切れのデータがある場合、
      // 新しいデータを待ち、同期が完了した後にのみ戻ります。（デフォルト：true）
      syncInBackground: true,

      // syncメソッドに追加のパラメータを渡す事もできる
      syncParams: {
        extraFetchOptions: {
          // blahblah
        },
        someFlag: true
      }
    })
    .then(ret => {
      // データの読出しに成功したときに呼出される
      console.log(ret.userid);
    })
    .catch(err => {
      // データが見つからない等の例外処理
      console.warn(err.message);
      switch (err.name) {
        case 'NotFoundError':
          // TODO;
          break;
        case 'ExpiredError':
          // TODO
          break;
      }
    });
  ```
- key,IDを使ってデータを保存・読出し  
  keyでデータモデルを指定して、IDで配列のような感じで使うのがいいかも。以下の制約あり
  >「key-id」データサイズは、コンストラクターで渡したサイズパラメーターを超えることはできません。
  デフォルトでは、1001番目のデータが1番目のデータ項目を上書きします。
  次に最初のデータをロードすると、catch（NotFoundError）またはsyncが呼び出されます。
  
  ```javascript
  import storage from './storage';

  var userA = {
    name: 'A',
    age: 20,
    tags: ['geek', 'nerd', 'otaku']
  };

  storage.save({
    key: 'user', // keyにアンダースコアは使用できない
    id: '1001', // idにもアンダースコアは使用できない
    data: userA,
    expires: 1000 * 60
  });

  // load
  storage
    .load({
      key: 'user',
      id: '1001'
    })
    .then(ret => {
      // データ読出し成功時の処理
      console.log(ret.userid);
    })
    .catch(err => {
      // データが見つからない等の例外
      console.warn(err.message);
      switch (err.name) {
        case 'NotFoundError':
          // TODO;
          break;
        case 'ExpiredError':
          // TODO
          break;
      }
    });

  // --------------------------------------------------

  // key-id形式で保存されたデータの、
  // 指定したkeyの配下にある全部の"ID"を取得する
  // keyのみのデータは含まれない
  storage.getIdsForKey('user').then(ids => {
    console.log(ids);
  });

  // key-id形式で保存されたデータの、
  // 指定したkeyの配下にある全部の"データ"を取得する
  // keyのみのデータは含まれない
  storage.getAllDataForKey('user').then(users => {
    console.log(users);
  });

  // key-id形式で保存されたデータの、
  // 指定したkeyの配下にある全部の"データ"を削除する
  // keyのみのデータは削除されない
  storage.clearMapForKey('user');
  ```
- データの削除
  ```javascript
  import storage from './storage';

  // key,またはkey-idを指定して該当するレコードを削除する
  storage.remove({
    key: 'lastPage'
  });
  storage.remove({
    key: 'user',
    id: '1001'
  });

  // 全ての "key-id" データを削除
  // keyのみのデータは削除されない
  storage.clearMap();
  ```
- リモートデータの同期
  storageのコンストラクタ―でsyncメソッドをオブジェクトの関数として渡すか、以下に示す自分で同期処理を記述していく方法で同期を設定することができる。  
  `load`で読み出そうとしたデータが存在しないときに`storage.sync.hoge`が呼出されるみたい。`hoge`の部分は指定した`key`になるのでデータのキー名に対応させること。
  ```javascript
  import storage from './storage';

  storage.sync = {
    // 同期メソッドの名前はデータキー名と揃える必要がある
    // そして、渡されたパラメータはオールインワンオブジェクトになります。
    // loadメソッドの時に  
    // syncParams: {
    //   extraFetchOptions: {
    //     // blahblah
    //   },
    //   someFlag: true
    // }
    // と渡した値が入ってくるはず
    // ここで値または約束を返すことができます

    async user(params) {
      let {
        id,
        syncParams: { extraFetchOptions, someFlag }
      } = params;
      const response = await fetch('user/?id=' + id, {
        ...extraFetchOptions
      });
      const responseText = await response.text();
      console.log(`user${id} sync resp: `, responseText);
      const json = JSON.parse(responseText);
      if (json && json.user) {
        storage.save({
          key: 'user',
          id,
          data: json.user
        });
        if (someFlag) {
          // do something for some custom flag
        }
        // return required data when succeed
        return json.user;
      } else {
        // throw error when failed
        throw new Error(`error syncing user${id}`));
      }
    }
  };
  ```
- バッチダウンロード  
  指定した各キーのsyncメソッドを呼出し、リモートからデータを纏めてダウンロードする。
  ```javascript
  // `storage.load`に使用するのと同じパラメータを配列として渡して、バッチデータをロードします。
  // 各キーのsyncメソッドを呼び出し、すべてが完了すると、順序付けられた配列のすべてのデータを返します。
  // 同期メソッドはsyncInBackground設定に従って動作します:(デフォルトtrue）
  // true（デフォルト）に設定すると、タイムアウトすると現在の値が返されます
  // falseに設定すると、syncメソッドが完了するまで待機します

  storage.getBatchData([
    { key: 'loginState' },
    { key: 'checkPoint', syncInBackground: false },
    { key: 'balance' },
    { key: 'user', id: '1009' }
  ])
  .then(results => {
    results.forEach(result => {
      console.log(result);
    })
  })

  // 指定したキーの、渡したIDの配列のデータを読み出す
  storage.getBatchDataWithIds({
    key: 'user',
    ids: ['1001', '1002', '1003']
  })
  .then( ... )
  ```
- 実用的な奴  
  初回に起動したことを認識する為のフラグを作る。
  ```javascript
  // 初回起動時(storageのkeyがない時)と、isFirstOpenがtrueの時各ストレージの初期値を設定する
  storage.load({ key: "isFirstOpen" })
    .then((data) => {
      if (data === false) {
        // データが設定されているので初回ではないと判断
        console.log("not first open")
      } else {
        // isFirstOpenをtrueに設定する箇所がなければ走らないはずだけど一応
        // isFirstOpenを設定したり初期データをsaveしたりする
        console.log("first open")
        storage.save({ key: "isFirstOpen", data: false })
        storage.save(lists)
      }
    })
    .catch((e) => {
      // 読出しに失敗→何もデータを設定してないので初回起動と判断
      // isFirstOpenを設定したり初期データをsaveしたりする
      console.log(e.message);
      storage.save({ key: "isFirstOpen", data: false })
      storage.save(lists)
    })
  ```