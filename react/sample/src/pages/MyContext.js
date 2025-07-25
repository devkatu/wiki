import React from 'react';


// ★コンテキストについて
// createContextを使用してcontextを作成することで
// ツリーの色々なところで必要なpropsを子要素の子要素へ…とひたすら書かずに
// contextをstaticで読み取ってthis.contextにて値を受け渡すことができる。
// ネストが深い所へ値を渡すのが楽になる

// React.createContext()の引数でコンテキストの初期値を設定でき、
// Context.Providerのvalueプロップにて任意の値を設定できる
// クラスコンポーネントではContext.Providerで括った中身のコンポーネントで
// static contextType に作成したコンテキストを入れると this.contextで値を読み取れる
// 関数コンポーネントではContext.Providerで括った中身で
// const context = useContext(作成したコンテキスト)　のcontextで値を読み取れる


const ThemeContext = React.createContext('light');
export default class MyContext extends React.Component {
  // static contextTypeに作成したコンテキストを読込むとthis.contextとして使えるみたい
  static contextType = ThemeContext;
  render() {
    return (
      <div>
        <h2>コンテキストについて</h2>
        <p>デフォルトのテーマは：{ this.context }</p>
        <ThemeContext.Provider value="dark">
          <ThemeSampleButton />
        </ThemeContext.Provider>
      </div>
    );
  }
}


class ThemeSampleButton extends React.Component {
  // ことなるクラスの中でもpropsを通さずに値を共有できる
  static contextType = ThemeContext;
  render() {
    return (
      <p>
        <button>このボタンのテーマは : {this.context}</button>
      </p>
    );
  }
}
