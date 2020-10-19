import React from 'react';
import ReactDOM from 'react-dom';

export default function Cell(props) {
  if(props.value == 1){
    return <div className="black" onClick={props.onClick}></div>
  }else if(props.value == 2){
    return <div className="white" onClick={props.onClick}></div>
  }else{
    return <div className="cell" onClick={props.onClick}></div>
  }
}

// export には
// 単一値  →export default
// 複数値  →export
// 混在系がある →上記両方あり
// 基本的にはexportしたもの全てをオブジェクトで返すような仕組みになる


// これらをimportする側は
// import 単一値を受取る識別子 from 'モジュール名';
// import {複数値を受取る識別子１, 複数値を受取る識別子２, ...} from 'モジュール名';
// import 単一値を受取る識別子, {複数値を受取る識別子１, 複数値を受取る識別子２, ...} from 'モジュール名';
// →これだと各値がそのまま使用できる
//   複数値を受取る場合はモジュール側でexportした名前と一致していなければならない。
//   名前を変えたい時は、複数値を受取る識別子 as 別名ともできる
// import * as X from 'モジュール名';
//   →こちらはXにexportしたモジュールがすべてオブジェクトとして代入される
//     default exportのものはXそのままか、defaultプロパティで呼出せる



