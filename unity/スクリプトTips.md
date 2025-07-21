# Unity逆引きリファレンス（共通Tips・便利技）

## Webで公開する

- UnityHubで`WebGL Build Support` モジュールをUnityにインストール
- パッケージマネージャで`WebGL Publisher` パッケージをインストール
- ビルド設定でビルドに含めるシーンを追加して、PlatformにWebGLを選択、`Player Settings`を設定してビルドを開始
- `index.html`ファイルが作成されるのでzip化する
- メインメニューから`Publish→WebGL Project`を選択、先ほどのzipファイルを選択してアップロード

## `public`と`SerializeField`

- スクリプトで使う変数は、デバッグ段階では`public`で指定しておくと、ヒエラルキーから簡単に調整できる。最後には`private`にしておくほうが良い。
- `SerializeField`修飾子は`public`同様にインスペクターからその値を変更できるが、`public`とは異なりその値は他のスクリプトから変更することができない。インスペクタから変更できる`private`な変数となる

## 別オブジェクトの`public`変数を取得したり関数を実行

```
private OtherScript otherScript:
void Start(){
  otherScript = GameObject.Find("objectName").GetComponent<OtherScript>(): // 任意の名前のオブジェクトを探し、そのスクリプトを取得
}
void Update() {
  if (otherScript.otherValue = false) {
   // 取得したスクリプトの値がfalseの時の処理
  }
}
```

→オブジェクトを取得し、`取得したオブジェクト.public変数`で参照可能となる

```
// GameManager.cs記述
public void UpdateScore(int ScoreToAdd){ ... }  // publicな関数

----------------------------------------------

// Target.cs側記述
private GameManager gameManager;

void Start() {
  // Game ManagerオブジェクトのコンポーネントGameManagerスクリプトを取得
  gameManager = GameObject.Find("Game Manager").GetComponent<GameManager>();
}

private void OnMouseDown() {
  // GameManagerのUpadateScoreを実行する
  gameManager.UpdateScore(5);
}
```

→オブジェクトを取得し、`取得したオブジェクト.public関数`で実行できる

## Update/LateUpdate/FixedUpdateの違い

- `Awake`  
  `Start`よりも先に呼ばれ、初期化処理の為に用いる。
- `Start`  
  最初の`Update`の前に実行される。
- `⁠Update`
  - 毎フレーム実行され、実行周期は端末の描画速度に依存する。なので`transform`で移動を行うときは、`Time.delataTime`(フレーム間の経過時間)を掛けて使用する。時間の影響を考慮しない場合に使用し、物理演算には向かない。
  - **キーボード等の入力処理は取りこぼしの無いように、`Update`で行う。**
- `⁠LateUpdate`⁠  
`Update`の直後に実行される⁠。カメラの移動はこれで行う。`Update`でキャラを移動させ、**その後にカメラを追従させるようにする為に`LateUpdate`でカメラ移動をするとカメラのカクツキがなくなる。**
- `FixedUpdate` 
  - 一定周期で実行され、端末に依存しないので、時間の影響を考慮する場合に使用
  - **`rigidbody.AddForce`等の物理演算を使うならこの中で使う**
  - `transform.translate`を`FixedUpdate`の中で使うコードもあったが、`Time.deltaTime`と組み合わせれば`Update`の中で使っても同じ

## パスの共通取得

```
Application.persistentDataPath  // セーブデータ
Application.dataPath            // Assetsのパス
```

## 実行中のフラグ管理（ゲームステート）

空のオブジェクトに`GameManager.cs`として下記をアタッチ

ゲームの状態を管理して、状態が変わったときの処理を書いておける

```
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public enum GameState{
	Start,
	Prepare,
	Playing,
	End
}

public class GameManager : MonoBehaviour {

	public static GameManager Instance;

	// 現在の状態
	private GameState currentGameState;


	// 例

	public Text label;
	public Button button;

	void Awake(){
		Instance = this;
		SetCurrentState (GameState.Start);
	}


	// 外からこのメソッドを使って状態を変更
	public void SetCurrentState(GameState state){
		currentGameState = state;
		OnGameStateChanged (currentGameState);
	}

	// 状態が変わったら何をするか
	void OnGameStateChanged(GameState state){
		switch (state) {
		case GameState.Start:
			StartAction ();
			break;
		case GameState.Prepare:
			StartCoroutine (PrepareCoroutine ());
			break;
		case GameState.Playing:
			PlayingAction ();
			break;
		case GameState.End:
			EndAction ();
			break;
		default:
			break;
		}
	}

	// Startになったときの処理
	void StartAction(){
	}

	// Prepareになったときの処理
	IEnumerator PrepareCoroutine(){
		label.text = "3";
		yield return new WaitForSeconds(1);
		label.text = "2";
		yield return new WaitForSeconds(1);
		label.text = "1";
		yield return new WaitForSeconds(1);
		label.text = "";
		SetCurrentState (GameState.Playing);
	}
	// Playingになったときの処理
	void PlayingAction(){
		label.text = "ゲーム中";
	}
	// Endになったときの処理
	void EndAction(){
	}
}
```

