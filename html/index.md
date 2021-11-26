# HTML

基本的なタグの使い方とかは省略。
WEB制作するときにどんなことに気を付けるのかとか纏めているよ。

## HTML5でのセクショニング
見た目だけを作り上げるなら全部`<div>`でもいいけど、htmlとしての役割は文書構造を表すこと。
しっかり文書構造を定義することでクローラも認識しやすく、SEOにも強くなる。

HTML5で定義さている以下の要素を使ってきちんとした文書構造、セクショニングを意識して作っていくこと。

- `header`
ロゴ、タイトル、ナビゲーションとかの領域を示す。
ページ上部の領域に使うのが多いが、sectionとかの中にも入れるパターンもあるらしい
- `nav`
ナビゲーションメニュー
- `section`
本文の階層構造を明確にしたい箇所。本文に追加のアウトラインを入れる
- `article`
記事情報。自己完結のコンテンツであくまでメインのコンテンツではなくコメントや、ウィジェットのようなものなど
- `aside`
本文とは関係の浅い箇所。説明文や広告など
- `footer`
著作権情報や法的事項、いくつかのリンクとかの領域を示す。
ページ下部の領域に使うのが多いが、sectionとかの中にも入れるパターンもあるらしい

```
<!-- コードの例 -->
<header>
  <hgroup>
    <h1>h1の内容</h1>
    <h2>h2の内容</h2>
  </hgroup>
  <nav>
    <ul>
      <li>ナビ1</li>
      <li>ナビ2</li>
    </ul>
  </nav>
</header>
  <article>
    <header>
      <h2>h2の内容</h2>
      <time datetime="2011-08-20">2011年8月20日</time>
    </header>
    <h3>h3の内容</h3>
    <p>文章ほげほげ。</p>
    <section>
      <h4>h4の内容</h4>
      <p>文章ほげほげ。</p>
   </section>
  </article>
  <aside>
    <img src="hoge.png" alt="広告A">
  </aside>
</div><!-- /#contents -->
<footer>
  <p><small>Copyright</small></p>
</footer>
```

---

## 制作の流れ

1. 明示的なアウトラインの書きだし
アウトライン(章、節とか項みたいなもので文章の階層構造)をきれいにするために、最初のマークアップ時にデザインはあまり考えずにページの上から順番に、明示的なアウトラインだけを書きだす。`<hx>`のみでもアウトラインは形成されるがそのアウトラインを暗黙的なアウトラインという。両者混合して使うとわけわからんくなるのでどちらかに統一したほうがいいと思う。

  - `<body>`直下に`<h1>`を置く。基本的には`<h1>`はページに一つだけ置く。
  - `<h2>`以降の見出しはできるだけ`<section>`をネストして書いていく。`<section>`でネストすると、その箇所は下位の階層を形成する。なので、`<section>`の中身に`<h1>`とかがあっても正しいアウトラインとなるがこれも混乱を来すので見出しの順序は守る。

2. 本文、画像等の書き出し
コンテンツを書きだしていく
  - 本文`<p>`を追加していく。
  - `<img>`は文脈的に必須の画像なら`<p>`で囲い、挿絵的に使いたければ`<figure>`で囲い(`<figcaption>`も必要に応じてつける)それ以外のデザイン的に使うなら`<picture>`や`<div>`で囲う。また、背景のデザインとして画像をつかうのであればcssで行う
  - 画像ファイルは適宜、トリミングやサイズ変更を行い使いやすい状態にする。
  - ボタン押したら画像が切り替わるとか、何かのきっかけで切り替わる画像はcssスプライト(使用するｲﾒｰｼﾞを一つの画像ファイルに纏めてposition替えるやつ)も検討する。webページのロード時に画像が読み込まれるので遅延が少ない。

3. デザインを整えて行く
デザインを整えながら、必要に応じてflexしたい箇所とかにデザインを整える為の`<div>`、`<span>`等を追加していく。なるべくアウトラインを作る要素にはcssを設定せず`<div>`、`<span>`等に着けていくほうが後々の保守性に良いかも？
クラス名はBEM設計を元に付けて行く。事前にデザインファイル上で検討しておくとスムーズかも

