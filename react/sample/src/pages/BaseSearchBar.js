import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

export default class BaseSearchBar extends React.Component {
  constructor(props) {
    super(props);

  }

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
        <p>{this.props.isStockOnly && <span>チェックされています</span>}</p>
      </div>
    );
  }
}
