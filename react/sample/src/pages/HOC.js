import React from 'react';

// 高階コンポーネントの読込
import higherOrderComponent from './higherOrderComponent'


// ★高階コンポーネントについて
// あるコンポーネントを受け取って新規のコンポーネントを返すような関数です
// コンポーネントのロジックを再利用するためのReact における応用テクニックです。
// HOC それ自体は React の API の一部ではありません。
// HOC は、React のコンポジションの性質から生まれる設計パターンです。


// 高階コンポーネントに渡すコンポーネントの定義
// 共通するロジックの部分は高階コンポーネント側で定義されており、
// そちらで付加する形になる
class ClickCounter extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <button onClick={this.props.incrementCount}>
          clicked {this.props.count} times
        </button>
      </div>
    )
  }
}
class HoverCounter extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <p onMouseOver={this.props.incrementCount}>
          hover {this.props.count} times
        </p>
      </div>
    )
  }
}


export default class HOC extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    // 高階コンポーネントhigherOrderComponentに、コンポーネントを受け渡し、
    // 共通するロジック部分を付加したコンポーネントを返してもらう
    const MyComponent1 = higherOrderComponent(ClickCounter);
    const MyComponent2 = higherOrderComponent(HoverCounter);

    return (
      <div>
        <h2>高階コンポーネントについて</h2>
        <MyComponent1 />
        <MyComponent2 />
      </div>
    );
  }
}

