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

  // ★イベントハンドラについて
  // propsで渡すイベントハンドラは
  // 以下のようなアロー関数で書くと、リスナにそのまま登録するのみでよいが、
  // 普通の関数式(function(){})の形で書くと、コンストラクタで
  // this.handle = this.handle.bind(this);
  // とするかリスナに設定するときに、
  // onClick={this.handle.bind(this)}とかしなきゃだめ。
  // ※bindはある関数(下のはfunc)に対し、引数で渡すものをその関数内でthisとして使えるように割り当てる
  serch = (e) => {
    // ★setState
    // コンストラクタで設定されたstateを更新する。
    // このメソッドでstateを更新すると、stateを使用しているコンポーネントの再レンダーが行われる。
    // コンストラクタで設定された全てのプロパティ名を指定しなくても、更新のあるプロパティのみを
    // 引数として渡す感じでOK。(マージされる)
    // なお、元のstateを使ってstateを更新したいときは
    // this.setState((state, props) => {
    //   propaty: state.propaty + props.count
    // });
    // の形式で行う。
    this.setState({
      searchString: e.target.value
    });
    // ★e.preventDefault(); はハンドラが設定された要素の規定の動作をキャンセルする
    // aタグだったらページ遷移したりチェックボックスだったらチェック入れるのやめたり
    // return false;みたいな
    e.preventDefault();
  }
  check = (e) => {
    this.setState({
      isStockOnly: e.target.checked
    });
    // e.preventDefault();
  }

  render() {
    // ★jsx記法について
    // 基本的にはhtmlをそのまま書いていく感じでOKだが次のような決まり事あり
    // ・クラスコンポーネントのrender()や関数コンポーネントのreturnでは
    // 　一つの要素のみしか返せない。複数の要素を返したいときは<div></div>で囲う等必要
    // ・属性においては予約語とかぶったりしないように
    // 　・class   →   className
    // 　・(labelの)for   →   htmlFor
    // 　・onclick="handle"   →   onClick={handle} (キャメルケースでhandleは{関数})
    // ・カスタムコンポーネントでは属性を指定すると、コンポーネント内で
    //   props.属性名で引数のように指定ができる
    // ・カスタムコンポーネントで挟んだ要素はコンポーネント内でprops.childrenで呼出せる
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

            {/* map関数は配列の要素に対しそれぞれ処理を実施し、その結果を配列として返す
            liタグのkey属性はreactがどの要素に変更あったかを識別するために必要
            (一意に特定できるようなものであればなんでもいい)
            ただし普通にprops.keyとして使うことはできない
            map関数の処理の中でkeyがセットで出てくると思って間違いない */}
            {this.goodsDatas.map((data) => {
              if(0 <= data.name.indexOf(this.state.searchString) || !this.state.isStockOnly)
                return <BaseProductRow name={data.name} price={data.price} />;
            })}
            <BaseProductCategory title="Electronics" />
            {this.electronicsDatas.map((data) => {
              return <BaseProductRow name={data.name} price={data.price} />;
            })}
          </BaseProductTable>
        </BaseProductTableContain>

      </div>
    );
  }
}
