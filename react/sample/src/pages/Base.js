import './Base.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import BaseProductCategory from './BaseProductCategory';
import BaseProductRow from './BaseProductRow';
import BaseProductTable from './BaseProductTable';
import BaseProductTableContain from './BaseProductTableContain';
import BaseSearchBar from './BaseSearchBar';

export default class Base extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: "",
      isStockOnly: false
    };
    // ↓jsonで受取る値のシミュレーション
    this.goodsDatas = [
      { name: "Foot Ball", price: 4.99 },
      { name: "Base Ball", price: 6.55 },
      { name: "Basket Ball", price: 5.99 },
      { name: "Socker Ball", price: 3.99 },
    ];
    this.electronicsDatas = [
      { name: "iphone", price: 20.0 },
      { name: "zenphone", price: 10.0 },
      { name: "iwatch", price: 15.0 },
      { name: "android", price: 5.0 },
    ]
  }

  serch = (e) => {
    this.setState({
      searchString: e.target.value
    });
    e.preventDefault();
  }
  check = (e) => {
    this.setState({
      isStockOnly: e.target.checked
    });
    // e.preventDefault();
  }

  render() {
    return (
      <div>
        <h2>基本…Reactの流儀参照</h2>
        <BaseProductTableContain>
          <BaseSearchBar
            searchSrting={this.state.searchString}
            isStockOnly={this.state.isStockOnly} 
            onTextChange={this.serch}
            onCheckboxChange={this.check}
            test={this.state.searchString} />
          <BaseProductTable>
            <BaseProductCategory title="Sport Gooods" />
            {this.goodsDatas.map((data) => {
              if(0 <= data.name.indexOf(this.state.searchString) || !this.state.isStockOnly)
                return <BaseProductRow name={data.name} price={data.price} />;
            })}
            <BaseProductCategory title="Electronics" />
            {this.electronicsDatas.map((data) => {
              return <BaseProductRow name={data.name} price={data.price} />;
            })}
            {this.state.isStockOnly && <p>test</p>}
          </BaseProductTable>
        </BaseProductTableContain>
      </div>
    );
  }
}
