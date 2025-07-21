# Unityスクリプトまとめ

※ [Ruby's Adventure：2D 入門](https://learn.unity.com/project/ruby-s-2d-rpg-jp?courseId=5f064535edbc2a0bebd43d99) でのスクリプトまとめ


## RubyController(操作する主人公)

```
public class RubyController : MonoBehaviour
{
  public float speed = 3.0f;

  public int maxHealth = 5;

  // 投射物のプレハブ。インスペクタから割り当て
  public GameObject projectilePrefab;

  public AudioClip throwSound;
  public AudioClip hitSound;

  // 現在体力は取得のみ可能とし、変更はChangeHealth関数にて行う。(カプセル化)
  // 誤って他のスクリプトから書き換えないようにする
  public int health { get { return currentHealth; } }
  int currentHealth;

  // 無敵時間設定関係
  public float timeInvincible = 2.0f;
  bool isInvincible;
  float invincibleTimer;

  Rigidbody2D rigidbody2d;
  float horizontal;
  float vertical;

  Animator animator;
  Vector2 lookDirection = new Vector2(1, 0);

  AudioSource audioSource;

  // Start is called before the first frame update
  void Start()
  {
    rigidbody2d = GetComponent<Rigidbody2D>();
    animator = GetComponent<Animator>();

    currentHealth = maxHealth;

    audioSource = GetComponent<AudioSource>();
  }

  // Update is called once per frame
  void Update()
  {
    horizontal = Input.GetAxis("Horizontal");
    vertical = Input.GetAxis("Vertical");

    Vector2 move = new Vector2(horizontal, vertical);

    if (!Mathf.Approximately(move.x, 0.0f) || !Mathf.Approximately(move.y, 0.0f))
    {
      lookDirection.Set(move.x, move.y);
      lookDirection.Normalize();
    }

    // 予めAnimatorウィンドウで各アニメーションの遷移を矢印で指定し、
    // その遷移条件をConditionsに指定しておく
    animator.SetFloat("Look X", lookDirection.x);
    animator.SetFloat("Look Y", lookDirection.y);
    animator.SetFloat("Speed", move.magnitude);

    // 無敵状態になれば(体力減少時)カウントダウン開始
    if (isInvincible)
    {
      invincibleTimer -= Time.deltaTime;
      if (invincibleTimer < 0)
        isInvincible = false;
    }

    if (Input.GetKeyDown(KeyCode.C))
    {
      // 投射物発射
      Launch();
    }

    // レイキャストしてNPCに当たればダイアログを表示する
    if (Input.GetKeyDown(KeyCode.X))
    {
      // キャラの位置より0.2f上から、向いている方向へ、最大1.5fで、NPCのレイヤーがいるかどうかテストする
      RaycastHit2D hit = Physics2D.Raycast(rigidbody2d.position + Vector2.up * 0.2f, lookDirection, 1.5f, LayerMask.GetMask("NPC"));
      if (hit.collider != null)
      {
        NonPlayerCharacter character = hit.collider.GetComponent<NonPlayerCharacter>();
        if (character != null)
        {
          // 相手のpublicメソッドを呼び出す
          character.DisplayDialog();
        }
      }
    }
  }

  void FixedUpdate()
  {
    Vector2 position = rigidbody2d.position;
    position.x = position.x + speed * horizontal * Time.deltaTime;
    position.y = position.y + speed * vertical * Time.deltaTime;

    rigidbody2d.MovePosition(position);
  }

  // 現在体力を変更する関数
  // 体力減らす場合は一定時間無敵状態とする
  public void ChangeHealth(int amount)
  {
    if (amount < 0)
    {
      if (isInvincible)
        return;

      isInvincible = true;
      invincibleTimer = timeInvincible;

      PlaySound(hitSound);
    }

    // 体力を変更するが、0～maxHealthの間にクランプする(マイナスになったりしない)
    currentHealth = Mathf.Clamp(currentHealth + amount, 0, maxHealth);

    UIHealthBar.instance.SetValue(currentHealth / (float)maxHealth);
  }

  // 投射物発射
  void Launch()
  {
    // 投射物インスタンス化。位置まで指定する
    // Quaternion.identitは生成するプレハブの回転無しを指定している
    GameObject projectileObject = Instantiate(projectilePrefab, rigidbody2d.position + Vector2.up * 0.5f, Quaternion.identity);

    // 投射物のLaunchメソッド呼び出しし、投射物側でaddforceする
    Projectile projectile = projectileObject.GetComponent<Projectile>();
    projectile.Launch(lookDirection, 300);

    // 予めAnimatorウィンドウで各アニメーションの遷移を矢印で指定し、
    // その遷移条件をConditionsに指定しておく
    animator.SetTrigger("Launch");

    PlaySound(throwSound);
  }

  public void PlaySound(AudioClip clip)
  {
    audioSource.PlayOneShot(clip);
  }
}
```

## UIHealthBar(体力ゲージ)

体力ゲージを実装するにあたって結構やることある。スクリプトは単純だけど

- あらかじめヒエラルキーに UI > Canvas で新しいオブジェクトを作成する
- 先に作成したCanvasの子オブジェクトに UI > Image としてImage Objectを作成
- ImageオブジェクトのSourcer Imageへ元画像をドラッグ
- 初期設定のRect Transformに合わせて画像が追加されておりアス比がおかしくなっているはずなので、Imageのインスペクターで**Set Native Size**ボタンをクリックして元画像のサイズに合わせてRect Transformを変更する。アス比が正常になったら好みのサイズに変更する
- 該当オブジェクトのRectTransformでアンカー位置(左上隅など)を指定してから、マウス操作でオブジェクトの配置を決定する
- 体力ゲージの枠内にさらに画像を置きたい場合は、画像のオブジェクトの子としてさらに画像を追加するしかし、初期状態では親画像が拡縮しても子は拡縮せずサイズ合わないし、アンカーからの位置も固定で、子画像がはみ出す
  - 子のRectTransformのアンカーを右下のstretchにすることで、アンカー位置を示す矢印が親画像の四隅に行く。これにより、子オブジェクのサイズは、四隅のアンカーからの距離で決まることになる  
(paddingみたいな感じ…Left,Top,Right,Bottomを全て0にすると親オブジェクトと同じ大きさになる)
  - 親画像の四隅を基準のままとすると、親画像が小さくなった時に子画像がつぶれてしまう。子画像の四隅にアンカーを設定し直すと、親画像が小さくなるとアンカー位置も変化し、子画像はそのアンカー位置に応じてレンダリングされるので拡縮が同期するようになる
- 体力ゲージの実装はゲージそのものを拡縮せずに、**マスクとなる親オブジェクトを拡縮し、その内側にゲージスプライトを固定表示しておくことで実装**(Canvas > Health > Mask > HealthBar　かな？)
  - マスクとする画像オブジェクトを体力ゲージの子として新規作成
  - 体力ゲージ部分を覆うようにマスクのサイズ・位置調整し、アンカーを四隅に移動する(先のアンカー：ストレッチのような感じに)
  - マスクのオブジェクトをスクリプトから拡縮するが、**ピボットを真ん中のままにしておくと、左右が同一割合で短くなるのでピボットを左端に移動して、右側から縮むようにする**
  - そのマスクの子として画像オブジェクトを作成し、体力ゲージバーのスプライトを割り当て(この時点で Canvas > Health > Mask > HealthBar かな？)
  - ゲージとする画像をマスクのサイズに合わせるべく、アンカープリセットをAlt + 右下のstretchとする(画像の大きさを合わせるための操作)画像サイズが調整されたら、アンカーを左側固定にしておく(右側が拡縮するので左側固定)
  - マスクとする方のコンポ―ネントにMaskコンポ―ネントを追加し、Show Mask Graphicのチェックを外して、子画像の見える部分のみが表示されるようにする

```
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class UIHealthBar : MonoBehaviour
{
  // シングルト化しているのでUIHealthBar.instanceでアクセスできる
  public static UIHealthBar instance { get; private set; }

  public Image mask;
  float originalSize;

  void Awake()
  {
    instance = this;
  }

  void Start()
  {
    originalSize = mask.rectTransform.rect.width;
  }

  // 操作するキャラクタ側からUIHealtBar.instance.SetValueで
  // ゲージの長さを設定可能
  public void SetValue(float value)
  {
    // rectTransformとはUIについてるTransform
    // 通常のTransformとは異なりUIをレンダリングするための設定等がある
    mask.rectTransform.SetSizeWithCurrentAnchors(RectTransform.Axis.Horizontal, originalSize * value);
  }
}
```

## HealthCollectible(回復アイテム)

```
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class HealthCollectible : MonoBehaviour
{
  public AudioClip collectedClip;

  // 回復アイテムを取った時の処理(Is Triggerにチェックをいれておく)
  // 操作するキャラの体力変更変数を呼出して自身を消す
  void OnTriggerEnter2D(Collider2D other)
  {
    RubyController controller = other.GetComponent<RubyController>();

    if (controller != null)
    {
      if (controller.health < controller.maxHealth)
      {
        controller.ChangeHealth(1);
        Destroy(gameObject);

        controller.PlaySound(collectedClip);
      }
    }

  }
}
```

< br >

## DamageZone(ダメージ食らう所)

```
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class DamageZone : MonoBehaviour
{
  // ・OnTriggerStay2Dにすることで、衝突中はずっとダメージを与える
  // ・但しこのままだとすぐに体力がなくなるので、一定期間無敵にする￥
  // ・ダメージゾーン中でも移動をやめると以下イベントは発生しなくなるので
  // 　Rigidbodyコンポーネントのプロパティで Sleeping Mode を Never Sleepにする
  void OnTriggerStay2D(Collider2D other)
  {
    RubyController controller = other.GetComponent<RubyController>();

    if (controller != null)
    {
      controller.ChangeHealth(-1);
    }
  }
}
```

< br >

## EnemyController(敵キャラ)

```
public class EnemyController : MonoBehaviour
{
  public float speed;
  public bool vertical;
  public float changeTime = 3.0f;

  public ParticleSystem smokeEffect;

  Rigidbody2D rigidbody2D;
  float timer;
  int direction = 1;
  bool broken = true;

  Animator animator;

  // Start is called before the first frame update
  void Start()
  {
    rigidbody2D = GetComponent<Rigidbody2D>();
    timer = changeTime;
    animator = GetComponent<Animator>();
  }

  void Update()
  {
    // brokenで以下処理を実行しない
    if (!broken)
    {
      return;
    }

    timer -= Time.deltaTime;

    if (timer < 0)
    {
      direction = -direction;
      timer = changeTime;
    }
  }

  void FixedUpdate()
  {
    // brokenで以下処理を実行しない
    if (!broken)
    {
      return;
    }

    Vector2 position = rigidbody2D.position;

    if (vertical)
    {
      position.y = position.y + Time.deltaTime * speed * direction;

      // 動作する軸方向に閾値以上の値をセット。動作を止める軸方向は0をセット
      animator.SetFloat("Move X", 0);
      animator.SetFloat("Move Y", direction);
    }
    else
    {
      position.x = position.x + Time.deltaTime * speed * direction;

      // 動作する軸方向に閾値以上の値をセット。動作を止める軸方向は0をセット
      animator.SetFloat("Move X", direction);
      animator.SetFloat("Move Y", 0);
    }

    rigidbody2D.MovePosition(position);
  }

  void OnCollisionEnter2D(Collision2D other)
  {
    RubyController player = other.gameObject.GetComponent<RubyController>();

    if (player != null)
    {
      player.ChangeHealth(-1);
    }
  }

  // 他のスクリプトから呼び出す
  // projectileが衝突したら敵キャラの動きを止めて、
  // 物理演算も停止、衝突検知等もしなくする(rigidbody2D.simulated = false;) 
  public void Fix()
  {
    broken = false;
    rigidbody2D.simulated = false;

    // 予めAnimatorウィンドウで各アニメーションの遷移を矢印で指定し、
    // その遷移条件をConditionsに指定しておく
    animator.SetTrigger("Fixed");

    smokeEffect.Stop();
  }
}
```

## Projectile(投射物)

- 投射物はプレハブ化しておいて、操作するキャラからインスタンス化して使う。
- 投射物発射時に操作するキャラと衝突しないように、衝突をレイヤー分けしておく

```
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Projectile : MonoBehaviour
{
  Rigidbody2D rigidbody2d;

  void Awake()
  {
    // Startでrigidbodyを取得するとLaunchを
    // 実行するときに取得が間に合わないのでここで行う
    rigidbody2d = GetComponent<Rigidbody2D>();
  }

  // 受け取った引数に従ってAddForceする
  public void Launch(Vector2 direction, float force)
  {
    rigidbody2d.AddForce(direction * force);
  }

  void Update()
  {
    // ワールド座標の中心からの距離でオブジェクト削除判定する
    if (transform.position.magnitude > 1000.0f)
    {
      Destroy(gameObject);
    }
  }

  void OnCollisionEnter2D(Collision2D other)
  {
    EnemyController e = other.collider.GetComponent<EnemyController>();
    if (e != null)
    {
      e.Fix();
    }

    Destroy(gameObject);
  }
}
```

## NonPlayerCharacter(NPC)

話しかけるとダイアログを表示するNPC

- 子オブジェクトにCanvasを作成
- 追加した**Canvasの Render Mode を World Space** に変更する
- Canvas上のUIはピクセル指定なので一旦ピクセルでサイズ調整してから、Scale調整
- 先のcanvasに UI > Image でダイアログ用のスプライトを追加
- **RectTransformでアンカーをストレッチ**にしてキャンバスを埋める(altキーを押しながらやると一発)
- シーン内にcanvasが写り込む場合はOrder in Layerを10ぐらいにしておく
- ※枠線の部分を拡縮したくない場合は
  - 画像をインスペクターで Mesh Type を FullRect にする
  - SpriteEditorでBorderを調整して枠線より内側に合わせる
  - この操作で四つ角はサイズ保持、その他枠部分は長辺側で拡縮・タイリング、真ん中はそのまま拡縮・タイリング
- テキスト部分
  - 更にImageの子に UI > Text - TextMeshPro でテキスト追加し、Import TMP Essentials でデフォルト設定をインストール
  - 枠と同様にアンカーをストレッチとし、枠部分から少し余白を持たせる
- **Canvasは初期で非表示にしておき、話しかけたらスクリプトで表示**する

ヒエラルキーは下記のようになるはず

```
Character
└─ Canvas (World Space)
   └─ Image (枠)
       └─ TextMeshPro (テキスト)
```

```
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class NonPlayerCharacter : MonoBehaviour
{
  public float displayTime = 4.0f;
  public GameObject dialogBox;  // インスペクタからCanvasを入れる
  float timerDisplay;

  void Start()
  {
    dialogBox.SetActive(false);
    timerDisplay = -1.0f;
  }

  void Update()
  {
    if (timerDisplay >= 0)
    {
      timerDisplay -= Time.deltaTime;
      if (timerDisplay < 0)
      {
        dialogBox.SetActive(false);
      }
    }
  }

  // 外部から呼び出ししてダイアログを表示する
  public void DisplayDialog()
  {
    timerDisplay = displayTime;
    dialogBox.SetActive(true);
  }
}
```