4. 画像ファイルの圧縮を行う(画像編集時でもいつでもいい)。一応gulpでいっぺんに画像圧縮が使えるのでそれが楽かも。css、jsもバンドラーとかで圧縮できたりするけどそんなに大きな規模でなければいらないと思う

5. `<head>`の内容を充実させる。結構ボリュームあるので後述

6. 客先で必要ならgoogleアナリティクスのコードをもらって張り付ける

7. 完成テスト

  - (デザインをもらっている場合は)フォント、配色が問題ないか、誤字脱字はないか<br>→目視確認
  - TDK(`<head>`のタイトル、ディスクリプション、キーワード)は設定されているか<br>→目視確認
  - アウトラインは正常か<br>→chrome拡張
  - タグの使い道のおかしい所はないか<br>→gulp hintでhtmlhintが走るようになっているのでチェック
  - アニメーションとかの動的要素の動きチェック<br>→実際に動きをブラウザで確認
  - レスポンシブでスタイル崩れないか、＆各種ブラウザにてスタイル崩れないかチェック<br>→chrome拡張機能と各種ブラウザでチェック
  - コンソールエラー、ネットワークエラーのないこと<br>→ブラウザ検証ツールでチェック

8. クライアントに提出

---

## headタグに入れるメタ情報

### 文字コード指定
いわずもがな。お決まりのやつ
```
<meta charset="UTF-8">
```

### レスポンシブの指定
お決まりのやつ。レスポンシブのおまじない
```
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### IE対応
ie対応のおまじない。過去バージョン互換モードではなく最新バージョンで見るようにする
```
<meta http-equiv="X-UA-Compatible" content="ie=edge">
```

### ディスクリプション
検索結果に表示される説明文。SEO効果は特にないけどきちんとした説明文があればクリック率には関わるかも
```
<meta name="description" content="自動車・バイク用品・産業用バッテリーを楽天、Yahoo!ショッピング、AMAZON、自社サイトで格安通販「ザバッテリー」/自動車部品バイクパーツ販売の株式会社 ニュートレード社オフィシャルサイト　大阪府大阪市">
```
### キーワード
そのページの内容を表すキーワード。あまり書かないほうがいいらしいが…
```
<meta name="keywords" content="バイク,自動車,産業用,バッテリー">
```

### OGP
SNSでの拡散時に自動的に画像表示されたり文章表示されたりするアレ。

- `<head>` か`<html>`にprefixを入れること
- og:title
ページのtitleを指定します。一般的にはサイト`<title>`と同じ内容を設定しますが、サイト名などのブランド情報を含まないtitleを20文字以内で設定することが好ましいとされています。
- og:description
ページの説明文を指定します。サイトのメタディスクリプションと同様の内容で記述することが多いですが、「og:description」での文字数は80~90文字が最適とされています。メタディスクリプションの文字数は120文字程度なので、内容をそのままを設定してしまうと表示された際に文字が切れてしまう可能性があるため、OGP用に文章を簡略化するとシェアされた際にユーザーに伝わりやすくなります。
- og:type
ページの種類を指定します。このタイプを設定することにより、SNS上での表示形式が変わってきます。*TOPページの場合は「website」、WEBサイト上の記事ページなど、TOPページ以外には「article」*を指定します。
- og:url
OGPを設定するWEBページのURLを指定します。URLは相対パスではなく*絶対パス*での記述をします。
- og:image
SNS上でシェアされた際に表示させたい画像を*絶対パスで指定*します。
Facebookでは画像サイズを1200×630p、比率で「1.91：1」を推奨しています。
- og:site_name
ページのサイト名を記述します。サイト名やブランド情報は「og:title」ではなく、この「og:site_neme」に設定します。
- SNS個別のもの
  - twitter:card
  Twitter上での表示タイプを指定するタグになります。
  カードの種類はブログやwebサイト用、アプリ配布用、動画サイト用と全部で4種類あり、それぞれ見せ方が変わってきます。
  Summary Card：タイトル、説明、およびサムネイル。
  Summary with Large Image：summary cardと同じ形ですが、画像の大きさが大きいものになります。
  App Card：アプリ配布用の表示カード。
  Player Card：ビデオ/オーディオ/メディアを表示できるカード。
  - twiter:site
  @から始まる、Twitterのアカウント名を入力します
  - fb:app_id
  サイトやブログの管理者をFacebookに伝えるためのタグになります。

```
<head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# website: http://ogp.me/ns/website#">

