import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

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