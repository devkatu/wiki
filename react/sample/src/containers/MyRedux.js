import React from 'react'
import { connect } from 'react-redux'

// import MyRedux from '../pages/MyRedux';
// import { actions }  from '../actions/action'
import { addTodo, onChangeText, fetchTweets } from '../actions/action'


// ★reduxについて
// reactが扱うstateを外側で管理してくれる仕組み(フレームワーク)
// 通常のコンポーネントをreactとつないで(connect)
// stateやstateを更新する関数等をpropsとして貰うようになる
// connectするコンポーネントはcontainerと呼ばれる
// 詳しくは絵でみると分かりやすい

// 以下でダミーのローカルサーバーを立てておくと下記が有効
// $ node << EOF 
// var http = require('http');http.createServer(function (req, res) {res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});setTimeout(() => res.end('["hello","good morning"]'), 1000);}).listen(18080);

class MyRedux extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const todos = this.props.todos;
    const tweets = this.props.tweets;
    const fetching = this.props.fetching;
    return (
      <div>
        <h2>reduxについて</h2>
        <p>
          <input
            type="text"
            placeholder="todoを入力"
            onChange={(e) => this.props.onChangeText(e.target.value)} />
          <button onClick={() => this.props.addTodo()}>todo追加</button>
        </p>
        {
          0 < todos.length && todos.map(todo => <li>{todo}</li>)
        }
        <p>
          <p><button onClick={() => this.props.fetchTweets()}>tweetsを確認</button></p>
          {fetching && <p>tweetsを確認中...</p>}
          {0 < tweets.length && tweets.map(tweet => <p>{tweet}</p>)}
          {this.props.error && <p>{this.props.error.toString()}</p>}
        </p>


        <p>全体観</p><img src="./images/image1.png" alt="" />
        <p>ユーザー入力によりactionの内容定義したオブジェクトを生成</p><img src="./images/image2.png" alt="" />
        <p>dispatch(action)関数を実行して、actionオブジェクトをstoreへ</p><img src="./images/image3.png" alt="" />
        <p>store内ではactionとともに現在のstateをreducerへ渡す</p><img src="./images/image4.png" alt="" />
        <p>reducerはaction、現在stateにより、新しいstateを作る</p><img src="./images/image5.png" alt="" />
        <p>新しいstateを保存する</p><img src="./images/image6.png" alt="" />
        <p>stateやreducerは複雑になると分けた方がよい</p><img src="./images/image7.png" alt="" />
        <p>redux公式より。APIへの問合せとかも含めた全体観</p><img src="./image/image8.gif" alt=""/>
      </div>
    );
  }
}




// ★mapStateToPropsは
// 第一引数「state」はreduxで管理している全てのstateを持っている
// 第二引数「props」はconnectしたcomponent本来のpropsを取得する
// connectしたcomponentで「this.props.todos」とアクセスすることで
// reducerで管理しているstateの値を取得できるように設定することができる
// state、reducerが一個のみであればstate.~~で良いが、
// 複数あるときはcombineReducerで設定したオブジェクトのプロパティを間に挟み、
// state.combineReducersで設定したプロパティ.~~でアクセスできる
function mapStateToProps(state, props) {
  return {
    todos: state.todoReducer.todos,
    tweets: state.fetchReducer.tweets,
    fetching: state.fetchReducer.fetching,
    error: state.fetchReducer.error
  }
}

// ★mapDispatchToPropsは
// connectしたcomponentで「this.props.addTodo」を実行すると、
// reducerに対しactionとstateを渡す(dispatchする)
// これらのdispatchする関数はactionで定義されており、
// actionタイプやペイロードを返す(actionオブジェクト)ようになっている
function mapDispatchToProps(dispatch) {
  return {
    addTodo: () => { dispatch(addTodo()) },
    onChangeText: (value) => { dispatch(onChangeText(value)) },
    fetchTweets: () => { dispatch(fetchTweets()) }
  }
}

// ★connect()について
// コンポーネントに対しreduxで管理しているstateをpropsとして渡せるように、
// またreduxで管理しているstateを更新する関数(dispatch())を割り当てる
// 第一引数はコンポーネントに渡すpropsの制御
// 第二引数はreducerを呼出してreduxで管理しているstateを更新する
// 最後の(MyRedux)は取得したデータをpropsとして扱いたいコンポーネントになる
export default connect(mapStateToProps, mapDispatchToProps)(MyRedux);