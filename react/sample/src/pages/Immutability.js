import React from 'react';


// ★イミュータブルについて


export default class Immutability extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      count: 0,
      num: 0
    }
  }

  onClickHandler = () => {
    this.setState((state) => ({
      count: parseInt(state.count) + parseInt(state.num)
    }));
    
  }

  onChangeHandler = (e) =>{
    // ★通常このようにそのままオブジェクトとかの値をそのまま更新する
    // これがミューテート(書き換え)、ミュータブルなデータの書き換え
    // this.setState({
    //   num: e.target.value
    // });

    // ★変更したいデータのコピーを作ってから、そのコピーの値を書き換えて、
    // データを書き換えする。これがイミュータブル(不変)
    // これにより
    // ・チュートリアルのような着手履歴機能
    // ・変更検出→レンダリングタイミング決定
    // が可能となる
    const newState = {...this.state, num: e.target.value};
    this.setState({
      ...newState
    });
  }

  render(){
    return (
      <div>
        <h2>イミュータブルについて</h2>
        <input type="number" value={this.state.num} onChange={this.onChangeHandler}/>
        <button onClick={this.onClickHandler}>add!!</button>
        <p>click count : {this.state.count}</p>
      </div>
    );
  }
}
