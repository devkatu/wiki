attention: headタグに入れるもの  
以下のメモ纏める
テスト項目

ランディングページとかのメモ

  ◎headタグに入れるもの
  
  ◎各種まとめておくもの
  ・font
  　基本となる本文とかはbodyにfont-size,font-weight,font-familyとかまとめておく
  　あとは適宜割り当てていく
  ・color maincolor,subcolor
  ・各操作品　ボタンのテーマ
  ・border-radiusやbox-shadow等のテーマ
  ・リンクのテーマ
  ・疑似要素
  ・slick、ハンバーガーメニュー等のテーマ

  ◎div.contain等　レスポンシブ化等のメモ
  　・基本はsection(widthいっぱい＆上下padding指定＆heigth:auto;)>div.contain
  　(width各種用意 & margin: 0 auto & 左右padding指定(レスポンシブ時に便利))の中にいろいろ書いていく
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

  ◎吉本式BEM設計のめも
  吉本式BEM設計抜粋
・ .block-element  ._modifire が基本
　自分で使うときは
　.block_element-modifireにしようかな

・blockになるタグは
　header,footer,main,section,article,nav,aside,div(注)
　のみとする。これ以外はelementとする。divのみはelementになりえる

・blcokはそれをそのまま抜き出して違うところに置いてもcssが正しく機能するのが基本(再配置可)
　なのでblockに対するcssはトップに書く。下のようなscssはNG
　.block{
	.他のblock{}
　｝
　htmlはblockにblockが入ることはあるが中のblockは独立とする(再配置可)
　&lt;main class="main"&gt;
　&lt;div class="main_inner"&gt;
　	&lt;section class="about"&gt; &lt;!-- class="main_～"とはならない。blockとして独立させる --&gt;
　	&lt;/section&gt;
　&lt;/div&gt;
　&lt;/main&gt;
　
・blockのクラス名は基本固定
　タグ		block名		用途
　header	header		サイトヘッダー
　footer	footer		サイトフッター
　main		main		メインコンテンツ
　nav		gnav		グローバルナビ
　nav		snav		サイドナビ
　nav		fnav		フッターナビ
　nav		share		シェアナビ
　section	可変

・elementも基本は固定
　タグ		element名
　p		txt,ttl,btn,logo,data(input系)
　div		inner,outer,wrap,box
　hn		ttl
　table		table
　th		tttl
　td		tdat
　ul		list
　ol		list
　li		item
　dl		def
　dt		dttl
　dd		ddat
　form		form
　figure	pic

　基本インライン要素にはクラス名つけないとしている　
　しかしblock内に配置するものが明らかに少ししかないときはelementも省略してもいいかも！

・小規模ならblock_elementで済むが規模が大きくなってくると
　同じクラス名が出てきてしまう。その場合にmodifireを使って区別する
　なるべく手戻りしないような名前にすること

・画像に関しては
　・サイト共通で使うなら
　　icon,pic,bg,txt,btnのいずれか＋連番
　・その他で使うなら
　　block＋element＋連番や画像のタイプ(上記のやつ)
　　にしてimgフォルダ内にcssのフォルダ構成と同じように振り分ける


  ◎作成前にしっかりワイヤーフレームでクラス名やID名、等のデザインを決めておいたほうがいい。
  　下のSEO対策と同時に実施していくのがいいかも

  ◎SEO対策
    ・アウトラインをきれいにするために、
    ①最初のマークアップ時にデザインはあまり考えずにアウトラインだけを書きだす
    (そもそもhtml自体が文書構造を表すのでcssがなくてもある程度意味が伝わらなくてはだめ
    クローラが読み取るのはhtmlだけ…だとおもう)
    imgタグは文脈的に必須の画像ならpタグで囲い、挿絵的に使いたければfigureで囲い(figcaptionも)
    それ以外のデザイン的に使うならpictureやdivで囲う
    ②そこからcssでデザインを行うときの為のdiv、span等を追加していく。
    なるべくアウトラインを作る要素にはcssを設定せずdivやspan等に着けていくほうが
    後々の保守性に良いみたい？
    その他に各要素に色々属性付けられるみたいだけどそこまではしないでもいいか
    ・画像、js、cssの圧縮も
    ・cssスプライト(イメージ画像は纏めて一つにしておいてpositionを指定して表示するやつ)
    ・meta descriptionの内容を充実させる

    ・最後にアウトライン解析、バリデーションを行っておくといいかも
    ・客先で必要ならgoogleアナリティクスのコードをもらって張り付ける
    　黄色副業本参考

  ◎テストについて
  フォント、配色、誤字脱字→difとかつかう?
  アウトライン→chrome拡張
  TDK(タイトル、ディスクリプション、キーワード)→目視確認
  タグのおかしい所、alt属性→gulp hintでhtmlhintが走るようになっているのでチェック
  アニメーションとかの動的要素の動きチェック
  レスポンシブチェック＆各種ブラウザにてチェック必要 → chrome拡張機能で
  コンソールエラー、ネットワークエラーのないこと→chromeチェック



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






  </pre>

  <p>ランディグページのレイアウト例</p>
  <ul style="display:flex;">
    <li style="list-style:none;margin-left:10px;"><img src="lpsite.gif" width=200></li>
    <li style="list-style:none;margin-left:10px;"><img src="web60_lp_koosei.gif" width=290></li>
    <li style="list-style:none;margin-left:10px;"><img src="e984bb3a3478aaf71841377406e08920.png" width=350></li>
  </ul>



</body>
</html>
