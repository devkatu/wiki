import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

export default class BaseProductRow extends React.Component{
  constructor(props){
    super(props);

  }

  render(){
    return (
      <tr> 
        <td>{this.props.name}</td>
        <td>${this.props.price}</td>
      </tr>
    );
  }
}
