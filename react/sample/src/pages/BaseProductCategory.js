import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

// render()のみのものは下の関数コンポーネントに書き換えたほうがシンプル
// 関数コンポーネントはクラスコンポーネントでのrenderメソッドしか書けない
// また、関数コンポーネントではpropsを引数とすることができるが、
// stateを使いたいときははhookを使う。(なんか読みづらいけど)
// 簡単なrenderだけのコンポーネントなら関数で、
// stateやrefやその他機能をもちたいときはクラスコンポーネントがいいかも

// export default class BaseProductCategory extends React.Component{
//   constructor(props){
//     super(props);
//   }
//   render(){
//     return (
//       <tr> 
//         <th colSpan="2">{this.props.title}</th>
//       </tr>
//     );
//   }
// }


export default function BaseProductCategory(props){
  return (
    <tr> 
      <th colSpan="2">{props.title}</th>
    </tr>
  );
}