import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

export default class BaseSearchBar extends React.Component {
  constructor(props) {
    super(props);

  }


  // ★制御されたコンポーネント(controlled component)
  // react側にてフォームのデータを扱うものを制御されたコンポーネントという(具体的にはstateに保存する)
  // 逆に非制御コンポーネントとはDOMにてフォームのデータを扱う事をいう。

  // onChangeやonClick等のハンドラは親コンポーネント内にて
  // アロー関数や普通の関数のbindされたものとして定義され、
  // setStateにてevent.target.valueやchecked等をstateに保存する。
  // valueやchecked等のformに表示する内容は親コンポーネント内のstateから
  // propsとして渡される
  render() {
    return (
      <div className="SearchBar">
        <p>
          <label>フィルター文字列<input
            type="text"
            onChange={this.props.onTextChange}
            value={this.props.searchString} /></label>
        </p>
        <p>入力した文字列：{this.props.test}</p>
        <p>
          <label>フィルターする<input
            type="checkbox"
            onChange={this.props.onCheckboxChange}
            checked={this.props.isStockOnly}
          /></label>
        </p>
        <p>{
          // ★条件付きレンダリング
          // if文でレンダーするか決めても良いが以下でもできる
          this.props.isStockOnly && <span>チェックされています</span>
        }</p>
      </div>
    );
  }
}
