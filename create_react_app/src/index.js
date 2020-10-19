// import React from 'react';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Provider, connect } from "react-redux"; // reactとreduxを接続する為に必要なコンポーネントがある
                                                  //Providerはトップレベルのコンポーネントとして設置し、 connectはデコレータとして動作する


import Cell from './cell.jsx';
import { store } from './client.js';
import Axios from 'axios';

// render()のみのものは下の関数コンポーネントに書き換えたほうがシンプル
// (関数コンポーネントはrenderしか書けない)
// class Square extends React.Component {
//   render() {
//     return (
//       <button
//         className="square"
//         onClick={() => this.props.onClick()}
//       >
//         {this.props.value}
//       </button>
//     );
//   }
// }

function Square(props) {
  const [test, setTest] = React.useState(1);
  const toggleTest = React.useCallback(() => setTest((p) => {
    console.log(p);
    return !p;
  }), [setTest]);

  return (
    // <button className="square" onClick={props.onClick}>
    <button className="square" onClick={toggleTest}>
      {props.value}
    </button>
  );
}

function calcFlip(squares, x, y, next) {
  let me = next ? 1 : 2;
  let rival = 3 - me;
  let flipFlg = false;
  let finFlip = false;
  console.dir(squares);
  console.log('x:' + x + '  y:' + y + ' rival:' + rival + ' me:' + me);
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      // サーチする方向ごとに以下処理
      flipFlg = false;
      if ((0 <= (x + dx) && (x + dx) <= 7 && 0 <= (y + dy) && (y + dy) <= 7 && squares[x + dx][y + dy] != rival) || (dx == 0 && dy == 0)) {
        // 隣接セルが相手の石ではないときと、クリックしたセルについてはcontinue
        console.log('1');
        continue;
      }
      console.log('2');
      let nx = x + dx, ny = y + dy;
      for (let n = 0; 0 <= nx && nx <= 7 && 0 <= ny && ny <= 7 && !flipFlg && n < 7; n++) {
        // サーチする方向へ繰り返し処理
        if (squares[nx][ny] == 0) {
          // なにも無いセルに行き着いたらbreak
          console.log('3');
          break;
        } else if (squares[nx][ny] == me) {
          // 自分と同じ色を見つけたらひっくり返すフラグ
          console.log('4');
          flipFlg = true;
        }
        nx = nx + dx;
        ny = ny + dy;
      }
      console.log(flipFlg);
      if (flipFlg) {
        nx = x + dx;
        ny = y + dy;
        for (let n = 0; 0 <= nx && nx <= 7 && 0 <= ny && ny <= 7 && n < 7; n++) {
          squares[nx][ny] = me;
          nx = nx + dx;
          ny = ny + dy;
          if (squares[nx][ny] == me) {
            finFlip = true;
            break;
          }
        }
      }
    }
  }
  return finFlip;

}

class Board extends Component {
  // class Board extends React.Component {
  constructor(props) {
    super(props);
    let cell = new Array(8);
    for (let y = 0; y < 8; y++) {
      cell[y] = new Array(8).fill(0);
    }
    this.state = {
      squares: cell,
      blackIsNext: true
    }
    this.state.squares[3][3] = 1;
    this.state.squares[4][4] = 1;
    this.state.squares[4][3] = 2;
    this.state.squares[3][4] = 2;
  }


  handleClick(i, ii) {
    // console.dir(this.state.squares);
    // console.log("i:" + i + "  ii:" + ii);
    const squares = this.state.squares.slice();
    // console.dir(squares);
    if (!calcFlip(squares, i, ii, this.state.blackIsNext) || squares[i][ii] != 0) {
      return;
    }
    squares[i][ii] = this.state.blackIsNext ? 1 : 2;
    this.setState({
      squares: squares,
      blackIsNext: !this.state.blackIsNext
    });
  }

  renderSquare(i, ii) {
    return (
      // <Square
      //   value={this.state.squares[i]}
      //   onClick={() => this.handleClick(i)}
      // />
      <Cell
        value={this.state.squares[i][ii]}
        onClick={() => this.handleClick(i, ii)}
      />
    );
  }

  renderBoardRow(i) {
    return (
      <div className="board-row">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((ii) => this.renderSquare(i, ii))}
      </div>
    );
  }

  render() {
    // const winner = calcWinner(this.state.squares);
    const winner = false;
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.blackIsNext ? 'Black' : 'White');
    }



    return (
      <div>
        <div className="status">{status}</div>

        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => this.renderBoardRow(i))}

      </div>
    );
  }
}

