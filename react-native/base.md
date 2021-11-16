# React Native

## bearワークフロー
---
シンプルなreact nativeの開発はbearワークフロー

## expo ワークフロー
---
expoなるフレームワークを使った超便利ワークフロー  
スマホにexpo goアプリをいれると超絶簡単デバッグが可能となる  
expoで標準で用意されているAPIとかもあってめっちゃ便利

## コンポーネントについて
---
いろいろコンポーネントはあるが基本`View`と`ScrollView`を押さえておけばほとんど問題ない  
自分でいろいろスタイルをいじくりたいなら別だけど、[react native directory](https://reactnative.directory/)やら[npm js](https://www.npmjs.com/)で便利なUIセットがたくさん用意されているので基本はそっちを使うと思う

### コアコンポーネント色々(これらを使用してネイティブのコンポーネントを呼出す)

| コンポーネント | 説明                                                                          |
| -------------- | ----------------------------------------------------------------------------- |
| View           | スクロール無いdiv                                                             |
| Text           | p                                                                             |
| Image          | img                                                                           |
| ScrollView     | div                                                                           |
| TextInput      | input:text                                                                    |
| FlatList       | リストスタイル無しのul。itemはdata属性でオブジェクト配列で渡す。<br> renderItem属性でどのようにレンダリングするかコールバックで指定                |
| SectionList    | セクションヘッダー付きのul。itemはsections属性でオブジェクト配列で渡す<br>renderItem属性でitemをどのようにレンダリングするかコールバックで指定<br>renderSectionHeader属性でheaderをどのようにレンダリングするかコールバック指定 |

