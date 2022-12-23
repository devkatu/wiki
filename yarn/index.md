# yarnパケージマネージャー

## インストール関係
|                            | グローバル                                                                         | ローカル                                                                                                                                                                |
| :------------------------- | :--------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| インストールパッケージ一覧 | `yarn global list --depth=0`                                                       | `yarn list --depth=0`                                                                                                                                                   |
| インストール               | `yarn global add {package}`                                                        | package.jsonのものをインストール<br>`yarn install`<br>dependenciesにインストール<br>`yarn add {package}`<br>devDependenciesにインストール<br>`yarn add --dev {package}` |
| アンインストール           | `yarn global remove {package}`                                                     | `yarn remove {package}`                                                                                                                                                 |
| アップデート **※**               | 全体<br>`yarn global upgrade`<br>パッケージ指定<br>`yarn global upgrade {package}` | 全体<br>`yarn upgrade`<br>パッケージ指定<br>`yarn upgrade {package}`<br>最新版へ更新<br>`yarn upgrade --latest`<br>対話式で更新<br>`yarn upgrade-interactive`               |

**※注意**
- `yarn upgrade`は`package.json`で記述したバージョン範囲に従って更新され`package.json`は更新しない。
- `yarn upgrade --latest`だと`package.json`で記述した範囲を超えて最新バージョンに更新する。ので**メジャーバージョンが変わったりする**。`package.json`は更新される
- `yarn upgrade-interactive`は`package.json`で指定した範囲で更新される。`package.json`は更新されない
- バージョン範囲の見方は
  - ^(キャレット)が付くと、一番左の数字を更新しない範囲で更新
  - ~(チルダ)が付くと、マイナーバージョンが明記されていればパッチバージョンが更新でき、明記されていなければマイナーバージョンが更新される
  - x、*はワイルドカード
  - <、>、<=、>=が先頭に付くとそのバージョン未満、超える、以下、以上の範囲となる
  - ver - verで範囲をしていすることもできる


## その他の使用
|                    | コマンド                                                               |
| ------------------ | ---------------------------------------------------------------------- |
| 古いパッケージ表示 | 全体<br>`yarn outdated`<br>パッケージ指定<br>`yarn outdated {package}` |
| キャッシュ         | クリア<br>`yarn cache clean`<br>一覧<br>`yarn cache list`              |
| コンフィグ         | `yarn config list`                                                     |
| スクリプト         | 実行<br>`yarn run {script}`<br>環境変数の表示<br>`yarn run env`        |

## 脆弱性の解決  
`npm audit`でセキュリティレポートを出力。解決方法があればそれも表示してくれる  
`npm audit fix`で、アップデートして脆弱性の解決を行う。破壊的な変更があってfixできない場合はメッセージが出力される  
`npm audit fix --force`破壊的な変更があった場合でも強制的にfixするならコレ  

## peer depthについて
peer dependencyはnpm6まではそのパッケージが依存するものを”参考まで”にのっけていたが、npm7以降はそのpeer依存関係も一緒にインストールするようになった。そのせいで矛盾する依存関係がある場合はエラーもでるこんなこと出来ましたカメラの際にpeer dependencyで悩まされたが、一応、`npm update --legacy-peerdeps`でnpm6以前のやり方でアプデはできるみたい(このアプリの時は結局引っかかたパッケージの最新版をインストールしたらすんなりいった)



