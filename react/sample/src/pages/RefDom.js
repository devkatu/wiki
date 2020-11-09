import React from 'react';


// ★RefとDOMについて
export default class RefDom extends React.Component {

  constructor(props) {
    super(props);
    // createRefメソッドでrefを作成することができる
    // この作成したrefをDOMのref属性に設定することで
    // reactからDOMを参照することができる。
    // 用途としては要素へのフォーカス、テキストの選択、
    // アニメーションの発火等でpropsやstateでできるだけ済ませてrefは使いすぎないようにする
    // →作成したref.currentで要素への参照となる
    //  ハンドラ内でref.current.focus()すると対象の要素へフォーカスされる
    this.textInputRef = React.createRef();
    this.customRef = React.createRef();

    // refはコンポーネントのマウント時に呼出されるコールバックであり、以下のようなアロー関数を
    // refに設定すると、引数のelementには対象の要素が代入される。この要素は.currentしなくても
    // 要素そのものが入っているのでそのままDOMのAPIが使える。
    // <input type="text" ref={this.setTextInput}/>
    // this.setTextInput = element => {
    //   this.textInput = element;
    // }
  }

  componentDidMount() {
    // コンポーネントがマウントされるとvalueにMountされました！
    this.customRef.current.value = "Mountされました！";

    // コンポーネントがマウントされるとフォーカスする
    this.textInputRef.current.focus();
  }

  render() {
    return (
      <div>
        <h2>REF(とDOM)について</h2>
        <p>
          <input
            type="text"
            placeholder="コンポーネントがマウンドされるとフォーカスされます"
            ref={this.textInputRef} />
        </p>
        <p>
          <CustomInput customRef={this.customRef}></CustomInput>
        </p>
      </div>
    );
  }
}

function CustomInput(props){
  return(
    <div>
      {/* ref(DOMへの参照を取得することができる)の受取り */}
      {/* 上流コンポーネントからpropsとして渡されたrefを受取って、refを設定するパターン */}
      <input 
        type="text"
        placeholder="コンポーネントがマウントされると値更新します"
        ref={props.customRef}/>
    </div>
  );
}
// 以下の方法でもrefを設定できる(refのフォワーディング)
// どちらでも変わらないが、高階コンポーネントを作るときにこちらのほうがいいらしい
// const CustomInput = React.forwardRef((props, ref) => 
//   <p>
//     <input type="text" placeholder="カスタムインプット" ref={ref}/>
//   </p>
// );

