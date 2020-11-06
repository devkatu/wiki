import React from 'react';

// error boundaryについて
export default class Error extends React.Component{
  constructor(props){
    super(props);
    this.state = { hasError: false};
  }
  
  // Errorコンポーネント配下でエラー発生するとこのメソッドが呼出される
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  // エラー情報をログ出力したりすることができる
  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
  }

  render(){
    // hasErrorによりレンダーするものを変える。
    // error有りならエラーメッセージを、error無しなら子コンポ―んネントを。
    if(this.state.hasError){
      return <h1>Component load Erorr!!</h1>
    }
    return this.props.children;
  }
}