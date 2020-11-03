import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

export default class BaseProductTableContain extends React.Component{
  constructor(props){
    super(props);

  }

  render(){
    return (
      <div className="ProductTableContain"> 
        {/* props.children はこのコンポーネントの子要素に指定されているものとなる */}
        {this.props.children}
      </div>
    );
  }
}