<meta property="og:title" content="株式会社 ニュートレード社- 自動車、バイク用品の卸会社">
<meta property="og:description" content="自動車部品バイクパーツ販売の株式会社 ニュートレード社オフィシャルサイト　大阪府大阪市">
<meta property="og:type" content="website">
<meta property="og:url" content="https://new-trade.co.jp/">
<meta property="og:image" content="https://new-trade.co.jp/new/img/sns/sns_card.png">
<meta property="og:site_name" content="株式会社 ニュートレード社オフィシャルサイト">
<meta name="twitter:card" content="summary_large_image">
<meta property="fb:app_id" content="appIDを入力" />
```

### ファビコン
ルートディレクトリにfavicon.icoを置いても勝手にブラウザが解釈してくれる。
.icoファイルはオンラインでフリーで作成できるツールがあるのでそれを使うと便利。
.icoファイルをおいてもいいし、下のようにサイズ指定して複数画像ファイルをリンクしても良い。
ブラウザが適切な画像を勝手に選択してくれる
```
<link rel="icon" href="./favicon.ico">

<link rel='icon' href='画像URL' sizes='16x16' type='image/png'>
<link rel='icon' href='画像URL' sizes='32x32' type='image/png'>
<link rel='icon' href='画像URL' sizes='48x48' type='image/png'>
<link rel='icon' href='画像URL' sizes='62x62' type='image/png'>
```

### スタイルシート
スタイルシートの読込
```
<link rel="stylesheet" href="./css/style.css">
```

### 検索避け
低品質なページ、開発中のページ等で使う。
contentがnoindex,nofollowだとクローラーはクロールもインデックスもしない。
noindex,followだとクロールはするけどインデックスはしない。
開発中はnoindex,followにしておいてwebサイトは認識してもらってインデックスはさせないようなこともある
```
<meta name="robots" content="noindex,nofollow">
```

### アイコン
スマホ(iphone?)用のtopアイコン 150*150ぐらい推奨
```
<link rel='apple-touch-icon-precomposed' href='画像のURL'>
```
windowsタイルの設定
```
<meta name='msapplication-TileImage' content='画像のURL'>
<meta name='msapplication-TileColor' content='カラーコード（例：#F89174）'>
```

### 実際に作ったheadタグ内の例
```
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<meta name="description" content="自動車・バイク用品・産業用バッテリーを楽天、Yahoo!ショッピング、AMAZON、自社サイトで格安通販「ザバッテリー」/自動車部品バイクパーツ販売の株式会社 ニュートレード社オフィシャルサイト　大阪府大阪市">
<meta name="keywords" content="バイク,自動車,産業用,バッテリー">
<meta property="og:title" content="株式会社 ニュートレード社- 自動車、バイク用品の卸会社">
<meta property="og:description" content="自動車部品バイクパーツ販売の株式会社 ニュートレード社オフィシャルサイト　大阪府大阪市">
<meta property="og:type" content="website">
<meta property="og:url" content="https://new-trade.co.jp/">
<meta property="og:image" content="https://new-trade.co.jp/new/img/sns/sns_card.png">
<meta property="og:site_name" content="株式会社 ニュートレード社オフィシャルサイト">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="./favicon.ico">
<link rel="stylesheet" href="./css/style.css">
<link rel="stylesheet" href="./css/top/style.css">
<title>株式会社 ニュートレード社- 自動車、バイク用品の卸会社。自動車用品店</title>
```
---

## BEM設計(クラス名の命名について)

クラス名を付けていくときに、悩んでしまって制作スピードが落ちたり、制作が進んでいくと似たようなクラス名がでてきてしまったりして混乱をするのを防ぐために、命名規則を設ける。

- Block
読んで字のごとく一つの塊。この塊を抜出して違う箇所に再配置してもスタイルが崩れないようにすること
- Element
blockの中に配置される要素。
- Modifier
フォーカスされた、とか選択された時に付加される

吉本式BEM設計より

> - クラス名は`.block-element._modifire`が基本

自分で使うときは`.block_element.-modifire`にしようかな

> - blockになるタグは
> `<header>`,`<footer>`,`<main>`,`<section>`,`<article>`,`<nav>`,`<aside>`,`<div>`(注)
> のみとする。これ以外はelementとする。但しdivのみはelementになりえる
> - blcokはそれをそのまま抜き出して違うところに置いてもcssが正しく機能するのが基本(再配置可)
> なのでblockのみにに対するcssはトップに書く。下のようなscssはNG
> ```
> 　.block{
> 	.他のblock{}
> 　｝
> ```
> htmlの方ははblockにblockが入ることはあるが中のblockは独立とする(再配置可)
> ```
> 　<main class="main">
> 　<div class="main_inner">
> 　	<section class="about"> <!-- class="main_～"とはならない。blockとして独立させる -->
> 　	</section>
> 　</div>
> 　</main>
> ```
> - blockのクラス名は基本固定
>
> | タグ | block名 | 用途 |
> | --- | --- | --- |
> | header | header | サイトヘッダー |
> | footer | footer | サイトフッター |
> | main | main | メインコンテンツ |
> | nav | gnav | グローバルナビ |
> | nav | snav | サイドナビ |
> | nav | fnav | フッターナビ |
> | nav | share | シェアナビ |
> | section | 可変 | * |

> - elementも基本は固定

> | タグ | element名 |
> | --- | --- |
> | p | txt,ttl,btn,logo,data(input系) |
> | div | inner,outer,wrap,box |
> | hn | ttl |
> | table | table |
> | th | tttl |
> | td | tdat |
> | ul | list |
> | ol | list |
> | li | item |
> | dl | def |
> | dt | dttl |
> | dd | ddat |
> | form | form |
> | figure | pic |

基本インライン要素にはクラス名はつけないとしている　
しかしblock内に配置するものが明らかに少ししかないときはelementも省略してもいいかも！

> - 小規模ならblock_elementで済むが規模が大きくなってくると
> 同じクラス名が出てきてしまう。その場合にmodifireを使って区別するのもあり
> なるべく手戻りしないような名前にすること
> - 画像に関しては
>   - サイト共通で使うならicon,pic,bg,txt,btnのいずれか＋連番
>   - その他で使うならblock＋element＋連番や画像のタイプ(上記のやつ)にしてimgフォルダ内にcssのフォルダ構成と同じように振り分ける

作成前にしっかりワイヤーフレームでクラス名やID名、等をデザインをもとに決めておいたほうがスムーズ。

---

## スタイル設定のこと??

attention: 書きかけの項目

### レスポンシブ対応を意識した各セクションのスタイリングとその他留意事項

基本的な考え方は以下となる

- PC版(XXXXpx～)
ほとんどの値のwidth,height等は固定値でカチッとスタイリングして問題なし
  - `<section>`は
  width: 100%;
  padding: XXpx 0;
  heigth: auto;
  とし、横幅いっぱい、上下に余白を取り、中のコンテンツエリアを設定。高さは内容物次第とする
  - `<section>`の中に入れる子要素として`<div class="contain">`は
  width: XXXXpx;
  margin: 0 auto;
  padding: 0 XXpx;
  固定幅のコンテンツをmargin調整で中央に揃えて、paddingを左右に用意しておく
  - その他の要素のfont,width,height等は固定値でも問題ない
- タブレット版(XXXXpx～XXXXpx)
各スタイルの値の指定は％やvw,fontはvwやemやremを使用し、各用品の配置が崩れないように気を付ける。
特に縦方向の値marginやheight等にvwを使用する事を忘れずに。
コンテナにはmax,min-widthを付与して、レスポンシブする上下限を決めておくいい。画像はフルードにする。
  - `<section>`は
  padding: XXvw 0;
  等に直し、上下余白が画面幅に比例するようにする。
  - `<section>` > `<div class="contain">`は
  width: XXvw;
  max-width: XXXXpx;
  padding: 0 XXvw;
  等に直し、左右幅、左右余白が画面幅に比例するようにする。
  あまり広がりすぎると不格好な時はmax-width: XXXXpx;を入れる
  - `<img>`は
  width: 100%;
  height: auto;
  等のフルードにし、コンテナサイズに合わせて拡縮するようにする。

- スマホ版(～XXXXpx)
  - 横幅
  
    レスポンシブの数に応じてcssメディアセレクタでサイズを変更していく
    大：PCで見るときでfontやwidth,height等は決め打ち。画像も元サイズ等の固定サイズ
    中：タブレットで見るときでfontやwidth,height等は％やvw,em,rem使用し、各用品の配置が崩れないようにコンテナにはmax,min-widthを付与するとよい。画像はフルードにするのが基本
    ・vwは100vwをviewport-widthいっぱいとする単位
    ・emは親要素からの相対的な単位で1.0で親と同じ
    ・remはhtml要素からの相対的な単位
    　→remを使うならhtmlに62.5%(16px(デフォルト) × 62.5% = 10px)とすると指定が楽
    任意の画面幅で、XXpxになるようなvwの指定方法がscssのmixinとか使えばできるよ！
    また、height、縦方向のmarginはvw指定しておくと画面幅が変わっても同じレイアウトとなるので活用すべし！
    ライブラリにあり！
    小：スマホで中に同じ
  　・レスポンシブ用にbodyの直下にdivを設けてoverflow:hidden;にするといいかも？
  　→スマホ用の画面でfixedにした要素があるとなぜかwidthが親要素ではなく一番横幅とっている要素基準になる
  　　これを解消するのに全体にoverflow:hidden;しておきたい…bodyに指定するとスクロールできなくなってしまうので
  　　だめ。。。　absoluteしたときもレンダリングに影響あることあり!!注意
  　または横幅がoverしそうな要素のみoverflow:hidden;しておく
  
---

## 各種まとめておくもの??
attention: 書きかけの項目

  ・font
  　基本となる本文とかはbodyにfont-size,font-weight,font-familyとかまとめておく
  　あとは適宜割り当てていく
  ・color maincolor,subcolor
  ・各操作品　ボタンのテーマ
  ・border-radiusやbox-shadow等のテーマ
  ・リンクのテーマ
  ・疑似要素
  ・slick、ハンバーガーメニュー等のテーマ









wordpress化MEMO
　・テーマとなるhtml、cssをいい感じに編集して、wordpressをインストールした
　　サーバーにアップロードするが、アップするときはフォルダ分けせずindex.phpと
　　style.cssは同じディレクトリに。
　・style.cssにはコメントの形でthemenameだとかthemeuriだとかを入れる。
　・phpでエラーこくとわかりずらいのでオプションでエラー表示にしておくとよい
　・あとは基本テンプレ(ドットインストールのやつ)で対応できると思う
　★スタイル、スクリプトの読み込みはどうするのがベストか？
　　自作のはいいけどjqueryとかslickとか


ハイブリッドアプリmemo
  ・android10だとajaxしようとしてもできない
  　→デバッグアプリだとできるけどビルドするとできなくなる笑
  以下をいれること
  &lt;widget xmlns:android="http://schemas.android.com/apk/res/android"&gt;
  &lt;platform name="android"&gt;
  &lt;edit-config file="AndroidManifest.xml" target="/manifest/application" mode="merge"&gt;
  &lt;application android:usesCleartextTraffic="true" /&gt;
  &lt;/edit-config&gt;
  &lt;/platform&gt;



## ランディングページのレイアウト集
画像入れる？