class Test extends React.Component {
  constructor(props) {
    super(props);
  }

  // func(e){
  func = (e) => {
    // const text = this.state.text;
    const text = e.target.value;
    this.props.func(text);
    // console.log(text);
  }

  render() {
    // return (<input type="text" onChange={(e) => this.func(e)} />);

    // イベントハンドラを匿名関数で書いていないときは下のbindを適用する
    // bindはある関数(下のはfunc)に対し、引数で渡すものをその関数内でthisとして使えるように割り当てる
    // return (<input type="text" onChange={this.func.bind(this)} />);
    
    return (<input type="text" onChange={this.func} />);
  }
}

// connectデコレータを使う事で
// redux側のstoreをreactコンポーネント内で使えるようになる
// このデコレータ直後のreactコンポーネント内では、
// connect内で返したオブジェクトの値をpropsとして受取って使用できる
// ちなみにconnectの引数にはmapStateToPropsとmapDispatchToPropsを渡せる
// やっていることは→connect(mapStateToProps, mapDispatchToProps)(component)
@connect((store) => {
  // console.log(store);
  return {
    // user: store.userReducer.user
    user: store.user,
    // userFetched: store.users.fetched
    users: store.users
  };
})
class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      text: "hello"
    }
  }

  // nodeで下記サーバー立てるとfetchuserできる
  // var http = require('http');
  // http.createServer(function (req, res) {
  //   res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
  //   setTimeout(() => res.end('[{"ID": 1, "name": "misan"}, {"ID": 2, "name": "katu"}]'), 1000);
  // }).listen(18080);

  // fetchUser(){
  fetchUser = () => {
    this.props.dispatch({type: "FETCH_USERS_START"});
    Axios.get("http://localhost:18080")
      .then((res) => {
        this.props.dispatch({type: "RECIEVE_USERS", payload: res.data})
      })
      .catch((err) => {
        this.props.dispatch({type: "FETCH_USERS_ERROR", payload: err})
      });
  }
  


  // func(text){
  func = (text) => {
    console.log(text);
    this.setState({ text: text });
    console.log(this.state);
  }

  render() {
    console.log(this.props.users);
    let username = "初期値";
    if(this.props.users.users){
      username = this.props.users.users.map(user => <li key={user.ID}>ID: {user.ID} NAME:{user.name}</li>);
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
        <p className="test">
          {/* <Test func={(e) => this.func(e)}/> */}

          {/* イベントハンドラが匿名関数で書かれていないときは下のbindを使わなければならない */}
          {/* <Test func={this.func.bind(this)} /> */}
          
          <Test func={this.func} />
          <p>{this.state.text}</p>
        </p>
        <Link to="/">a</Link>
        <Link to="/foo">b</Link>
        <Link to="/bar">c</Link>
        <button onClick={this.fetchUser}>clickしてね</button>
        <ul>
          {username}
        </ul>
      </div>
    );
  }
}

function a() {
  return <p>path a</p>
}
function b(props) {
  return <div>
    <p>path b</p>
    <p>param : {props.match.params.attr}</p>
    <Link to="/">a</Link>
    <Link to="/foo">b</Link>
    <Link to="/foo/baz">baz</Link>
    <Link to="/bar">c</Link>
  </div>
}
function c(props) {
  const type = props.match.params.mode;
  return <div>
    <p>path c</p>
    <p>type : {type}</p>
    <Link to="/">a</Link>
    <Link to="/foo">b</Link>
    <Link to="/foo/baz">baz</Link>
    <Link to="/bar">c</Link>
  </div>
}

function Layout(props) {
  return (
    <div>
      <p>layout</p>
      <p>now path : {props.children}</p>
      {/* props.childrenに選択されているRouteが渡される */}
      {/* Routerの直下にRouteがあっても良いみたい */}
    </div>
  )
}

// ========================================

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Layout>
        <Route exact path="/" component={Game}></Route>
        <Route exact path="/foo" component={b}></Route>
        <Route path="/foo/:attr" component={b}></Route>
        {/* pathの最後に:attr等を指定するとそのコンポーネントでprops.match.params.attrとして呼び出せる
      簡単にgetパラメータが取得できる */}
        <Route path="/bar" component={c}></Route>
        <Route path="/bar/:mode(main|extra)" component={c}></Route>
      </Layout>
    </Router>
  </Provider>,
  document.getElementById('root')
);
