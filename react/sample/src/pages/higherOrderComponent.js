// 高階コンポーネントについて
// あるコンポーネントを受け取って新規のコンポーネントを返すような関数です
// コンポーネントのロジックを再利用するためのReact における応用テクニックです。
// HOC それ自体は React の API の一部ではありません。
// HOC は、React のコンポジションの性質から生まれる設計パターンです。
import React from 'react';


// 高階コンポーネント : higherOrderComponent
// 受け取るコンポーネント : OriginalComponent
// 新規のコンポーネント : NewComponent
// ・ロジックを再利用したい(各コンポーネントで共通する処理を)部分をこの高階コンポーネントの関数内に
// 　クラスとして記述し、それらを受け取るコンポーネントのpropsとして持たせてあげて返します
const higherOrderComponent = Originalcomponent => {

  class NewComponent extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        count: 0
      }
    }
    incrementCount = () => {
      this.setState(prevState => {
        return { count: prevState.count + 1};
      });
    }
    render(){
      return <Originalcomponent count={this.state.count} incrementCount={this.incrementCount} counterRef={this.props.forwardedRef}/>
    }
  }

  // return NewComponent;

  // refのフォワーディングを行うときは
  // return NewComponent;  の代わりに
  // 下記を書くとおｋ。これで、新しいコンポーネント側でthis.props.forwardedRefが使える
  // 普通にpropsで渡してもよさそうだが・・・？
  return React.forwardRef((props, ref) => {
    return <NewComponent forwardedRef={ref}/>
  });
}

export default higherOrderComponent;

// これを利用する側で下記のように書けば
// あとのロジック部分等が高階コンポーネントからpropsとして渡されているので
// 実装が楽になる
// class  ClickCounter extends React.Component {
//   render(){
//     return(
//       <div>
//         <button onClick={this.props.incrementCount}>clicked {this.props.count} times</button>
//       </div>
//     )
//   }
// }
// export default higherOrderComponent(ClickCounter);

// class HoverCounter extends React.Component {
//   render() {
//     return (
//       <div>
//         <p onMouseOver={this.props.incrementCount}>
//           hover {this.props.count} times
//         </p>
//       </div>
//     )
//   }
// }
// export default higherOrderComponent(HoverCounter);