他のオブジェクト(例としてスタートボタン)から呼び出し

```
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ButtonEvent : MonoBehaviour {

	public void OnStartButton(){
		GameManager.Instance.SetCurrentState (GameState.Prepare);
	}
}
```

## リソースの手動読み込み（Resources）

```
GameObject prefab = Resources.Load<GameObject>("Enemy");
Instantiate(prefab);
```

## アプリの再起動 / 終了処理

```
Application.Quit();  // アプリ終了
SceneManager.LoadScene(SceneManager.GetActiveScene().name);  // シーン再読み込み
```

## 非同期処理 (StartCoroutine)

非同期的な処理を行いたいときは**コルーチン**を使う。例えば数秒間のカウントを行いたい場合は次の関数を定義し、定義した関数を`StartCoroutine(定義した関数名)` で呼び出す

```
IEnumerator 関数名() {
  // カウント開始前の処理
  yield return WaitForSeconds(止めたい秒数);  // この関数を呼び出し時、このyield returnに到達すると一旦処理を呼び出し元に返す
  // カウントアップ後の処理
}
```

コルーチン側でループ処理にすることも可能。例えばコルーチン内で数秒ごとにオブジェクトを生成したい場合は次の通り

```
IEnumerator 関数名() {
  while(true) {
    yield return WaitForSeconds(止めたい秒数);  // yield returnに到達すると一旦処理を呼び出し元に戻す
    int index = Random.Rnage(0, targets.Count);
    Instantiate(targets.[index]);
  }
}
```

## 一定間隔で処理 - InvokeRepeating()

```
InvokeRepeating("SpawnObject", 2.0f, 1.0f);
```

- 第一引数：呼び出す関数名
- 第二引数：開始までの待機時間（秒）
- 第三引数：繰り返しの間隔（秒）

## Unityでgitを使う

以下手順でgitを使うことが可能

- `edit > project setting > editor` で`Version control` を`Visible Meta Files` に、`Asset Serialization` を`Force Text` にする
- [https://raw.githubusercontent.com/github/gitignore/master/Unity.gitignore](https://raw.githubusercontent.com/github/gitignore/master/Unity.gitignore)のファイルを.gitignoreに設定しておく(Assets,ProjectSettings,UnityPackageManager)のみが管理対象となる

## 条件付きコンパイル(プリプロセッサディレクティブ)

アプリを終了する`Applicatin.Quit()` などは、エディターでのテスト時に使用できないが、`#if`等のプリプロセッサディレクティブを使用することができる

```
public void Exit() {
#if UNITY_EDITOR
  EditorApplication.ExitPlaymode();  // エディターモードの時はこっち
#else
  Application.Quit();  // アプリではこっち
#endif
}
```

## UNITYでシングルトンを使うメリット

下がシングルトン化の例。

`MainManager.Instance.TeamColor` 等でアクセスでき、`GameObject.Find("MainManager")`は不要。

```
public class MainManager : MonoBehaviour
{
    public static MainManager Instance;
    public Color TeamColor;
    // startよりも先に動作する
    private void Awake()
    {
        // シーンの遷移の都度MainManagerインスタンスが作成されるので、作成されたら
        // staticであるMainManagerに実体が入っているか確認し、入っていれば自分自身をDesrtoyして終了する(シングルトン化)
        if (Instance != null)
        {
          Destroy(gameObject);
          return;
        }
        Instance = this;
        DontDestroyOnLoad(gameObject);
    }
}
```

メリットとしては、

- グローバルなアクセス: シングルトンはアプリケーション内のどの場所からでもアクセス可能で、共有データや機能に簡単にアクセスできます。
- 一貫性の維持: シングルトンは特定のオブジェクトがアプリケーション内で一意であることを保証し、データの整合性を維持します。
- シンプルな管理: シングルトンを使用することで、複数のインスタンスを管理する必要がなくなり、コードの管理がシンプルになります。
- リソース管理: アセットマネージャやリソースマネージャとしてのシングルトンを使用することで、リソースの読み込みと解放を一元的に管理できます。
- イベント通知: イベントマネージャとしてのシングルトンを使用することで、異なる部分のコード間でイベント通知を効率的に行うことができます。
- シーン間のデータ共有: シングルトンはシーン間でデータを共有でき、ゲームの進行状況を維持するのに役立ちます。
- シーン遷移時のデータ保持: シーン遷移時にオブジェクトが破棄されないため、シーン間のデータの保持が容易です。
- 簡潔なコード: シングルトンはコード内の冗長なパラメータの渡し合いを減少させ、コードをより簡潔にします。